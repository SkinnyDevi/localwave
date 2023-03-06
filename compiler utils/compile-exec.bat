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

echo [COMPILER] Deleting old executables...
call node icon-utility.js -d

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
mkdir build
call npm run compile

echo [COMPILER/EXEC] Finished compiling, reverting config files...
call json -I -f tsconfig.json -e "this.compilerOptions.module=\"NodeNext\""
call json -I -f package.json -e "this.type=\"module\""

echo [COMPILER] Organising distributions...
cd %mypath%\..\server\build

mkdir localwave-win-dist\notifier
move localwave-win.exe localwave-win-dist\localwave-win.exe
copy ..\node_modules\node-notifier\vendor\notifu\ localwave-win-dist\notifier\
copy ..\node_modules\node-notifier\vendor\snoreToast\ localwave-win-dist\notifier\
copy "..\..\compiler utils\start-win.vbs" localwave-win-dist

mkdir localwave-macos-dist\notifier\mac.noindex
move localwave-macos localwave-macos-dist\localwave-macos
robocopy ..\node_modules\node-notifier\vendor\mac.noindex\terminal-notifier.app\Contents\MacOS localwave-macos-dist\notifier\mac.noindex /s
robocopy ..\node_modules\node-notifier\vendor\mac.noindex\terminal-notifier.app\Contents localwave-macos-dist\notifier\mac.noindex Info.plist
robocopy ..\node_modules\node-notifier\vendor\mac.noindex\terminal-notifier.app\Contents\Resources\en.lproj localwave-macos-dist\notifier\mac.noindex MainMenu.nib
robocopy "..\..\compiler utils" localwave-macos-dist before-first-use.sh

cd %mypath%
call node icon-utility.js -w

echo [COMPILER] Finished executable compilation.