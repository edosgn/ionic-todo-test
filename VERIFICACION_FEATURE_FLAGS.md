# Verificación de Feature Flags - Firebase Remote Config

## Estado Actual

✅ **Aplicación corriendo en:** http://localhost:4200  
✅ **Configuración actualizada para:** `appTitle`, `enableDeleteTask`, `maxTasks`, `showStatistics`  
✅ **Intervalo de fetch en desarrollo:** 0ms (obtiene valores inmediatamente)

## Feature Flags Configurados en Firebase

Los siguientes parámetros deben estar configurados en Firebase Remote Config:

| Parámetro | Tipo | Valor Esperado | Descripción |
|-----------|------|----------------|-------------|
| `appTitle` | String | (tu título personalizado) | Título de la aplicación en el header |
| `enableDeleteTask` | Boolean | `true` o `false` | Habilita/deshabilita el botón de eliminar tareas |
| `maxTasks` | Number | 5 | Límite máximo de tareas que se pueden crear |
| `showStatistics` | Boolean | `true` o `false` | Muestra/oculta la sección de estadísticas |

## Cómo Verificar los Feature Flags

### 1. En la Consola del Navegador

Abre la aplicación en http://localhost:4200 y abre las DevTools (F12). Deberías ver logs como:

```
🔥 Initializing Firebase Remote Config...
✅ Firebase Remote Config initialized successfully
🏁 Initializing Feature Flags Store...
🏁 Feature flag 'enableDeleteTask': false
🏁 Feature flag 'showStatistics': false
Feature flag 'maxTasks': 5
Feature flag 'appTitle': "Tu Título Personalizado"
✅ Feature Flags initialized successfully
```

### 2. Verificar Visualmente

#### A. Título de la Aplicación (`appTitle`)
- **Ubicación:** Header principal de la aplicación
- **Comportamiento esperado:** Debe mostrar el valor configurado en Firebase
- **Valor por defecto:** "Mis Tareas"

#### B. Botón de Eliminar Tareas (`enableDeleteTask`)
- **Ubicación:** Botones de acción en cada tarea
- **Comportamiento esperado:** 
  - `true`: Se muestran los botones de eliminar
  - `false`: Los botones de eliminar están ocultos

#### C. Límite de Tareas (`maxTasks`)
- **Ubicación:** Formulario de creación de tareas
- **Comportamiento esperado:** 
  - Al intentar crear más tareas que el límite, debe mostrar un error
  - Ejemplo con `maxTasks: 5`: No permite crear la tarea #6

#### D. Sección de Estadísticas (`showStatistics`)
- **Ubicación:** Página de categorías / resumen
- **Comportamiento esperado:** 
  - `true`: Se muestra la sección de estadísticas y resumen
  - `false`: La sección de estadísticas está oculta

### 3. Testing de Feature Flags

#### Test 1: Cambiar el Título
1. En Firebase Console → Remote Config
2. Editar parámetro `appTitle`
3. Cambiar valor a "Mi App Personalizada"
4. Publicar cambios
5. Recargar la aplicación (Ctrl/Cmd + R)
6. Verificar que el título en el header cambió

#### Test 2: Deshabilitar Eliminación de Tareas
1. Crear 2-3 tareas en la aplicación
2. En Firebase Console, cambiar `enableDeleteTask` a `false`
3. Publicar y recargar la app
4. Verificar que los botones de eliminar desaparecieron

#### Test 3: Límite de Tareas
1. En Firebase Console, establecer `maxTasks: 5`
2. Publicar y recargar la app
3. Crear 5 tareas
4. Intentar crear la tarea #6
5. Debe mostrar error: "No se pueden crear más tareas. Límite máximo: 5"

#### Test 4: Ocultar Estadísticas
1. En Firebase Console, cambiar `showStatistics` a `false`
2. Publicar y recargar la app
3. Navegar a la página de categorías
4. Verificar que la sección de estadísticas no se muestra

## Solución de Problemas

### Los valores no se actualizan

**Problema:** Los feature flags no reflejan los valores de Firebase.

**Soluciones:**

1. **Verificar inicialización:**
   - Abre DevTools → Console
   - Busca el log: `✅ Feature Flags initialized successfully`
   - Si no aparece, hay un error en la inicialización

2. **Limpiar caché de Firebase:**
   ```javascript
   // En la consola del navegador:
   localStorage.clear();
   location.reload();
   ```

3. **Verificar nombres de parámetros:**
   - Los nombres en Firebase deben ser EXACTAMENTE:
     - `appTitle` (no `appTittle`)
     - `enableDeleteTask`
     - `maxTasks`
     - `showStatistics`

4. **Verificar que los parámetros estén publicados:**
   - En Firebase Console, asegúrate de hacer clic en "Publish changes"
   - Los cambios en borrador no se reflejan en la aplicación

### Error: "No se pueden obtener los feature flags"

**Problema:** Error al inicializar Remote Config.

**Soluciones:**

1. **Verificar conexión a internet**

2. **Verificar configuración de Firebase:**
   ```typescript
   // src/environments/environment.ts
   firebase: {
     apiKey: "...",
     projectId: "ionic-test-1a876",
     // ... otros campos
   }
   ```

3. **Verificar que Firebase esté inicializado:**
   ```typescript
   // src/app/app.config.ts
   provideFirebaseApp(() => initializeApp(environment.firebase))
   provideRemoteConfig(() => getRemoteConfig())
   ```

### Los valores se actualizan pero no se reflejan en la UI

**Problema:** Los valores están correctos en los logs pero la UI no cambia.

**Solución:**

Verificar que los componentes estén usando los signals correctamente:

```typescript
// ✅ Correcto
<ion-title>{{ featureFlagStore.appTitle() }}</ion-title>

// ❌ Incorrecto
<ion-title>{{ featureFlagStore.appTitle }}</ion-title>
```

## Comandos Útiles

### Ver logs en tiempo real
```bash
# En una terminal separada
npx nx serve --verbose
```

### Limpiar y reiniciar
```bash
# Limpiar caché de NX
npx nx reset

# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install

# Reiniciar servidor
npx nx serve
```

### Verificar estado de Firebase
```javascript
// En la consola del navegador
import { getRemoteConfig } from '@angular/fire/remote-config';

// Ver configuración actual
console.log(remoteConfig.settings);
console.log(remoteConfig.defaultConfig);
```

## Checklist de Verificación

- [ ] La aplicación corre en http://localhost:4200
- [ ] Se ven logs de inicialización de Firebase en la consola
- [ ] El título de la app muestra el valor de `appTitle`
- [ ] Con `enableDeleteTask: false`, no se ven botones de eliminar
- [ ] Con `maxTasks: 5`, no permite crear más de 5 tareas
- [ ] Con `showStatistics: false`, no se muestra la sección de estadísticas
- [ ] Al cambiar valores en Firebase y recargar, los cambios se reflejan

## Valores Recomendados para Testing

Para probar todas las funcionalidades, configura estos valores en Firebase:

```json
{
  "appTitle": "Test Pragma",
  "enableDeleteTask": false,
  "maxTasks": 5,
  "showStatistics": false
}
```

Con esta configuración deberías ver:
- Título: "Test Pragma"
- Sin botones de eliminar
- Límite de 5 tareas
- Sin sección de estadísticas

---

**Última actualización:** 23 de noviembre de 2025  
**Branch:** feature/task13-fixes  
**Estado:** ✅ Configuración actualizada y lista para testing
