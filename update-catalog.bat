@echo off
setlocal

set "REPO_DIR=%~dp0"
set "AUTOMOD_DIR=%REPO_DIR%automod"
set "LAST_FOLDER_FILE=%AUTOMOD_DIR%\data\last-folder.txt"
set "MODS_FOLDER="

if not exist "%LAST_FOLDER_FILE%" (
  echo Error: "%LAST_FOLDER_FILE%" was not found.
  echo Run AutoMod manually once to save the mods folder.
  exit /b 1
)

set /p "MODS_FOLDER="<"%LAST_FOLDER_FILE%"
if not defined MODS_FOLDER (
  echo Error: last-folder.txt is empty.
  exit /b 1
)

if not exist "%MODS_FOLDER%\." (
  echo Error: The mods folder "%MODS_FOLDER%" does not exist.
  exit /b 1
)

if not exist "%AUTOMOD_DIR%\node_modules" (
  echo Error: AutoMod dependencies are missing.
  echo Run "npm.cmd install" from the automod folder.
  exit /b 1
)

git -C "%REPO_DIR%" rev-parse --show-toplevel >nul 2>nul
if errorlevel 1 (
  echo Error: Could not find the Git repository.
  exit /b 1
)

set "CURRENT_BRANCH="
for /f "delims=" %%B in ('git -C "%REPO_DIR%" branch --show-current 2^>nul') do set "CURRENT_BRANCH=%%B"
if not "%CURRENT_BRANCH%"=="main" (
  echo Error: Switch to the main branch before running this file.
  exit /b 1
)

echo Analyzing mods in "%MODS_FOLDER%"...
pushd "%AUTOMOD_DIR%"
if errorlevel 1 (
  echo Error: Could not access the automod folder.
  exit /b 1
)

call npm.cmd start -- "%MODS_FOLDER%"
if errorlevel 1 goto analyzer_error
popd

git -C "%REPO_DIR%" add -- automod/output/mods.json
if errorlevel 1 goto git_error

git -C "%REPO_DIR%" diff --quiet HEAD -- automod/output/mods.json
if errorlevel 2 goto git_error
if errorlevel 1 goto commit_changes

echo mods.json has not changed. Nothing to push.
exit /b 0

:commit_changes
git -C "%REPO_DIR%" commit --only -m "Update mod catalog" -- automod/output/mods.json
if errorlevel 1 goto commit_error

git -C "%REPO_DIR%" push origin main
if errorlevel 1 goto push_error

echo Catalog updated and pushed to GitHub.
exit /b 0

:analyzer_error
popd
echo Error: AutoMod could not generate mods.json.
exit /b 1

:git_error
echo Error: A Git operation failed.
exit /b 1

:commit_error
echo Error: Could not create a commit for mods.json.
exit /b 1

:push_error
echo Error: Could not push to origin/main. Check your connection and GitHub credentials.
exit /b 1
