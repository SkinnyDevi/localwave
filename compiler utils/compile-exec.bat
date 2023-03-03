@echo off

SET mypath=%~dp0
SET mypath=%mypath:~0,-1%

FOR /F "tokens=* USEBACKQ" %%F IN (`npm list -g json`) DO (
	SET npmjson=%%F
)

echo.%npmjson% | findstr /I "json">Nul && (
	@REM FOUND
) || (
	echo [DEPENDENCY/INSTALLER] Installing json package globally...
  call npm i -g json
)

echo [COMPILER] Starting server compiling process...
cd %mypath%\..\server


echo [COMPILER/SERVER] Changing TSConfig and package.json to CommonJS for compiler...
call json -I -f tsconfig.json -e "this.compilerOptions.module=\"CommonJS\""
call json -I -f package.json -e "this.type=\"commonjs\""

echo [COMPILER/SERVER] Building to JS using NPM BUILD...
call npm run build

echo [COMPILER/SERVER] Finished building server, changing to client...
cd %mypath%\..\client

echo [COMPILER/CLIENT] Starting to compile client...
call npm run build:win

echo [COMPILER/CLIENT] Client finished building, starting executable compilation...
cd %mypath%\..\server

echo [COMPILER/EXEC] Starting executable compilation...
call npm run compile

echo [COMPILER/EXEC] Finished compiling, reverting config files...
call json -I -f tsconfig.json -e "this.compilerOptions.module=\"NodeNext\""
call json -I -f package.json -e "this.type=\"module\""

echo [COMPILER] Finished executable compilation.