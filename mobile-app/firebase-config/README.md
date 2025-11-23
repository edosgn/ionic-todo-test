# Firebase Configuration Files

Esta carpeta debe contener los archivos de configuración de Firebase para cada plataforma:

## Android
- **Archivo requerido**: `google-services.json`
- **Ubicación en build**: Se copia automáticamente a `platforms/android/app/`
- **Descarga desde**: Firebase Console → Project Settings → Your apps → Android app

## iOS
- **Archivo requerido**: `GoogleService-Info.plist`  
- **Ubicación en build**: Se copia automáticamente a `platforms/ios/`
- **Descarga desde**: Firebase Console → Project Settings → Your apps → iOS app

## Instrucciones

### Para Android:
1. Ve a Firebase Console: https://console.firebase.google.com/project/ionic-test-1a876
2. Project Settings → Your apps
3. Si no existe, añade nueva app Android con package name: `com.ionictest.todoapp`
4. Descarga `google-services.json`
5. Coloca el archivo en esta carpeta (`firebase-config/`)

### Para iOS:
1. Ve a Firebase Console: https://console.firebase.google.com/project/ionic-test-1a876
2. Project Settings → Your apps  
3. Si no existe, añade nueva app iOS con bundle ID: `com.ionictest.todoapp`
4. Descarga `GoogleService-Info.plist`
5. Coloca el archivo en esta carpeta (`firebase-config/`)

Los archivos se copiarán automáticamente durante el proceso de build de Cordova.