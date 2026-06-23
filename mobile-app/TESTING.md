# Estrategia de Pruebas - Ionic Todo App

## Piramide de Pruebas Implementada

```
        /\
       /  \
      / E2E \        <- Appium (UI automatizada en dispositivo real)
     /--------\
    /  BDD     \     <- Cucumber + Playwright (Gherkin, lenguaje natural)
   /------------\
  /  Integracion  \  <- Jest (BDD-style, interaccion entre stores)
 /----------------\
/   Unitarias       \ <- Jest (las ya existentes en stores/*.spec.ts)
--------------------
```

## 1. Pruebas de Integracion (Jest - BDD-style)

Estas pruebas validan la interaccion entre componentes del sistema (stores, use cases, entidades de dominio) sin necesidad de un navegador o dispositivo. Estan escritas con estilo BDD usando `describe`/`it` con narrativa `Given`/`When`/`Then`.

### Ubicacion

```
mobile-app/e2e/integration/
  category-store.integration.spec.ts    # Pruebas de CategoryStore
  task-store.integration.spec.ts        # Pruebas de TaskStore
  task-category.integration.spec.ts     # Pruebas de integracion cruzada
```

### Que prueban

| Archivo | Escenarios cubiertos |
|---|---|
| `category-store.integration.spec.ts` | CRUD de categorias, orden alfabetico, busqueda por ID, validacion de nombre duplicado, manejo de errores, computed signals |
| `task-store.integration.spec.ts` | CRUD de tareas, completar tareas, filtro por busqueda, filtro por categoria, estadisticas, tareas sin categorizar, manejo de errores |
| `task-category.integration.spec.ts` | Conteo de tareas por categoria, validacion de eliminacion segura, filtrado por categoria, tareas sin categoria, estadisticas combinadas |

### Como ejecutarlas

```bash
# Todas las pruebas de integracion
npx nx test mobile-app --testPathPattern='e2e/integration'

# O usando el Makefile
make test-integration

# Por componente especifico
make test-integration-category
make test-integration-task
make test-integration-cross
```

### Ejemplo de estructura BDD

```typescript
describe('Feature: Gestion de categorias', () => {
  describe('Scenario: Crear una nueva categoria', () => {
    it('Given un store vacio, When se crea una categoria, Then aparece en la lista', () => {
      // Given
      // When
      // Then
    });
  });
});
```

---

## 2. Pruebas BDD con Cucumber + Playwright

Estas pruebas utilizan **Gherkin** (lenguaje natural) para describir el comportamiento de la aplicacion desde la perspectiva del usuario. Los escenarios escritos en archivos `.feature` son ejecutados por Cucumber, que utiliza Playwright para interactuar con la app Ionic en un navegador.

### Ubicacion

```
mobile-app/e2e/
  features/
    categories.feature        # Escenarios de gestion de categorias
    tasks.feature             # Escenarios de gestion de tareas
    navigation.feature        # Escenarios de navegacion
  step-definitions/
    common.steps.ts           # Pasos reutilizables (navegacion, clicks genericos)
    categories.steps.ts       # Pasos especificos de categorias
    tasks.steps.ts            # Pasos especificos de tareas
mobile-app/cucumber.js         # Configuracion de Cucumber
mobile-app/playwright.config.ts # Configuracion de Playwright
```

### Escenarios Gherkin incluidos

**categories.feature:**
- Crear una categoria exitosamente
- Eliminar una categoria sin tareas
- No permitir eliminar categoria con tareas asociadas
- Editar una categoria existente

**tasks.feature:**
- Crear una tarea exitosamente
- Completar una tarea
- Eliminar una tarea
- Filtrar tareas por busqueda

**navigation.feature:**
- Navegar a la pagina de categorias desde tareas
- Navegar de vuelta a tareas
- Navegar a creacion de nueva tarea

### Prerrequisitos

1. Tener el servidor de desarrollo de Ionic corriendo:
```bash
cd mobile-app && npm run start
# La app debe estar disponible en http://localhost:4200
```

2. Tener las dependencias instaladas (ya deberian estar si hiciste `npm install` en la raiz):
   - `@cucumber/cucumber` ^12.9.0
   - `@playwright/test` ^1.61.0
   - `playwright` ^1.61.0

### Como ejecutarlas

```bash
# Desde la raiz del proyecto con Makefile
make test-bdd

# Desde mobile-app/
cd mobile-app
npx cucumber-js

# Escenarios especificos
make test-bdd-categories
make test-bdd-tasks

# O directamente con cucumber-js
cd mobile-app
npx cucumber-js e2e/features/categories.feature --require e2e/step-definitions/*.steps.ts --require-module ts-node/register
```

### Reportes

Los reportes HTML se generan en:
```
mobile-app/e2e/reports/cucumber-report.html
mobile-app/e2e/reports/cucumber-report.json
```

---

## 3. Pruebas E2E con Appium

Estas pruebas automatizan la interaccion real con la aplicacion Ionic en un dispositivo Android o emulador. Utilizan **Appium** + **WebdriverIO** para simular acciones de usuario como taps, escritura de texto y deslizamientos.

### Ubicacion

```
mobile-app/e2e/appium/
  helpers/
    appium.setup.ts           # Driver factory y selectores comunes
  categories.appium.spec.ts    # Tests E2E de categorias
  tasks.appium.spec.ts         # Tests E2E de tareas
mobile-app/e2e/wdio.conf.ts    # Configuracion de WebdriverIO
```

### Prerrequisitos

1. **Appium 2.x** instalado globalmente:
```bash
npm install -g appium
appium driver install uiautomator2
```

2. **Android SDK** configurado con `ANDROID_HOME` y `JAVA_HOME`

3. **Emulador Android** corriendo o dispositivo fisico conectado:
```bash
# Verificar dispositivos disponibles
adb devices
```

4. **APK de la aplicacion** compilado:
```bash
cd mobile-app
npm run build:prod
cordova build android --debug
# APK generado en: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

5. **Variables de entorno** (opcional, usa valores por defecto):
```bash
export APPIUM_DEVICE_NAME="emulator-5554"
export APPIUM_PLATFORM_VERSION="13.0"
export APPIUM_APP_PATH="./platforms/android/app/build/outputs/apk/debug/app-debug.apk"
```

### Como ejecutarlas

```bash
# Terminal 1: Iniciar servidor Appium
appium

# Terminal 2: Ejecutar pruebas
make test-appium

# O directamente con wdio
cd mobile-app && npx wdio run e2e/wdio.conf.ts
```

### Que prueban

**categories.appium.spec.ts:**
- Crear una nueva categoria exitosamente
- Validar que existe boton de eliminar en categoria

**tasks.appium.spec.ts:**
- Crear una nueva tarea exitosamente
- Marcar tarea como completada
- Filtrar tareas por texto de busqueda

### Notas importantes sobre Appium

- Las pruebas asumen que la app ya tiene implementados **accessibility IDs** (`~element-id`) en los componentes Ionic. Si no los tienes, puedes anadirlos usando la propiedad `id` o `attr` en los componentes.
- Los tiempos de espera (`pause`) pueden necesitar ajuste segun la velocidad del emulador/dispositivo.
- Las pruebas de Appium requieren mas recursos que las pruebas unitarias o de integracion.
- Para iOS, cambiar `automationName` a `XCUITest` y ajustar capabilities.

---

## 4. Comandos Rapidos (Makefile)

```bash
# Pruebas de integracion (Jest)
make test-integration

# Pruebas BDD (Cucumber + Playwright)
make test-bdd

# Pruebas E2E (Appium)
make test-appium

# Todas las pruebas (integracion + BDD)
make test-all
```

## 5. Comandos npm (mobile-app/)

```bash
# Pruebas de integracion
npm run test:integration
npm run test:integration:category
npm run test:integration:task
npm run test:integration:cross

# Pruebas BDD
npm run test:bdd
npm run test:bdd:categories
npm run test:bdd:tasks
npm run test:bdd:navigation

# Pruebas E2E con Appium
npm run test:appium

# Todo
npm run test:all
```

---

## 6. Como escribir nuevas pruebas

### Nueva prueba de integracion (Jest)

1. Crear archivo en `mobile-app/e2e/integration/<nombre>.integration.spec.ts`
2. Seguir el patron BDD:
```typescript
describe('Feature: <nombre de la funcionalidad>', () => {
  describe('Scenario: <situacion especifica>', () => {
    it('Given <contexto>, When <accion>, Then <resultado esperado>', () => {
      // ...
    });
  });
});
```
3. Usar `of()` y `throwError()` de RxJS para simular casos de uso
4. Usar `fromJSON()` de las entidades para crear datos de prueba

### Nueva feature Gherkin

1. Crear archivo `.feature` en `mobile-app/e2e/features/`
2. Escribir escenarios en lenguaje natural:
```gherkin
Feature: Mi funcionalidad
  Scenario: Mi escenario
    Given un contexto
    When una accion
    Then un resultado
```
3. Implementar los steps en un archivo `.steps.ts` en `step-definitions/`

### Nueva prueba Appium

1. Crear archivo en `mobile-app/e2e/appium/`
2. Usar el helper `createDriver()` y `deleteSession()` de `helpers/appium.setup.ts`
3. Usar los `SELECTORS` predefinidos o agregar nuevos en `appium.setup.ts`
4. Estructura basica:
```typescript
describe('Feature: ...', () => {
  let driver;
  before(async () => { driver = await createDriver(); });
  after(async () => { await deleteSession(driver); });
  it('should ...', async () => {
    // driver.$('~selector').click();
    // expect(...).toBe(true);
  });
});
```

---

## 7. Estructura completa del directorio e2e/

```
mobile-app/e2e/
├── features/                           # Archivos Gherkin .feature
│   ├── categories.feature
│   ├── tasks.feature
│   └── navigation.feature
├── step-definitions/                   # Implementacion de steps Cucumber
│   ├── categories.steps.ts
│   ├── tasks.steps.ts
│   └── common.steps.ts
├── appium/                             # Tests E2E con Appium
│   ├── helpers/
│   │   └── appium.setup.ts
│   ├── categories.appium.spec.ts
│   └── tasks.appium.spec.ts
├── integration/                        # Tests de integracion (Jest)
│   ├── category-store.integration.spec.ts
│   ├── task-store.integration.spec.ts
│   └── task-category.integration.spec.ts
├── reports/                            # Reportes generados (gitignored)
│   ├── cucumber-report.html
│   ├── cucumber-report.json
│   └── appium-logs/
├── wdio.conf.ts                        # Config de WebdriverIO
└── cucumber.js                         # Config de Cucumber

mobile-app/playwright.config.ts         # Config de Playwright
mobile-app/cucumber.js                  # Config de Cucumber (alias)
```

---

## 8. FAQ / Troubleshooting

### Las pruebas de integracion fallan con errores de compilacion

Asegurate de que los `import` apuntan a las rutas correctas:
```typescript
// Correcto (desde e2e/integration/)
import { CategoryStore } from '../../src/app/presentation/stores/category.store';
import { Category } from '../../src/app/domain/entities/category.entity';
```

### Cucumber no encuentra los steps

Verifica que los archivos `.steps.ts` estan en `e2e/step-definitions/` y que el patron glob en `cucumber.js` es correcto:
```javascript
require: ['e2e/step-definitions/**/*.steps.ts']
```

### Appium no puede conectar al dispositivo

1. Verifica que `appium` esta corriendo (`appium &`)
2. Verifica que el emulador esta visible (`adb devices`)
3. Verifica que `APPIUM_APP_PATH` apunta al APK correcto
4. Prueba con `appium --relaxed-security` si hay problemas de permisos

### Playwright no encuentra la app

Asegurate de que el servidor de desarrollo de Ionic esta corriendo en `http://localhost:4200`:
```bash
cd mobile-app && npm run start
```

### Los tests de Appium son muy lentos

- Aumenta el `newCommandTimeout` en las capabilities
- Usa un emulator con menos recursos (API 30+ pero no la mas reciente)
- Considera usar `@wdio/sauce-service` para pruebas en la nube
