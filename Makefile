.PHONY: help install clean clean-all reinstall serve build build-prod lint format

help:           ## Muestra esta ayuda
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

install:        ## Instala dependencias de forma limpia y estable
	@echo "📦 Instalando dependencias..."
	npm install

clean:          ## Elimina node_modules y package-lock.json
	@echo "🧹 Limpiando node_modules y lock file..."
	rm -rf node_modules package-lock.json

clean-all: clean ## Elimina node_modules, lock y limpia caché de npm
	@echo "🧼 Limpiando caché de npm..."
	npm cache clean --force

reinstall: clean-all ## Reinstalación completa desde cero (recomendado tras errores)
	@echo "🔄 Reinstalando desde cero..."
	npm install

serve:          ## Inicia servidor de desarrollo
	@echo "🚀 Iniciando servidor de desarrollo..."
	cd mobile-app && npm run start

build:          ## Build de desarrollo
	@echo "🔨 Compilando (desarrollo)..."
	cd mobile-app && npm run build

build-prod:     ## Build de producción optimizado
	@echo "🔨 Compilando (producción)..."
	cd mobile-app && npm run build:prod

lint:           ## Ejecuta linter
	@echo "🔍 Ejecutando linter..."
	cd mobile-app && npm run lint

format:         ## Formatea código con Prettier
	@echo "🎨 Formateando código..."
	cd mobile-app && npm run format

# ---------- Testing targets ----------

test-integration:   ## Run integration tests (Jest - BDD style)
	@echo "🧪 Ejecutando pruebas de integración..."
	cd mobile-app && npx jest --config jest.config.e2e.ts

test-integration-category: ## Run category integration tests only
	@echo "🧪 Ejecutando pruebas de integración de categorías..."
	cd mobile-app && npx jest --config jest.config.e2e.ts --testPathPattern='category-store.integration'

test-integration-task:  ## Run task integration tests only
	@echo "🧪 Ejecutando pruebas de integración de tareas..."
	cd mobile-app && npx jest --config jest.config.e2e.ts --testPathPattern='task-store.integration'

test-integration-cross: ## Run cross-store integration tests only
	@echo "🧪 Ejecutando pruebas de integración cruzada (task-category)..."
	cd mobile-app && npx jest --config jest.config.e2e.ts --testPathPattern='task-category.integration'

test-bdd:           ## Run BDD tests with Cucumber + Playwright (requires dev server + Playwright browsers installed)
	@echo "🧪 Ejecutando pruebas BDD con Cucumber..."
	cd mobile-app && npx cucumber-js

test-bdd-dry:       ## Validate BDD feature syntax without running (no browser required)
	@echo "🔍 Validando sintaxis de features BDD..."
	cd mobile-app && npx cucumber-js --profile dry

test-bdd-categories: ## Run BDD tests for categories only
	@echo "🧪 Ejecutando pruebas BDD de categorías..."
	cd mobile-app && npx cucumber-js e2e/features/categories.feature --require e2e/step-definitions/*.steps.ts --require-module ts-node/register

test-bdd-tasks:     ## Run BDD tests for tasks only
	@echo "🧪 Ejecutando pruebas BDD de tareas..."
	cd mobile-app && npx cucumber-js e2e/features/tasks.feature --require e2e/step-definitions/*.steps.ts --require-module ts-node/register

test-appium:        ## Run E2E tests with Appium (requires emulator/device + APK)
	@echo "📱 Ejecutando pruebas E2E con Appium..."
	cd mobile-app && npx wdio run e2e/wdio.conf.ts

test-all: test-integration test-bdd  ## Run all tests (integration + BDD)