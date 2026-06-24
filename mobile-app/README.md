# Mobile App - Ionic Todo Test

Esta es la aplicación móvil Cordova que empaqueta la aplicación Angular del monorepo NX.

## Estructura del Proyecto

```
ionic-todo-test/                 # Monorepo NX raíz
├── src/                        # Aplicación Angular principal
├── dist/ionic-todo-test/       # Archivos compilados de Angular
└── mobile-app/                 # 📱 Aplicación Cordova (este directorio)
    ├── www/                    # Archivos web copiados desde dist/
    ├── platforms/              # Código nativo generado
    └── config.xml              # Configuración Cordova
```

## Scripts Disponibles

### `npm run build`
Ejecuta el proceso completo de build:
1. `build:web` - Compila la aplicación Angular desde la raíz
2. `copy-www` - Copia archivos desde `../dist/ionic-todo-test/` a `www/`  
3. `fix-cordova` - Ajusta `index.html` para Cordova (base href, cordova.js, CSP)

### `npm run build:android`
Ejecuta `npm run build` y después `cordova build android` para generar APK.

## Proceso de Desarrollo

### Para desarrollo web normal:
```bash
# Desde la raíz del monorepo
cd ionic-todo-test
npm start
```

### Para development móvil:
```bash
# Desde mobile-app/
cd mobile-app
npm run build:android    # Genera APK
```

### Flujo automatizado:
1. **Build**: `cd .. && npm run build` (desde raíz del monorepo)
2. **Copy**: Copia archivos de `dist/ionic-todo-test/*` a `www/`
3. **Fix**: Ajusta HTML para Cordova (base href="./" y cordova.js)
4. **Cordova**: `cordova build android` para generar APK (cordova build android -- --gradleVersion=9.2.1)

## Configuración Actual

- ✅ **WebView nativo** de Cordova (sin ionic-webview plugin)
- ✅ **Bundle ID**: `com.ionictest.todoapp`
- ✅ **Firebase** configurado con Remote Config
- ✅ **Protocolo file://** para máxima compatibilidad

## APK Output

El APK se genera en:
```
platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

## Notas Importantes

- **No editar** archivos en `www/` directamente - son generados automáticamente
- **Usar** `npm run build` antes de `cordova build` para actualizar contenido
- **La aplicación web** está en la raíz del monorepo, no en mobile-app/