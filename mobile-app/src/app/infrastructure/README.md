# Infrastructure Layer

Esta capa implementa los adaptadores e infraestructura necesaria para hacer funcionar la aplicación. Sigue los principios de la Arquitectura Hexagonal y proporciona implementaciones concretas para las interfaces definidas en la capa de dominio.

## Estructura

```
infrastructure/
├── adapters/               # Adaptadores para servicios externos
│   ├── storage/           # Adaptador para almacenamiento local
│   │   ├── storage.service.ts      # Servicio de almacenamiento
│   │   └── storage.types.ts        # DTOs para almacenamiento
│   └── repositories/      # Implementaciones de repositorios
│       ├── task.repository.impl.ts     # Implementación del repositorio de tareas
│       └── category.repository.impl.ts # Implementación del repositorio de categorías
├── mappers/               # Mappers entre entidades y DTOs
│   ├── task.mapper.ts             # Mapper para tareas
│   └── category.mapper.ts         # Mapper para categorías
├── infrastructure.module.ts       # Módulo Angular para DI
├── index.ts                       # Barrel exports
└── README.md                      # Este archivo
```

## Componentes Principales

### Storage Service
- **Propósito**: Abstracción para almacenamiento local
- **Tecnologías**: Cordova NativeStorage + localStorage fallback
- **Funcionalidades**:
  - Almacenamiento reactivo con RxJS
  - Fallback automático a localStorage en desarrollo
  - Operaciones CRUD completas
  - Manejo de errores robusto

### Repository Implementations
Las implementaciones concretas de los repositorios definidos en el dominio.

#### TaskRepositoryImpl
- **Propósito**: Persistencia de tareas
- **Métodos**:
  - CRUD completo (Create, Read, Update, Delete)
  - Búsquedas avanzadas (por categoría, estado, texto)
  - Estadísticas (conteos, tareas sin categoría)
  - Operaciones en lote

#### CategoryRepositoryImpl
- **Propósito**: Persistencia de categorías
- **Métodos**:
  - CRUD completo
  - Búsquedas y validaciones
  - Estadísticas de uso
  - Ordenamiento personalizado

### Mappers
Los mappers convierten entre entidades de dominio y DTOs de almacenamiento.

#### TaskMapper
- **Propósito**: Conversión Task ↔ TaskDTO
- **Funcionalidades**:
  - Conversión bidireccional
  - Validación de estructura DTO
  - Conversión segura con manejo de errores
  - Métodos para arrays

#### CategoryMapper
- **Propósito**: Conversión Category ↔ CategoryDTO
- **Funcionalidades**:
  - Conversión bidireccional
  - Validación de estructura DTO
  - Conversión segura con manejo de errores
  - Métodos para arrays

## Patrones Implementados

### Repository Pattern
- Interfaces definidas en dominio, implementaciones en infraestructura
- Desacoplamiento entre lógica de negocio y persistencia
- Facilita testing con mocks

### Mapper Pattern
- Separación clara entre entidades y DTOs
- Validación de datos de entrada
- Conversión segura con manejo de errores

### Dependency Injection
- Configuración a través de InfrastructureModule
- Inyección por interfaz usando tokens
- Fácil intercambio de implementaciones

## Uso

### Importar el módulo
```typescript
import { InfrastructureModule } from './infrastructure';

@NgModule({
  imports: [InfrastructureModule]
})
export class AppModule {}
```

### Inyectar repositorios
```typescript
// Opción 1: Por clase concreta (más simple)
constructor(
  private taskRepo: TaskRepositoryImpl,
  private categoryRepo: CategoryRepositoryImpl
) {}

// Opción 2: Por interfaz usando tokens (más flexible)
constructor(
  @Inject(TASK_REPOSITORY) private taskRepo: TaskRepository,
  @Inject(CATEGORY_REPOSITORY) private categoryRepo: CategoryRepository
) {}

// Opción 3: Por interfaz directa (configurado en el módulo)
constructor(
  private taskRepo: TaskRepository,
  private categoryRepo: CategoryRepository
) {}
```

## Tecnologías

- **Angular**: Framework y sistema de DI
- **RxJS**: Programación reactiva
- **Cordova NativeStorage**: Almacenamiento nativo móvil
- **localStorage**: Fallback para desarrollo web

## Consideraciones de Desarrollo

### Cordova vs Web
- En dispositivos: usa NativeStorage para mejor rendimiento
- En navegador: usa localStorage como fallback
- Cambio transparente, misma API

### Manejo de Errores
- Todos los métodos incluyen manejo de errores
- Logs detallados para debugging
- Fallbacks apropiados para casos de error

### Testing
- Servicios inyectables fáciles de mockear
- Mappers con validación robusta
- Separación clara de responsabilidades

### Performance
- Operaciones asíncronas no bloqueantes
- Caching interno en repositorios
- Validaciones optimizadas en mappers

## Próximos Pasos

1. **Implementar caché**: Agregar caching layer para mejor performance
2. **Añadir sincronización**: Preparar para sync con backend futuro
3. **Métricas**: Implementar logging y métricas de uso
4. **Optimizaciones**: Batch operations y lazy loading