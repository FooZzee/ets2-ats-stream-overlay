/**
 * @file plugin.cpp
 * @brief Native x64 SCS Telemetry SDK 1.16 plugin writing live ETS2 / ATS data
 *        as a torn-read-safe UTF-8 JSON payload into Win32 Shared Memory
 *        ("Local\FooZzeeSCSTelemetry", 64 KB).
 */

#include <windows.h>

#include <algorithm>
#include <cmath>
#include <cstdint>
#include <cstdio>
#include <cstring>
#include <string>

#include "scssdk_telemetry.h"
#include "eurotrucks2/scssdk_eut2.h"
#include "eurotrucks2/scssdk_telemetry_eut2.h"
#include "amtrucks/scssdk_ats.h"
#include "amtrucks/scssdk_telemetry_ats.h"
#include "common/scssdk_telemetry_common_gameplay_events.h"

namespace {

constexpr uint32_t kSharedMemSize      = 65536u;
constexpr uint32_t kMaxJsonPayload     = 65000u;
constexpr uint32_t kTelemetryMagic     = 0x53435331u; // 'SCS1'
constexpr uint32_t kTelemetryVersion   = 1u;
constexpr uint64_t kFrameThrottleMs    = 50ULL;       // ~20 Hz max serialization rate
constexpr const char* kSharedMemName   = "Local\\FooZzeeSCSTelemetry";

#pragma pack(push, 1)
struct SharedTelemetryHeader {
  uint32_t magic;
  uint32_t version;
  volatile uint32_t sequence;
  uint64_t timestampMs;
  uint8_t  connected;
  uint8_t  gameId;        // 0 = unknown, 1 = ETS2, 2 = ATS
  uint8_t  paused;        // 0 = driving, 1 = paused / menu
  uint32_t payloadLength;
  char     jsonPayload[kMaxJsonPayload];
};
#pragma pack(pop)

static_assert(sizeof(SharedTelemetryHeader) <= kSharedMemSize, "SharedTelemetryHeader must fit in 64 KB");

struct RuntimeState {
  uint8_t  gameId = 0;
  bool     paused = true;
  bool     chTrailer0Connected = false;
  bool     chTrailerLegacyConnected = false;

  // Movement & controls (m/s from SDK)
  float    speedMs = 0.0f;
  float    engineRpm = 0.0f;
  int32_t  engineGear = 0;
  int32_t  displayedGear = 0;
  float    cruiseControlMs = 0.0f;
  float    speedLimitMs = 0.0f;
  float    inputThrottle = 0.0f;
  float    inputBrake = 0.0f;
  float    inputClutch = 0.0f;
  float    inputSteering = 0.0f;
  float    effectiveThrottle = 0.0f;
  float    effectiveBrake = 0.0f;
  float    effectiveClutch = 0.0f;
  float    effectiveSteering = 0.0f;

  // Dashboard lamps & statuses
  uint8_t  blinkL = 0;
  uint8_t  blinkR = 0;
  uint8_t  hazard = 0;
  uint8_t  parkLight = 0;
  uint8_t  lowBeam = 0;
  uint8_t  highBeam = 0;
  uint8_t  beacon = 0;
  uint8_t  wipers = 0;
  uint8_t  parkBrake = 0;
  uint8_t  motorBrake = 0;
  uint32_t retarder = 0;
  uint8_t  diffLock = 0;
  uint8_t  liftAxle = 0;
  uint8_t  trailerLiftAxle = 0;
  uint8_t  electric = 1;
  uint8_t  engine = 1;
  int32_t  restStop = 0;
  float    busSat = 0.0f;

  // Warnings & sensors
  uint8_t  fuelWarn = 0;
  uint8_t  airWarn = 0;
  uint8_t  oilWarn = 0;
  uint8_t  waterWarn = 0;
  uint8_t  batteryWarn = 0;
  float    odometerKm = 0.0f;
  float    fuelAmount = 0.0f;
  float    fuelAvgLKm = 0.0f;     // SDK L/km -> *100 for L/100km
  float    fuelRangeKm = 0.0f;
  float    adblueAmount = 0.0f;
  float    oilTemperature = 0.0f;
  float    waterTemperature = 0.0f;
  float    airPressurePsi = 0.0f;
  float    batteryVoltage = 0.0f;

  // Navigation & time
  float    navDistanceM = 0.0f;
  float    navTimeSec = 0.0f;
  float    localScale = 19.0f;
  uint32_t gameTimeMin = 0;

  // Wear (0.0 .. 1.0)
  float    wearEngine = 0.0f;
  float    wearTransmission = 0.0f;
  float    wearCabin = 0.0f;
  float    wearChassis = 0.0f;
  float    wearWheels = 0.0f;
  float    wearTrailerChassis = 0.0f;
  float    wearTrailerBody = 0.0f;
  float    wearTrailerWheels = 0.0f;
  float    jobCargoDamage = 0.0f;
  float    trailerCargoDamage = 0.0f;

  // Truck configuration
  std::string truckBrandId;
  std::string truckBrand;
  std::string truckId;
  std::string truckName;
  std::string licensePlate;
  float       fuelCapacity = 0.0f;
  float       adblueCapacity = 0.0f;
  float       rpmLimit = 0.0f;
  uint32_t    forwardGears = 0;
  uint32_t    reverseGears = 0;

  // Trailer configuration
  bool        hasTrailerConfig = false;
  std::string trailerId;
  std::string trailerBrand;
  std::string trailerName;
  std::string trailerChainType;
  std::string trailerBodyType;

  // Job configuration
  bool        hasJob = false;
  bool        isBusJob = false;
  bool        cargoLoaded = false;
  bool        specialJob = false;
  std::string cargoId;
  std::string cargo;
  float       cargoMassKg = 0.0f;
  std::string sourceCity;
  std::string sourceCityId;
  std::string sourceCompany;
  std::string sourceCompanyId;
  std::string destinationCity;
  std::string destinationCityId;
  std::string destinationCompany;
  std::string destinationCompanyId;
  std::string sourceStopCity;
  std::string sourceStopName;
  std::string sourceStopId;
  std::string destinationStopCity;
  std::string destinationStopName;
  std::string destinationStopId;
  uint32_t    plannedDistanceKm = 0;
  uint64_t    income = 0;
  std::string jobMarket;
};

HANDLE                 g_mapHandle      = nullptr;
SharedTelemetryHeader* g_sharedPtr      = nullptr;
scs_log_t              g_gameLog        = nullptr;
uint64_t               g_lastFlushMs    = 0;
RuntimeState           g_state{};

struct GameEventState {
  uint32_t    seq = 0;
  std::string type;
  int64_t     amount = 0;
  std::string offence;
  std::string source;
  std::string target;
  int32_t     xp = 0;
};

GameEventState g_lastEvent{};

inline void ClearJobConfig() {
  g_state.hasJob = false;
  g_state.isBusJob = false;
  g_state.cargoLoaded = false;
  g_state.specialJob = false;
  g_state.cargoId.clear();
  g_state.cargo.clear();
  g_state.cargoMassKg = 0.0f;
  g_state.sourceCity.clear();
  g_state.sourceCityId.clear();
  g_state.sourceCompany.clear();
  g_state.sourceCompanyId.clear();
  g_state.destinationCity.clear();
  g_state.destinationCityId.clear();
  g_state.destinationCompany.clear();
  g_state.destinationCompanyId.clear();
  g_state.sourceStopCity.clear();
  g_state.sourceStopName.clear();
  g_state.sourceStopId.clear();
  g_state.destinationStopCity.clear();
  g_state.destinationStopName.clear();
  g_state.destinationStopId.clear();
  g_state.plannedDistanceKm = 0;
  g_state.income = 0;
  g_state.jobMarket.clear();
}

inline void ClearTrailerConfig() {
  g_state.hasTrailerConfig = false;
  g_state.trailerId.clear();
  g_state.trailerBrand.clear();
  g_state.trailerName.clear();
  g_state.trailerChainType.clear();
  g_state.trailerBodyType.clear();
}

void AppendJsonString(std::string& out, const std::string& val) {
  out.push_back('"');
  for (unsigned char ch : val) {
    switch (ch) {
      case '"':  out += "\\\""; break;
      case '\\': out += "\\\\"; break;
      case '\b': out += "\\b";  break;
      case '\f': out += "\\f";  break;
      case '\n': out += "\\n";  break;
      case '\r': out += "\\r";  break;
      case '\t': out += "\\t";  break;
      default:
        if (ch < 0x20u) {
          char esc[8];
          std::snprintf(esc, sizeof(esc), "\\u%04x", static_cast<unsigned int>(ch));
          out += esc;
        } else {
          out.push_back(static_cast<char>(ch));
        }
        break;
    }
  }
  out.push_back('"');
}

void AppendFloat(std::string& out, float value, int decimals = 3) {
  if (!std::isfinite(value)) {
    out += "0";
    return;
  }
  char buf[48];
  std::snprintf(buf, sizeof(buf), "%.*f", decimals, static_cast<double>(value));
  out += buf;
}

std::string BuildTelemetryJson() {
  const bool trailerConnected = g_state.chTrailer0Connected || g_state.chTrailerLegacyConnected;
  const char* gameStr = (g_state.gameId == 1) ? "ets2" : ((g_state.gameId == 2) ? "ats" : "");

  const float fuelAvgL100 = (std::isfinite(g_state.fuelAvgLKm) && g_state.fuelAvgLKm > 0.0f)
    ? (g_state.fuelAvgLKm * 100.0f)
    : 0.0f;

  const float wTrailer = (std::max)({
    std::isfinite(g_state.wearTrailerChassis) ? g_state.wearTrailerChassis : 0.0f,
    std::isfinite(g_state.wearTrailerBody)    ? g_state.wearTrailerBody    : 0.0f,
    std::isfinite(g_state.wearTrailerWheels)  ? g_state.wearTrailerWheels  : 0.0f
  });

  const float jobDmg = std::isfinite(g_state.jobCargoDamage) ? g_state.jobCargoDamage : 0.0f;
  const float trCargoDmg = std::isfinite(g_state.trailerCargoDamage) ? g_state.trailerCargoDamage : 0.0f;
  const float cargoDmg = (std::max)(jobDmg, trCargoDmg);

  const float effThrottle = (std::fabs(g_state.effectiveThrottle) > 0.0001f) ? g_state.effectiveThrottle : g_state.inputThrottle;
  const float effBrake    = (std::fabs(g_state.effectiveBrake)    > 0.0001f) ? g_state.effectiveBrake    : g_state.inputBrake;
  const float effClutch   = (std::fabs(g_state.effectiveClutch)   > 0.0001f) ? g_state.effectiveClutch   : g_state.inputClutch;
  const float effSteer    = (std::fabs(g_state.effectiveSteering) > 0.0001f) ? g_state.effectiveSteering : g_state.inputSteering;

  std::string j;
  j.reserve(2560);

  // srv
  j += "{\"srv\":{\"connected\":true,\"paused\":";
  j += (g_state.paused ? "true" : "false");
  j += ",\"game\":"; AppendJsonString(j, gameStr);
  j += ",\"source\":\"scs-sdk-shm\"}";

  // cfg
  j += ",\"cfg\":{\"game\":"; AppendJsonString(j, gameStr);
  j += ",\"active\":"; j += (g_state.hasJob ? "true" : "false");
  j += ",\"hasJob\":"; j += (g_state.hasJob ? "true" : "false");
  j += ",\"truck\":{\"id\":"; AppendJsonString(j, g_state.truckId);
  j += ",\"brandId\":"; AppendJsonString(j, g_state.truckBrandId);
  j += ",\"brand\":"; AppendJsonString(j, g_state.truckBrand);
  j += ",\"name\":"; AppendJsonString(j, g_state.truckName);
  j += ",\"license\":{\"plate\":"; AppendJsonString(j, g_state.licensePlate); j += "}";
  j += ",\"fuelCapacity\":"; AppendFloat(j, g_state.fuelCapacity, 1);
  j += ",\"adblueCapacity\":"; AppendFloat(j, g_state.adblueCapacity, 1);
  j += ",\"forwardGears\":"; j += std::to_string(g_state.forwardGears);
  j += ",\"reverseGears\":"; j += std::to_string(g_state.reverseGears);
  j += ",\"rpmLimit\":"; AppendFloat(j, g_state.rpmLimit, 0);
  j += "}";

  j += ",\"source\":{\"city\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCity : "");
  j += ",\"id\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCityId : "");
  j += ",\"cityId\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCityId : "");
  j += ",\"company\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCompany : "");
  j += ",\"companyId\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCompanyId : "");
  j += "}";
  j += ",\"destination\":{\"city\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCity : "");
  j += ",\"id\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCityId : "");
  j += ",\"cityId\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCityId : "");
  j += ",\"company\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCompany : "");
  j += ",\"companyId\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCompanyId : "");
  j += "}";
  j += ",\"sourceCityId\":"; AppendJsonString(j, g_state.hasJob ? g_state.sourceCityId : "");
  j += ",\"destinationCityId\":"; AppendJsonString(j, g_state.hasJob ? g_state.destinationCityId : "");
  j += ",\"isBusJob\":"; j += (g_state.isBusJob ? "true" : "false");
  j += ",\"bus\":{\"satisfaction\":"; AppendFloat(j, g_state.isBusJob ? g_state.busSat : 0.0f, 2);
  j += ",\"sourceStop\":{\"city\":"; AppendJsonString(j, g_state.isBusJob ? g_state.sourceStopCity : "");
  j += ",\"cityId\":"; AppendJsonString(j, g_state.isBusJob ? g_state.sourceStopId : "");
  j += ",\"company\":"; AppendJsonString(j, g_state.isBusJob ? g_state.sourceStopName : "");
  j += ",\"id\":"; AppendJsonString(j, g_state.isBusJob ? g_state.sourceStopId : "");
  j += "},\"destinationStop\":{\"city\":"; AppendJsonString(j, g_state.isBusJob ? g_state.destinationStopCity : "");
  j += ",\"cityId\":"; AppendJsonString(j, g_state.isBusJob ? g_state.destinationStopId : "");
  j += ",\"company\":"; AppendJsonString(j, g_state.isBusJob ? g_state.destinationStopName : "");
  j += ",\"id\":"; AppendJsonString(j, g_state.isBusJob ? g_state.destinationStopId : "");
  j += "}}";
  j += ",\"cargo\":{\"id\":"; AppendJsonString(j, g_state.hasJob ? g_state.cargoId : "");
  j += ",\"name\":"; AppendJsonString(j, g_state.hasJob ? g_state.cargo : "");
  j += ",\"mass\":"; AppendFloat(j, g_state.hasJob ? g_state.cargoMassKg : 0.0f, 1);
  j += "}";
  j += ",\"planned_distance\":{\"km\":"; j += std::to_string(g_state.hasJob ? g_state.plannedDistanceKm : 0u); j += "}";
  j += ",\"income\":"; j += std::to_string(g_state.hasJob ? g_state.income : 0ULL);
  j += ",\"job\":{\"market\":"; AppendJsonString(j, g_state.hasJob ? g_state.jobMarket : "");
  j += ",\"cargoLoaded\":"; j += (g_state.cargoLoaded ? "true" : "false");
  j += ",\"specialJob\":"; j += (g_state.specialJob ? "true" : "false");
  j += ",\"busJob\":"; j += (g_state.isBusJob ? "true" : "false");
  j += ",\"isBusJob\":"; j += (g_state.isBusJob ? "true" : "false");
  j += ",\"marketType\":"; AppendJsonString(j, g_state.isBusJob ? "bus_job" : (g_state.jobMarket.empty() ? "freight" : g_state.jobMarket));
  j += ",\"jobType\":"; AppendJsonString(j, !g_state.hasJob ? "free_roam" : (g_state.isBusJob ? "bus_job" : "freight"));
  j += "}";
  j += ",\"trailer\":{\"attached\":"; j += (trailerConnected ? "true" : "false");
  j += ",\"configured\":"; j += (g_state.hasTrailerConfig ? "true" : "false");
  j += ",\"id\":"; AppendJsonString(j, g_state.trailerId);
  j += ",\"brand\":"; AppendJsonString(j, g_state.trailerBrand);
  j += ",\"name\":"; AppendJsonString(j, g_state.trailerName);
  j += ",\"chainType\":"; AppendJsonString(j, g_state.trailerChainType);
  j += ",\"bodyType\":"; AppendJsonString(j, g_state.trailerBodyType);
  j += "}}";

  // tel
  j += ",\"tel\":{\"game\":"; AppendJsonString(j, gameStr);
  j += ",\"paused\":"; j += (g_state.paused ? "true" : "false");
  j += ",\"speedMs\":"; AppendFloat(j, g_state.speedMs, 4);
  j += ",\"speedLimitMs\":"; AppendFloat(j, g_state.speedLimitMs, 4);
  j += ",\"cruiseMs\":"; AppendFloat(j, g_state.cruiseControlMs, 4);
  j += ",\"rpm\":"; AppendFloat(j, g_state.engineRpm, 1);
  j += ",\"rpmLimit\":"; AppendFloat(j, g_state.rpmLimit, 0);
  j += ",\"gear\":"; j += std::to_string(g_state.engineGear);
  j += ",\"displayedGear\":"; j += std::to_string(g_state.displayedGear);
  j += ",\"throttle\":"; AppendFloat(j, effThrottle, 4);
  j += ",\"brake\":"; AppendFloat(j, effBrake, 4);
  j += ",\"clutch\":"; AppendFloat(j, effClutch, 4);
  j += ",\"steer\":"; AppendFloat(j, effSteer, 4);
  j += ",\"inputThrottle\":"; AppendFloat(j, g_state.inputThrottle, 4);
  j += ",\"inputBrake\":"; AppendFloat(j, g_state.inputBrake, 4);
  j += ",\"inputClutch\":"; AppendFloat(j, g_state.inputClutch, 4);
  j += ",\"inputSteer\":"; AppendFloat(j, g_state.inputSteering, 4);
  j += ",\"odometer\":"; AppendFloat(j, g_state.odometerKm, 2);
  j += ",\"fuel\":"; AppendFloat(j, g_state.fuelAmount, 2);
  j += ",\"fuelCap\":"; AppendFloat(j, g_state.fuelCapacity, 1);
  j += ",\"fuelAvg\":"; AppendFloat(j, fuelAvgL100, 2);
  j += ",\"fuelRange\":"; AppendFloat(j, g_state.fuelRangeKm, 1);
  j += ",\"adblue\":"; AppendFloat(j, g_state.adblueAmount, 2);
  j += ",\"adblueCap\":"; AppendFloat(j, g_state.adblueCapacity, 1);
  j += ",\"oilTemp\":"; AppendFloat(j, g_state.oilTemperature, 1);
  j += ",\"waterTemp\":"; AppendFloat(j, g_state.waterTemperature, 1);
  j += ",\"air\":"; AppendFloat(j, g_state.airPressurePsi, 2);
  j += ",\"battery\":"; AppendFloat(j, g_state.batteryVoltage, 2);
  j += ",\"navDist\":"; AppendFloat(j, g_state.navDistanceM, 1);
  j += ",\"navTime\":"; AppendFloat(j, g_state.navTimeSec, 1);
  j += ",\"scale\":"; AppendFloat(j, g_state.localScale > 0.0f ? g_state.localScale : 19.0f, 2);
  j += ",\"gameTime\":"; j += std::to_string(g_state.gameTimeMin);
  j += ",\"blinkL\":"; j += (g_state.blinkL ? "true" : "false");
  j += ",\"blinkR\":"; j += (g_state.blinkR ? "true" : "false");
  j += ",\"hazard\":"; j += (g_state.hazard ? "true" : "false");
  j += ",\"parkLight\":"; j += (g_state.parkLight ? "true" : "false");
  j += ",\"lowBeam\":"; j += (g_state.lowBeam ? "true" : "false");
  j += ",\"highBeam\":"; j += (g_state.highBeam ? "true" : "false");
  j += ",\"beacon\":"; j += (g_state.beacon ? "true" : "false");
  j += ",\"wipers\":"; j += (g_state.wipers ? "true" : "false");
  j += ",\"parkBrake\":"; j += (g_state.parkBrake ? "true" : "false");
  j += ",\"motorBrake\":"; j += (g_state.motorBrake ? "true" : "false");
  j += ",\"retarder\":"; j += std::to_string(g_state.retarder);
  j += ",\"diffLock\":"; j += (g_state.diffLock ? "true" : "false");
  j += ",\"liftAxle\":"; j += (g_state.liftAxle ? "true" : "false");
  j += ",\"trailerLiftAxle\":"; j += (g_state.trailerLiftAxle ? "true" : "false");
  j += ",\"fuelWarn\":"; j += (g_state.fuelWarn ? "true" : "false");
  j += ",\"airWarn\":"; j += (g_state.airWarn ? "true" : "false");
  j += ",\"oilWarn\":"; j += (g_state.oilWarn ? "true" : "false");
  j += ",\"waterWarn\":"; j += (g_state.waterWarn ? "true" : "false");
  j += ",\"batteryWarn\":"; j += (g_state.batteryWarn ? "true" : "false");
  j += ",\"wEngine\":"; AppendFloat(j, g_state.wearEngine, 4);
  j += ",\"wTrans\":"; AppendFloat(j, g_state.wearTransmission, 4);
  j += ",\"wCabin\":"; AppendFloat(j, g_state.wearCabin, 4);
  j += ",\"wChassis\":"; AppendFloat(j, g_state.wearChassis, 4);
  j += ",\"wWheels\":"; AppendFloat(j, g_state.wearWheels, 4);
  j += ",\"wTrailer\":"; AppendFloat(j, trailerConnected ? wTrailer : 0.0f, 4);
  j += ",\"cargoDmg\":"; AppendFloat(j, cargoDmg, 4);
  j += ",\"jobDmg\":"; AppendFloat(j, jobDmg, 4);
  j += ",\"trailer\":{\"connected\":"; j += (trailerConnected ? "true" : "false");
  j += ",\"attached\":"; j += (trailerConnected ? "true" : "false");
  j += ",\"liftAxle\":"; j += (g_state.trailerLiftAxle ? "true" : "false");
  j += "}";
  j += ",\"trailerAttached\":"; j += (trailerConnected ? "true" : "false");
  j += ",\"busSat\":"; AppendFloat(j, g_state.busSat, 4);
  j += ",\"restStop\":"; j += std::to_string(g_state.restStop);
  j += ",\"electric\":"; j += (g_state.electric ? "true" : "false");
  j += ",\"engine\":"; j += (g_state.engine ? "true" : "false");
  j += "}";

  // lastEvent
  j += ",\"lastEvent\":{\"seq\":"; j += std::to_string(g_lastEvent.seq);
  j += ",\"type\":"; AppendJsonString(j, g_lastEvent.type);
  j += ",\"amount\":"; j += std::to_string(g_lastEvent.amount);
  j += ",\"offence\":"; AppendJsonString(j, g_lastEvent.offence);
  j += ",\"source\":"; AppendJsonString(j, g_lastEvent.source);
  j += ",\"target\":"; AppendJsonString(j, g_lastEvent.target);
  j += ",\"xp\":"; j += std::to_string(g_lastEvent.xp);
  j += "}";

  j += "}";

  return j;
}

void WriteSharedMemorySnapshot(bool isConnected, bool forceWrite) {
  if (!g_sharedPtr) return;

  const uint64_t nowMs = GetTickCount64();
  if (!forceWrite && (nowMs - g_lastFlushMs) < kFrameThrottleMs) {
    return;
  }
  g_lastFlushMs = nowMs;

  std::string payload = isConnected
    ? BuildTelemetryJson()
    : std::string("{\"srv\":{\"connected\":false},\"lastEvent\":{\"seq\":0,\"type\":\"\",\"amount\":0,\"offence\":\"\",\"source\":\"\",\"target\":\"\",\"xp\":0}}");
  uint32_t payloadLen = static_cast<uint32_t>((std::min)(payload.size(), static_cast<size_t>(kMaxJsonPayload - 1u)));

  uint32_t seq = g_sharedPtr->sequence;
  if ((seq & 1u) != 0u) {
    ++seq;
  }

  g_sharedPtr->sequence = seq + 1u; // odd = update in progress
  MemoryBarrier();

  g_sharedPtr->magic         = kTelemetryMagic;
  g_sharedPtr->version       = kTelemetryVersion;
  g_sharedPtr->timestampMs   = nowMs;
  g_sharedPtr->connected     = isConnected ? 1u : 0u;
  g_sharedPtr->gameId        = g_state.gameId;
  g_sharedPtr->paused        = g_state.paused ? 1u : 0u;
  g_sharedPtr->payloadLength = payloadLen;

  if (payloadLen > 0) {
    std::memcpy(g_sharedPtr->jsonPayload, payload.data(), payloadLen);
  }
  g_sharedPtr->jsonPayload[payloadLen] = '\0';

  MemoryBarrier();
  g_sharedPtr->sequence = seq + 2u; // even = consistent snapshot ready
}

void CleanupSharedMemory() {
  if (g_sharedPtr) {
    WriteSharedMemorySnapshot(false, true);
    UnmapViewOfFile(g_sharedPtr);
    g_sharedPtr = nullptr;
  }
  if (g_mapHandle) {
    CloseHandle(g_mapHandle);
    g_mapHandle = nullptr;
  }
}

bool InitSharedMemory() {
  SECURITY_DESCRIPTOR sd;
  SECURITY_ATTRIBUTES sa;
  sa.nLength = sizeof(sa);
  sa.bInheritHandle = FALSE;
  sa.lpSecurityDescriptor = nullptr;

  if (InitializeSecurityDescriptor(&sd, SECURITY_DESCRIPTOR_REVISION)) {
    if (SetSecurityDescriptorDacl(&sd, TRUE, nullptr, FALSE)) {
      sa.lpSecurityDescriptor = &sd;
    }
  }

  g_mapHandle = CreateFileMappingA(
    INVALID_HANDLE_VALUE,
    sa.lpSecurityDescriptor ? &sa : nullptr,
    PAGE_READWRITE,
    0,
    kSharedMemSize,
    kSharedMemName
  );
  if (!g_mapHandle) {
    return false;
  }

  g_sharedPtr = static_cast<SharedTelemetryHeader*>(
    MapViewOfFile(g_mapHandle, FILE_MAP_ALL_ACCESS, 0, 0, kSharedMemSize)
  );
  if (!g_sharedPtr) {
    CleanupSharedMemory();
    return false;
  }

  std::memset(g_sharedPtr, 0, kSharedMemSize);
  WriteSharedMemorySnapshot(true, true);
  return true;
}

// Channel callbacks
SCSAPI_VOID OnChannelFloat(const scs_string_t, const scs_u32_t, const scs_value_t* const value, const scs_context_t context) {
  auto* dst = static_cast<float*>(context);
  if (!dst) return;
  if (!value) {
    *dst = 0.0f;
    return;
  }
  if (value->type == SCS_VALUE_TYPE_float) {
    *dst = value->value_float.value;
  } else if (value->type == SCS_VALUE_TYPE_double) {
    *dst = static_cast<float>(value->value_double.value);
  }
}

SCSAPI_VOID OnChannelS32(const scs_string_t, const scs_u32_t, const scs_value_t* const value, const scs_context_t context) {
  auto* dst = static_cast<int32_t*>(context);
  if (!dst) return;
  *dst = (value && value->type == SCS_VALUE_TYPE_s32) ? value->value_s32.value : 0;
}

SCSAPI_VOID OnChannelU32(const scs_string_t, const scs_u32_t, const scs_value_t* const value, const scs_context_t context) {
  auto* dst = static_cast<uint32_t*>(context);
  if (!dst) return;
  *dst = (value && value->type == SCS_VALUE_TYPE_u32) ? value->value_u32.value : 0u;
}

SCSAPI_VOID OnChannelBoolU8(const scs_string_t, const scs_u32_t, const scs_value_t* const value, const scs_context_t context) {
  auto* dst = static_cast<uint8_t*>(context);
  if (!dst) return;
  if (!value) {
    *dst = 0u;
    return;
  }
  if (value->type == SCS_VALUE_TYPE_bool) {
    *dst = value->value_bool.value ? 1u : 0u;
  } else if (value->type == SCS_VALUE_TYPE_u32) {
    *dst = value->value_u32.value ? 1u : 0u;
  } else if (value->type == SCS_VALUE_TYPE_s32) {
    *dst = value->value_s32.value ? 1u : 0u;
  }
}

SCSAPI_VOID OnChannelBoolFlag(const scs_string_t, const scs_u32_t, const scs_value_t* const value, const scs_context_t context) {
  auto* dst = static_cast<bool*>(context);
  if (!dst) return;
  *dst = (value && value->type == SCS_VALUE_TYPE_bool && value->value_bool.value != 0);
}

// Event callbacks
SCSAPI_VOID OnFrameEnd(const scs_event_t, const void*, const scs_context_t) {
  WriteSharedMemorySnapshot(true, false);
}

SCSAPI_VOID OnPauseOrStartEvent(const scs_event_t event, const void*, const scs_context_t) {
  if (event == SCS_TELEMETRY_EVENT_paused) {
    g_state.paused = true;
  } else if (event == SCS_TELEMETRY_EVENT_started) {
    g_state.paused = false;
  }
  WriteSharedMemorySnapshot(true, true);
}

inline bool TryGetAttrString(const scs_named_value_t* attr, std::string& out) {
  if (attr->value.type == SCS_VALUE_TYPE_string && attr->value.value_string.value) {
    out = attr->value.value_string.value;
    return true;
  }
  return false;
}

inline bool IsValidPlaceName(const std::string& str) {
  if (str.empty()) return false;
  std::string lower;
  lower.reserve(str.size());
  for (char ch : str) {
    lower.push_back(static_cast<char>(std::tolower(static_cast<unsigned char>(ch))));
  }
  // Обрезаем начальные и конечные пробелы
  size_t first = lower.find_first_not_of(" \t\r\n");
  if (first == std::string::npos) return false;
  size_t last = lower.find_last_not_of(" \t\r\n");
  lower = lower.substr(first, last - first + 1);

  // Фильтруем технические токены карты и движка
  if (lower == "city" || lower == "viewpoint" || lower == "viewpoints" ||
      lower == "stop" || lower == "stops" || lower == "bus_stop" || lower == "bus_stops" ||
      lower == "station" || lower == "stations" || lower == "landmark" || lower == "scenic" ||
      lower == "null" || lower == "undefined" || lower == "none" || lower == "n/a" ||
      lower == "-" || lower == "--") {
    return false;
  }
  return true;
}

inline bool TryGetAttrFloat(const scs_named_value_t* attr, float& out) {
  if (attr->value.type == SCS_VALUE_TYPE_float) {
    out = attr->value.value_float.value;
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_double) {
    out = static_cast<float>(attr->value.value_double.value);
    return true;
  }
  return false;
}

inline bool TryGetAttrU32(const scs_named_value_t* attr, uint32_t& out) {
  if (attr->value.type == SCS_VALUE_TYPE_u32) {
    out = attr->value.value_u32.value;
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_s32 && attr->value.value_s32.value >= 0) {
    out = static_cast<uint32_t>(attr->value.value_s32.value);
    return true;
  }
  return false;
}

inline bool TryGetAttrU64(const scs_named_value_t* attr, uint64_t& out) {
  if (attr->value.type == SCS_VALUE_TYPE_u64) {
    out = attr->value.value_u64.value;
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_s64 && attr->value.value_s64.value >= 0) {
    out = static_cast<uint64_t>(attr->value.value_s64.value);
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_u32) {
    out = attr->value.value_u32.value;
    return true;
  }
  return false;
}

inline bool TryGetAttrS64(const scs_named_value_t* attr, int64_t& out) {
  if (!attr) return false;
  if (attr->value.type == SCS_VALUE_TYPE_s64) {
    out = attr->value.value_s64.value;
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_u64) {
    out = static_cast<int64_t>(attr->value.value_u64.value);
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_s32) {
    out = static_cast<int64_t>(attr->value.value_s32.value);
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_u32) {
    out = static_cast<int64_t>(attr->value.value_u32.value);
    return true;
  }
  return false;
}

inline bool TryGetAttrS32(const scs_named_value_t* attr, int32_t& out) {
  if (!attr) return false;
  if (attr->value.type == SCS_VALUE_TYPE_s32) {
    out = attr->value.value_s32.value;
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_u32) {
    out = static_cast<int32_t>(attr->value.value_u32.value);
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_s64) {
    out = static_cast<int32_t>(attr->value.value_s64.value);
    return true;
  }
  if (attr->value.type == SCS_VALUE_TYPE_u64) {
    out = static_cast<int32_t>(attr->value.value_u64.value);
    return true;
  }
  return false;
}

void DumpEventAttributes(const char*, const char*, const scs_named_value_t*) {
  // Debug disk dump disabled in production
}

SCSAPI_VOID OnGameplayEvent(const scs_event_t, const void* const event_info, const scs_context_t) {
  const auto* info = static_cast<const scs_telemetry_gameplay_event_t*>(event_info);
  if (!info || !info->id) return;
  DumpEventAttributes("GAMEPLAY", info->id, info->attributes);

  const char* eventId = info->id;
  std::string eventType;
  int64_t     eventAmount = 0;
  std::string eventOffence;
  std::string eventSource;
  std::string eventTarget;
  int32_t     eventXp = 0;
  bool        handled = false;

  if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_player_fined) == 0 ||
      std::strcmp(eventId, "player.fine.offence") == 0 ||
      std::strcmp(eventId, "player.fine") == 0) {
    eventType = "fine";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_fine_offence) == 0 ||
            std::strcmp(attr->name, "fine_offence") == 0 ||
            std::strcmp(attr->name, "offence") == 0) {
          TryGetAttrString(attr, eventOffence);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_fine_amount) == 0 ||
                   std::strcmp(attr->name, "fine_amount") == 0 ||
                   std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_pay_amount) == 0 ||
                   std::strcmp(attr->name, "pay_amount") == 0 ||
                   std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        }
      }
    }
  } else if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_player_tollgate_paid) == 0 ||
             std::strcmp(eventId, "tollgate.paid") == 0) {
    eventType = "tollgate";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_pay_amount) == 0 ||
            std::strcmp(attr->name, "pay_amount") == 0 ||
            std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        }
      }
    }
  } else if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_player_use_ferry) == 0 ||
             std::strcmp(eventId, "use.ferry") == 0) {
    eventType = "ferry";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_pay_amount) == 0 ||
            std::strcmp(attr->name, "pay_amount") == 0 ||
            std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_source_name) == 0 ||
                   std::strcmp(attr->name, "source_name") == 0 ||
                   std::strcmp(attr->name, "source") == 0) {
          TryGetAttrString(attr, eventSource);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_target_name) == 0 ||
                   std::strcmp(attr->name, "target_name") == 0 ||
                   std::strcmp(attr->name, "target") == 0) {
          TryGetAttrString(attr, eventTarget);
        }
      }
    }
  } else if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_player_use_train) == 0 ||
             std::strcmp(eventId, "use.train") == 0) {
    eventType = "train";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_pay_amount) == 0 ||
            std::strcmp(attr->name, "pay_amount") == 0 ||
            std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_source_name) == 0 ||
                   std::strcmp(attr->name, "source_name") == 0 ||
                   std::strcmp(attr->name, "source") == 0) {
          TryGetAttrString(attr, eventSource);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_target_name) == 0 ||
                   std::strcmp(attr->name, "target_name") == 0 ||
                   std::strcmp(attr->name, "target") == 0) {
          TryGetAttrString(attr, eventTarget);
        }
      }
    }
  } else if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_job_delivered) == 0 ||
             std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_car_job_delivered) == 0 ||
             std::strcmp(eventId, "job.delivered") == 0) {
    eventType = "job_delivered";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_revenue) == 0 ||
            std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_pay_amount) == 0 ||
            std::strcmp(attr->name, "pay_amount") == 0 ||
            std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        } else if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_earned_xp) == 0 ||
                   std::strcmp(attr->name, "earned_xp") == 0 ||
                   std::strcmp(attr->name, "xp") == 0) {
          TryGetAttrS32(attr, eventXp);
        }
      }
    }
  } else if (std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_job_cancelled) == 0 ||
             std::strcmp(eventId, SCS_TELEMETRY_GAMEPLAY_EVENT_car_job_cancelled) == 0 ||
             std::strcmp(eventId, "job.cancelled") == 0) {
    eventType = "job_cancelled";
    handled = true;
    if (info->attributes) {
      for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
        if (std::strcmp(attr->name, SCS_TELEMETRY_GAMEPLAY_EVENT_ATTRIBUTE_cancel_penalty) == 0 ||
            std::strcmp(attr->name, "cancel_penalty") == 0 ||
            std::strcmp(attr->name, "penalty") == 0 ||
            std::strcmp(attr->name, "amount") == 0) {
          TryGetAttrS64(attr, eventAmount);
        }
      }
    }
  }

  if (handled) {
    ++g_lastEvent.seq;
    g_lastEvent.type = eventType;
    g_lastEvent.amount = eventAmount;
    g_lastEvent.offence = eventOffence;
    g_lastEvent.source = eventSource;
    g_lastEvent.target = eventTarget;
    g_lastEvent.xp = eventXp;
    WriteSharedMemorySnapshot(true, true);
  }
}

SCSAPI_VOID OnConfigurationEvent(const scs_event_t, const void* const event_info, const scs_context_t) {
  const auto* info = static_cast<const scs_telemetry_configuration_t*>(event_info);
  if (!info || !info->id || !info->attributes) return;

  DumpEventAttributes("CONFIG", info->id, info->attributes);

  if (std::strcmp(info->id, SCS_TELEMETRY_CONFIG_truck) == 0) {
    g_state.truckBrandId.clear();
    g_state.truckBrand.clear();
    g_state.truckId.clear();
    g_state.truckName.clear();
    g_state.licensePlate.clear();

    for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
      if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_brand_id) == 0) {
        TryGetAttrString(attr, g_state.truckBrandId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_brand) == 0) {
        TryGetAttrString(attr, g_state.truckBrand);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_id) == 0) {
        TryGetAttrString(attr, g_state.truckId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_name) == 0) {
        TryGetAttrString(attr, g_state.truckName);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_license_plate) == 0) {
        TryGetAttrString(attr, g_state.licensePlate);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_fuel_capacity) == 0) {
        TryGetAttrFloat(attr, g_state.fuelCapacity);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_adblue_capacity) == 0) {
        TryGetAttrFloat(attr, g_state.adblueCapacity);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_rpm_limit) == 0) {
        TryGetAttrFloat(attr, g_state.rpmLimit);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_forward_gear_count) == 0) {
        TryGetAttrU32(attr, g_state.forwardGears);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_reverse_gear_count) == 0) {
        TryGetAttrU32(attr, g_state.reverseGears);
      }
    }
    WriteSharedMemorySnapshot(true, true);
    return;
  }

  if (std::strcmp(info->id, "trailer.0") == 0 || std::strcmp(info->id, SCS_TELEMETRY_CONFIG_trailer) == 0) {
    ClearTrailerConfig();
    bool anyAttr = false;
    for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
      anyAttr = true;
      if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_id) == 0) {
        TryGetAttrString(attr, g_state.trailerId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_brand) == 0) {
        TryGetAttrString(attr, g_state.trailerBrand);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_name) == 0) {
        TryGetAttrString(attr, g_state.trailerName);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_chain_type) == 0) {
        TryGetAttrString(attr, g_state.trailerChainType);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_body_type) == 0) {
        TryGetAttrString(attr, g_state.trailerBodyType);
      }
    }
    g_state.hasTrailerConfig = anyAttr && !g_state.trailerId.empty();
    WriteSharedMemorySnapshot(true, true);
    return;
  }

  const bool isJobConfig = (std::strcmp(info->id, SCS_TELEMETRY_CONFIG_job) == 0);
  const bool isBusConfig = (std::strcmp(info->id, SCS_TELEMETRY_CONFIG_bus_job) == 0);
  const bool isCarConfig = (std::strcmp(info->id, SCS_TELEMETRY_CONFIG_car_job) == 0);

  if (isJobConfig || isBusConfig || isCarConfig) {
    ClearJobConfig();
    g_state.isBusJob = isBusConfig;

    for (const scs_named_value_t* attr = info->attributes; attr->name != nullptr; ++attr) {
      if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_cargo_id) == 0) {
        TryGetAttrString(attr, g_state.cargoId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_cargo) == 0) {
        TryGetAttrString(attr, g_state.cargo);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_source_city_id) == 0 ||
                 std::strcmp(attr->name, "source.city.id") == 0) {
        TryGetAttrString(attr, g_state.sourceCityId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_source_city) == 0 ||
                 std::strcmp(attr->name, "source.city") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s) && IsValidPlaceName(s)) {
          g_state.sourceCity = s;
        }
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_source_company_id) == 0 ||
                 std::strcmp(attr->name, "source.company.id") == 0) {
        TryGetAttrString(attr, g_state.sourceCompanyId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_source_company) == 0 ||
                 std::strcmp(attr->name, "source.company") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s) && IsValidPlaceName(s)) {
          g_state.sourceCompany = s;
        }
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_destination_city_id) == 0 ||
                 std::strcmp(attr->name, "destination.city.id") == 0) {
        TryGetAttrString(attr, g_state.destinationCityId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_destination_city) == 0 ||
                 std::strcmp(attr->name, "destination.city") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s) && IsValidPlaceName(s)) {
          g_state.destinationCity = s;
        }
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_destination_company_id) == 0 ||
                 std::strcmp(attr->name, "destination.company.id") == 0) {
        TryGetAttrString(attr, g_state.destinationCompanyId);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_destination_company) == 0 ||
                 std::strcmp(attr->name, "destination.company") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s) && IsValidPlaceName(s)) {
          g_state.destinationCompany = s;
        }
      } else if (std::strncmp(attr->name, "source_stop.", 12) == 0 || std::strcmp(attr->name, "source_stop") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s)) {
          const char* sub = (attr->name[11] == '.') ? (attr->name + 12) : "";
          if (std::strstr(sub, "id") != nullptr) {
            g_state.sourceStopId = s;
            if (g_state.sourceCityId.empty()) g_state.sourceCityId = s;
          } else {
            const bool isTypeAttr = (std::strstr(sub, "type") != nullptr || std::strstr(sub, "kind") != nullptr || std::strstr(sub, "category") != nullptr);
            if (!isTypeAttr && IsValidPlaceName(s)) {
              if (std::strstr(sub, "city") != nullptr || g_state.sourceStopCity.empty()) {
                g_state.sourceStopCity = s;
                if (g_state.sourceCity.empty()) g_state.sourceCity = s;
              } else {
                g_state.sourceStopName = s;
                if (g_state.sourceCompany.empty()) g_state.sourceCompany = s;
              }
            }
          }
        }
      } else if (std::strncmp(attr->name, "destination_stop.", 17) == 0 || std::strcmp(attr->name, "destination_stop") == 0) {
        std::string s;
        if (TryGetAttrString(attr, s)) {
          const char* sub = (attr->name[16] == '.') ? (attr->name + 17) : "";
          if (std::strstr(sub, "id") != nullptr) {
            g_state.destinationStopId = s;
            if (g_state.destinationCityId.empty()) g_state.destinationCityId = s;
          } else {
            const bool isTypeAttr = (std::strstr(sub, "type") != nullptr || std::strstr(sub, "kind") != nullptr || std::strstr(sub, "category") != nullptr);
            if (!isTypeAttr && IsValidPlaceName(s)) {
              if (std::strstr(sub, "city") != nullptr || g_state.destinationStopCity.empty()) {
                g_state.destinationStopCity = s;
                if (g_state.destinationCity.empty()) g_state.destinationCity = s;
              } else {
                g_state.destinationStopName = s;
                if (g_state.destinationCompany.empty()) g_state.destinationCompany = s;
              }
            }
          }
        }
      } else if (std::strncmp(attr->name, "stop", 4) == 0 || std::strncmp(attr->name, "route.", 6) == 0) {
        std::string s;
        if (TryGetAttrString(attr, s)) {
          const char* namePtr = attr->name;
          if (std::strstr(namePtr, "id") != nullptr) {
            if (attr->index == 0) {
              g_state.sourceStopId = s;
              if (g_state.sourceCityId.empty()) g_state.sourceCityId = s;
            } else if (attr->index != SCS_U32_NIL && attr->index > 0) {
              g_state.destinationStopId = s;
              if (g_state.destinationCityId.empty()) g_state.destinationCityId = s;
            }
          } else {
            const bool isTypeAttr = (std::strstr(namePtr, "type") != nullptr || std::strstr(namePtr, "kind") != nullptr || std::strstr(namePtr, "category") != nullptr);
            if (!isTypeAttr && IsValidPlaceName(s)) {
              if (attr->index == 0) {
                if (std::strstr(namePtr, "city") != nullptr || g_state.sourceStopCity.empty()) {
                  g_state.sourceStopCity = s;
                  if (g_state.sourceCity.empty()) g_state.sourceCity = s;
                } else {
                  g_state.sourceStopName = s;
                  if (g_state.sourceCompany.empty()) g_state.sourceCompany = s;
                }
              } else if (attr->index != SCS_U32_NIL && attr->index > 0) {
                if (std::strstr(namePtr, "city") != nullptr || g_state.destinationStopCity.empty()) {
                  g_state.destinationStopCity = s;
                  if (g_state.destinationCity.empty()) g_state.destinationCity = s;
                } else {
                  g_state.destinationStopName = s;
                  if (g_state.destinationCompany.empty()) g_state.destinationCompany = s;
                }
              }
            }
          }
        }
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_job_market) == 0 ||
                 std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_car_job_market) == 0 ||
                 std::strcmp(attr->name, "bus_job.market") == 0) {
        TryGetAttrString(attr, g_state.jobMarket);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_cargo_mass) == 0) {
        TryGetAttrFloat(attr, g_state.cargoMassKg);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_planned_distance_km) == 0) {
        TryGetAttrU32(attr, g_state.plannedDistanceKm);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_income) == 0) {
        TryGetAttrU64(attr, g_state.income);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_is_cargo_loaded) == 0) {
        g_state.cargoLoaded = (attr->value.type == SCS_VALUE_TYPE_bool && attr->value.value_bool.value != 0);
      } else if (std::strcmp(attr->name, SCS_TELEMETRY_CONFIG_ATTRIBUTE_special_job) == 0) {
        g_state.specialJob = (attr->value.type == SCS_VALUE_TYPE_bool && attr->value.value_bool.value != 0);
      }
    }

    // Финальная очистка и защита от мусорных / технических строк
    if (!IsValidPlaceName(g_state.sourceCity)) g_state.sourceCity.clear();
    if (!IsValidPlaceName(g_state.destinationCity)) g_state.destinationCity.clear();
    if (!IsValidPlaceName(g_state.sourceCompany)) g_state.sourceCompany.clear();
    if (!IsValidPlaceName(g_state.destinationCompany)) g_state.destinationCompany.clear();
    if (!IsValidPlaceName(g_state.sourceStopCity)) g_state.sourceStopCity.clear();
    if (!IsValidPlaceName(g_state.destinationStopCity)) g_state.destinationStopCity.clear();
    if (!IsValidPlaceName(g_state.sourceStopName)) g_state.sourceStopName.clear();
    if (!IsValidPlaceName(g_state.destinationStopName)) g_state.destinationStopName.clear();

    // Эталонная дифференциация типов рейсов (SCS SDK 1.16 / rtrucksim_telemetry):
    const bool isExplicitBusConfig = isBusConfig || (g_state.jobMarket == "bus_job") || (g_state.cargoId == "passengers");
    const bool hasRealCargo = (!g_state.cargo.empty() && _stricmp(g_state.cargo.c_str(), "passengers") != 0 && _stricmp(g_state.cargo.c_str(), "пассажиры") != 0) ||
                              (!g_state.cargoId.empty() && g_state.cargoId != "passengers") ||
                              (g_state.cargoMassKg > 0.0f && g_state.cargoId != "passengers");

    if (isExplicitBusConfig && !hasRealCargo) {
      g_state.isBusJob = true;
      if (g_state.jobMarket.empty()) {
        g_state.jobMarket = "bus_job";
      }
      if (g_state.cargo.empty()) {
        g_state.cargo = "Passengers";
      }
      if (g_state.cargoId.empty()) {
        g_state.cargoId = "passengers";
      }

      // Для автобусного рейса: если города отправления/назначения пусты, фоллбечим на остановки
      if (g_state.sourceCity.empty()) {
        if (!g_state.sourceStopCity.empty()) g_state.sourceCity = g_state.sourceStopCity;
        else if (!g_state.sourceStopName.empty()) g_state.sourceCity = g_state.sourceStopName;
        else if (!g_state.sourceCompany.empty()) g_state.sourceCity = g_state.sourceCompany;
      }
      if (g_state.destinationCity.empty()) {
        if (!g_state.destinationStopCity.empty()) g_state.destinationCity = g_state.destinationStopCity;
        else if (!g_state.destinationStopName.empty()) g_state.destinationCity = g_state.destinationStopName;
        else if (!g_state.destinationCompany.empty()) g_state.destinationCity = g_state.destinationCompany;
      }
      if (g_state.sourceCityId.empty()) {
        if (!g_state.sourceStopId.empty()) g_state.sourceCityId = g_state.sourceStopId;
        else if (!g_state.sourceCompanyId.empty()) g_state.sourceCityId = g_state.sourceCompanyId;
      }
      if (g_state.destinationCityId.empty()) {
        if (!g_state.destinationStopId.empty()) g_state.destinationCityId = g_state.destinationStopId;
        else if (!g_state.destinationCompanyId.empty()) g_state.destinationCityId = g_state.destinationCompanyId;
      }
    } else {
      // Обычный грузовой рейс (или порожний): гарантированно сбрасываем поля автобусных остановок
      g_state.isBusJob = false;
      g_state.sourceStopCity.clear();
      g_state.sourceStopName.clear();
      g_state.sourceStopId.clear();
      g_state.destinationStopCity.clear();
      g_state.destinationStopName.clear();
      g_state.destinationStopId.clear();
    }

    const bool hasAnyJob = !g_state.cargoId.empty() || !g_state.cargo.empty() ||
                           !g_state.destinationCity.empty() || !g_state.sourceCity.empty() ||
                           !g_state.destinationStopCity.empty() || !g_state.sourceStopCity.empty() ||
                           !g_state.destinationCompany.empty() || !g_state.sourceCompany.empty() ||
                           g_state.plannedDistanceKm > 0 || g_state.income > 0 ||
                           (g_state.isBusJob && (!g_state.sourceCity.empty() || !g_state.destinationCity.empty() || !g_state.sourceCompany.empty() || !g_state.destinationCompany.empty()));
    if (hasAnyJob) {
      g_state.hasJob = true;
    } else {
      ClearJobConfig();
    }
    WriteSharedMemorySnapshot(true, true);
  }
}

void RegisterFloat(const scs_telemetry_init_params_v101_t* p, const char* name, float* target) {
  p->register_for_channel(name, SCS_U32_NIL, SCS_VALUE_TYPE_float, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelFloat, target);
}

void RegisterS32(const scs_telemetry_init_params_v101_t* p, const char* name, int32_t* target) {
  p->register_for_channel(name, SCS_U32_NIL, SCS_VALUE_TYPE_s32, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelS32, target);
}

void RegisterU32(const scs_telemetry_init_params_v101_t* p, const char* name, uint32_t* target) {
  p->register_for_channel(name, SCS_U32_NIL, SCS_VALUE_TYPE_u32, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelU32, target);
}

void RegisterBoolU8(const scs_telemetry_init_params_v101_t* p, const char* name, uint8_t* target) {
  p->register_for_channel(name, SCS_U32_NIL, SCS_VALUE_TYPE_bool, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelBoolU8, target);
}

} // namespace

SCSAPI_RESULT scs_telemetry_init(const scs_u32_t version, const scs_telemetry_init_params_t* const params) {
  if (version != SCS_TELEMETRY_VERSION_1_01 && version != SCS_TELEMETRY_VERSION_1_00) {
    return SCS_RESULT_unsupported;
  }

  const auto* initParams = static_cast<const scs_telemetry_init_params_v101_t*>(params);
  if (!initParams || !initParams->register_for_event || !initParams->register_for_channel) {
    return SCS_RESULT_invalid_parameter;
  }

  g_gameLog = initParams->common.log;
  g_state = RuntimeState{};
  g_lastEvent = GameEventState{};
  g_lastFlushMs = 0;

  if (initParams->common.game_id) {
    if (std::strcmp(initParams->common.game_id, SCS_GAME_ID_EUT2) == 0) {
      g_state.gameId = 1u;
    } else if (std::strcmp(initParams->common.game_id, SCS_GAME_ID_ATS) == 0) {
      g_state.gameId = 2u;
    }
  }

  if (!InitSharedMemory()) {
    if (g_gameLog) {
      g_gameLog(SCS_LOG_TYPE_error, "[overlayobs_foozzee_telemetry] Failed to create Shared Memory (Local\\FooZzeeSCSTelemetry).");
    }
    return SCS_RESULT_generic_error;
  }

  // Events
  initParams->register_for_event(SCS_TELEMETRY_EVENT_frame_end,     OnFrameEnd,           nullptr);
  initParams->register_for_event(SCS_TELEMETRY_EVENT_paused,        OnPauseOrStartEvent,  nullptr);
  initParams->register_for_event(SCS_TELEMETRY_EVENT_started,       OnPauseOrStartEvent,  nullptr);
  initParams->register_for_event(SCS_TELEMETRY_EVENT_configuration, OnConfigurationEvent, nullptr);
  initParams->register_for_event(SCS_TELEMETRY_EVENT_gameplay,      OnGameplayEvent,      nullptr);

  // Movement & controls
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_speed,                  &g_state.speedMs);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_engine_rpm,             &g_state.engineRpm);
  RegisterS32  (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_engine_gear,            &g_state.engineGear);
  RegisterS32  (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_displayed_gear,         &g_state.displayedGear);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_cruise_control,         &g_state.cruiseControlMs);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_navigation_speed_limit, &g_state.speedLimitMs);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_input_throttle,         &g_state.inputThrottle);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_input_brake,            &g_state.inputBrake);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_input_clutch,           &g_state.inputClutch);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_input_steering,         &g_state.inputSteering);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_effective_throttle,     &g_state.effectiveThrottle);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_effective_brake,        &g_state.effectiveBrake);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_effective_clutch,       &g_state.effectiveClutch);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_effective_steering,     &g_state.effectiveSteering);

  // Dashboard lamps & statuses
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_lblinker,    &g_state.blinkL);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_rblinker,    &g_state.blinkR);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_hazard_warning,    &g_state.hazard);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_parking,     &g_state.parkLight);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_low_beam,    &g_state.lowBeam);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_high_beam,   &g_state.highBeam);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_light_beacon,      &g_state.beacon);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wipers,            &g_state.wipers);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_parking_brake,     &g_state.parkBrake);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_motor_brake,       &g_state.motorBrake);
  RegisterU32   (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_retarder_level,    &g_state.retarder);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_differential_lock, &g_state.diffLock);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_lift_axle,         &g_state.liftAxle);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_trailer_lift_axle, &g_state.trailerLiftAxle);

  // Warnings & sensors
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_fuel_warning,                &g_state.fuelWarn);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_brake_air_pressure_warning,  &g_state.airWarn);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_oil_pressure_warning,        &g_state.oilWarn);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_water_temperature_warning,   &g_state.waterWarn);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_battery_voltage_warning,     &g_state.batteryWarn);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_odometer,                    &g_state.odometerKm);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_fuel,                        &g_state.fuelAmount);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_fuel_average_consumption,    &g_state.fuelAvgLKm);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_fuel_range,                  &g_state.fuelRangeKm);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_adblue,                      &g_state.adblueAmount);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_oil_temperature,             &g_state.oilTemperature);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_water_temperature,           &g_state.waterTemperature);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_brake_air_pressure,          &g_state.airPressurePsi);
  RegisterFloat (initParams, SCS_TELEMETRY_TRUCK_CHANNEL_battery_voltage,             &g_state.batteryVoltage);

  // Navigation & time
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_navigation_distance, &g_state.navDistanceM);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_navigation_time,     &g_state.navTimeSec);
  RegisterFloat(initParams, SCS_TELEMETRY_CHANNEL_local_scale,               &g_state.localScale);
  RegisterU32  (initParams, SCS_TELEMETRY_CHANNEL_game_time,                 &g_state.gameTimeMin);

  // Truck wear
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wear_engine,       &g_state.wearEngine);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wear_transmission, &g_state.wearTransmission);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wear_cabin,        &g_state.wearCabin);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wear_chassis,      &g_state.wearChassis);
  RegisterFloat(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_wear_wheels,       &g_state.wearWheels);

  // Trailer & job cargo
  initParams->register_for_channel("trailer.0.connected", SCS_U32_NIL, SCS_VALUE_TYPE_bool, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelBoolFlag, &g_state.chTrailer0Connected);
  initParams->register_for_channel(SCS_TELEMETRY_TRAILER_CHANNEL_connected, SCS_U32_NIL, SCS_VALUE_TYPE_bool, SCS_TELEMETRY_CHANNEL_FLAG_no_value, OnChannelBoolFlag, &g_state.chTrailerLegacyConnected);
  RegisterFloat(initParams, "trailer.0.wear.chassis",               &g_state.wearTrailerChassis);
  RegisterFloat(initParams, "trailer.0.wear.body",                  &g_state.wearTrailerBody);
  RegisterFloat(initParams, "trailer.0.wear.wheels",                &g_state.wearTrailerWheels);
  RegisterFloat(initParams, "trailer.0.cargo.damage",               &g_state.trailerCargoDamage);
  RegisterFloat(initParams, SCS_TELEMETRY_JOB_CHANNEL_cargo_damage, &g_state.jobCargoDamage);

  // Additional channels from rtrucksim_telemetry (including DLC Coaches)
  RegisterFloat (initParams, "bus_job.average_satisfaction", &g_state.busSat);
  RegisterS32   (initParams, "rest.stop",                    &g_state.restStop);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_electric_enabled, &g_state.electric);
  RegisterBoolU8(initParams, SCS_TELEMETRY_TRUCK_CHANNEL_engine_enabled,   &g_state.engine);

  WriteSharedMemorySnapshot(true, true);

  if (g_gameLog) {
    g_gameLog(SCS_LOG_TYPE_message, "[overlayobs_foozzee_telemetry] Initialized JSON Shared Memory (Local\\FooZzeeSCSTelemetry).");
  }
  return SCS_RESULT_ok;
}

SCSAPI_VOID scs_telemetry_shutdown(void) {
  CleanupSharedMemory();
  if (g_gameLog) {
    g_gameLog(SCS_LOG_TYPE_message, "[overlayobs_foozzee_telemetry] Shutdown completed.");
  }
}
