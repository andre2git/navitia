IF(WIN32)
  FIND_PATH(FreeTDS_INCLUDE_DIR sqlfront.h PATHS D:/freeTDS/include c:/freeTDS/include)
  IF(CMAKE_CFG_INTDIR MATCHES "Debug")
    SET(FreeTDS_LIBRARY_DIR ${FreeTDS_INCLUDE_DIR}/../lib-debug)
  else(CMAKE_CFG_INTDIR MATCHES "Debug")
    SET(FreeTDS_LIBRARY_DIR ${FreeTDS_INCLUDE_DIR}/../lib)
  ENDIF(CMAKE_CFG_INTDIR MATCHES "Debug")
ELSE(WIN32)
  FIND_PATH(FreeTDS_INCLUDE_DIR sqlfront.h)
ENDIF(WIN32)

IF(WIN32)
  FIND_LIBRARY(FreeTDS_DBLIB NAMES dblib PATHS ${FreeTDS_LIBRARY_DIR})
  FIND_LIBRARY(FreeTDS_TDSLIB NAMES libTDS PATHS ${FreeTDS_LIBRARY_DIR})
    MESSAGE(STATUS "Found FreeTDS bleau: ${FreeTDS_DBLIB} ${FreeTDS_TDSLIB}")
  IF(FreeTDS_DBLIB AND FreeTDS_TDSLIB AND FreeTDS_INCLUDE_DIR)
    SET(FreeTDS_LIBS ${FreeTDS_DBLIB} ${FreeTDS_TDSLIB} Ws2_32)
    SET(FreeTDS_FOUND TRUE)
  ENDIF(FreeTDS_DBLIB AND FreeTDS_TDSLIB AND FreeTDS_INCLUDE_DIR)
ELSE(WIN32)
  FIND_LIBRARY(FreeTDS_SYBDB NAMES sybdb)
  IF(FreeTDS_SYBDB AND FreeTDS_INCLUDE_DIR)
    SET(FreeTDS_LIBS ${FreeTDS_SYBDB})
    SET(FreeTDS_FOUND TRUE)
  ENDIF(FreeTDS_SYBDB AND FreeTDS_INCLUDE_DIR)  
ENDIF(WIN32)

IF (FreeTDS_FOUND)
   IF (NOT FreeTDS_FIND_QUIETLY)
      MESSAGE(STATUS "Found FreeTDS: ${FreeTDS_LIBS}")
   ENDIF (NOT FreeTDS_FIND_QUIETLY)
ELSE (FreeTDS_FOUND)
   IF (FreeTDS_FIND_REQUIRED)
      MESSAGE(FATAL_ERROR "Could not find FreeTDS")
   ENDIF (FreeTDS_FIND_REQUIRED)
ENDIF (FreeTDS_FOUND)

