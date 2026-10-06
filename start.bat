@echo off
title ista & Vastgoedbeheer Dispute Shield
color 0B
echo ================================================================
echo          ista ^& Vastgoedbeheer Dispute Shield
echo ================================================================
echo.
echo Applicatie wordt gestart op http://localhost:3001 ...
echo.
cd /d "%~dp0"
set "PATH=C:\Program Files\nodejs;%PATH%"

:: Open direct de standaardbrowser
start http://localhost:3001

:: Start de gecombineerde web- en AI server
node server/index.js

pause
