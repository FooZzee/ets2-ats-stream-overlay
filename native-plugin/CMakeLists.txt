cmake_minimum_required(VERSION 3.15)
project(overlayobs_foozzee_telemetry LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS OFF)

# Link static C/C++ runtime (/MT) so the plugin DLL needs no external VC++ Redistributable
if(POLICY CMP0091)
  cmake_policy(SET CMP0091 NEW)
  set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
endif()

add_library(overlayobs_foozzee_telemetry SHARED
  plugin.cpp
  plugin.def
)

target_include_directories(overlayobs_foozzee_telemetry PRIVATE
  "${CMAKE_CURRENT_SOURCE_DIR}/scs_sdk/include"
)

target_compile_definitions(overlayobs_foozzee_telemetry PRIVATE
  WIN32_LEAN_AND_MEAN
  NOMINMAX
  _CRT_SECURE_NO_WARNINGS
)

if(MSVC)
  target_compile_options(overlayobs_foozzee_telemetry PRIVATE /W3 /utf-8)
endif()

set_target_properties(overlayobs_foozzee_telemetry PROPERTIES
  OUTPUT_NAME "overlayobs_foozzee_telemetry"
  PREFIX ""
)
