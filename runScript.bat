@echo off
setlocal
set name=jetPet
set dashBoardDataLocation=.\dashboarddata\%name%
set dashBoard=.\dash-board\%name%
set csvLog=%dashBoardDataLocation%\log.csv
set runLog=%dashBoardDataLocation%\runlog.txt
set jmxFile=".\jetpetScript.jmx"
set propFile="".\jetpets.properties""
set "distributed=-Gremote_hosts=127.0.0.1,192.168.100.135"

if not exist "%dashBoardDataLocation%" (
    mkdir "%dashBoardDataLocation%"
)

if not exist "%dashBoard%" (
    mkdir "%dashBoard%"
)
Echo starting jetpet load test
rem Echo changing directory to jmeter bin
rem call cd "jmeter bin location "
Echo "%jmxFile%"
Echo "%csvLog%"
Echo "%runLog%"
Echo "%dashBoard%"
Echo running the test
call jmeter -n  -t "%jmxFile%" -l "%csvLog%" -j "%runLog%" -e -o "%dashBoard%" -q %propFile%
ECHO test completed