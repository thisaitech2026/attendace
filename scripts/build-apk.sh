#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

export ANDROID_HOME="${ANDROID_HOME:-$ROOT_DIR/android-sdk}"
export JAVA_HOME="${JAVA_HOME:-/usr/lib/jvm/java-21-openjdk-amd64}"
export PATH="$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH"

if [ ! -d "$ANDROID_HOME/platform-tools" ]; then
  echo "Android SDK not found at $ANDROID_HOME"
  echo "Install command-line tools, then run:"
  echo "  sdkmanager \"platform-tools\" \"platforms;android-36\" \"build-tools;36.0.0\" \"ndk;27.1.12297006\""
  exit 1
fi

npx expo prebuild --platform android --no-install

cd android
./gradlew assembleRelease --no-daemon \
  -x lintVitalAnalyzeRelease \
  -x lint \
  -PreactNativeArchitectures=arm64-v8a

APK_SRC="app/build/outputs/apk/release/app-release.apk"
APK_DEST="../releases/thisAI-v1.0.0.apk"
mkdir -p ../releases
cp "$APK_SRC" "$APK_DEST"

echo ""
echo "APK built successfully:"
echo "  $ROOT_DIR/$APK_DEST"
ls -lh "$APK_DEST"
