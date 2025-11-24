#!/bin/bash

echo "🚀 Building iOS App..."
echo "📋 Bundle ID: com.ionictest.todoapp"
echo ""

# Limpiar builds anteriores
echo "🧹 Cleaning previous builds..."
cordova clean ios

# Construir la aplicación
echo "🔨 Building iOS application..."
cordova build ios --release --device

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo "📱 Para instalar en dispositivo conectado:"
    echo "   cordova run ios --device --device --buildFlag="-allowProvisioningUpdates" --buildFlag="DEVELOPMENT_TEAM=9PQC62CU26"
    echo ""
    echo "📦 El archivo .xcarchive se encuentra en:"
    echo "   platforms/ios/build/device/App.xcarchive"
    echo ""
    echo "🎯 Para generar IPA desde Xcode:"
    echo "   1. Abre: platforms/ios/App.xcworkspace"
    echo "   2. Product → Archive"
    echo "   3. Window → Organizer → Distribute App"
else
    echo ""
    echo "❌ Build failed!"
    echo "💡 Asegúrate de:"
    echo "   1. Tener configurado Development Team en Xcode"
    echo "   2. Dispositivo conectado y confiable"
    echo "   3. Certificados de desarrollo válidos"
fi