# Application Layer

La capa de aplicación (Application Layer) implementa los casos de uso (Use Cases) del sistema siguiendo los principios de la Arquitectura Hexagonal y Domain Driven Design (DDD). Esta capa orquesta la lógica de negocio definida en el dominio y coordina las operaciones entre las diferentes capas.

## 📋 Responsabilidades

- **Casos de Uso**: Implementación de las operaciones específicas del negocio
- **Coordinación**: Orquestación entre dominio e infraestructura
- **Validación**: Validación de entrada y reglas de negocio
- **Transformación**: Mapeo entre entidades del dominio y DTOs
- **Transaccionalidad**: Manejo de transacciones y consistencia

## 🏗️ Estructura

```
application/
├── interfaces/           # Contratos y DTOs
│   ├── common.interfaces.ts    # Interfaces comunes
│   ├── task.interfaces.ts      # DTOs para tareas
│   ├── category.interfaces.ts  # DTOs para categorías
│   └── index.ts                # Barrel exports
├── use-cases/           # Casos de uso
│   ├── task/                   # Casos de uso de tareas
│   │   ├── create-task.use-case.ts
│   │   ├── get-all-tasks.use-case.ts
│   │   ├── get-task-by-id.use-case.ts
│   │   ├── update-task.use-case.ts
│   │   ├── delete-task.use-case.ts
│   │   ├── complete-task.use-case.ts
│   │   ├── get-tasks-by-category.use-case.ts
│   │   └── index.ts
│   ├── category/               # Casos de uso de categorías
│   │   ├── create-category.use-case.ts
│   │   ├── get-all-categories.use-case.ts
│   │   ├── update-category.use-case.ts
│   │   ├── delete-category.use-case.ts
│   │   ├── get-category-stats.use-case.ts
│   │   └── index.ts
│   └── index.ts
├── index.ts             # Export principal
└── README.md           # Este archivo
```

## 🎯 Casos de Uso Implementados

### Casos de Uso de Tareas

#### CreateTaskUseCase
- **Propósito**: Crear una nueva tarea
- **Validaciones**: 
  - Título requerido (máx. 200 caracteres)
  - Descripción opcional (máx. 1000 caracteres)
  - Validación de existencia de categoría
- **Entrada**: `CreateTaskInput`
- **Salida**: `TaskOutput`

#### GetAllTasksUseCase
- **Propósito**: Obtener todas las tareas
- **Entrada**: Ninguna
- **Salida**: `TaskOutput[]`

#### GetTaskByIdUseCase
- **Propósito**: Obtener una tarea específica por ID
- **Validaciones**: Existencia de la tarea
- **Entrada**: `GetTaskByIdInput`
- **Salida**: `TaskOutput`

#### UpdateTaskUseCase
- **Propósito**: Actualizar propiedades de una tarea
- **Validaciones**: 
  - Existencia de la tarea
  - Validación de nuevos valores
  - Validación de categoría si se cambia
- **Entrada**: `UpdateTaskInput`
- **Salida**: `TaskOutput`

#### DeleteTaskUseCase
- **Propósito**: Eliminar una tarea
- **Validaciones**: Existencia de la tarea
- **Entrada**: `DeleteTaskInput`
- **Salida**: `void`

#### CompleteTaskUseCase
- **Propósito**: Marcar tarea como completada/incompleta
- **Validaciones**: Existencia de la tarea
- **Entrada**: `CompleteTaskInput`
- **Salida**: `TaskOutput`

#### GetTasksByCategoryUseCase
- **Propósito**: Obtener tareas filtradas por categoría
- **Características**: Soporte para tareas sin categoría ("uncategorized")
- **Entrada**: `GetTasksByCategoryInput`
- **Salida**: `TaskOutput[]`

### Casos de Uso de Categorías

#### CreateCategoryUseCase
- **Propósito**: Crear una nueva categoría
- **Validaciones**:
  - Nombre único (máx. 50 caracteres)
  - Color en formato hex válido
  - Icono opcional (máx. 50 caracteres)
- **Entrada**: `CreateCategoryInput`
- **Salida**: `CategoryOutput`

#### GetAllCategoriesUseCase
- **Propósito**: Obtener todas las categorías
- **Entrada**: Ninguna
- **Salida**: `CategoryOutput[]`

#### UpdateCategoryUseCase
- **Propósito**: Actualizar propiedades de una categoría
- **Validaciones**:
  - Existencia de la categoría
  - Nombre único si se cambia
  - Formato de color válido
- **Entrada**: `UpdateCategoryInput`
- **Salida**: `CategoryOutput`

#### DeleteCategoryUseCase
- **Propósito**: Eliminar una categoría
- **Características**: 
  - Desasigna automáticamente todas las tareas
  - Retorna información de tareas afectadas
- **Entrada**: `DeleteCategoryInput`
- **Salida**: `DeleteCategoryOutput`

#### GetCategoryStatsUseCase
- **Propósito**: Obtener estadísticas de categorías
- **Características**: 
  - Conteo de tareas por categoría
  - Tareas completadas vs pendientes
  - Tareas sin categorizar
- **Entrada**: Ninguna
- **Salida**: `CategoryStatsOutput`

## 📝 DTOs e Interfaces

### Interfaces Comunes

#### UseCase<TInput, TOutput>
```typescript
interface UseCase<TInput, TOutput> {
  execute(input?: TInput): Observable<TOutput>;
}
```

#### Result<TData, TError>
```typescript
interface Result<TData, TError> {
  success: boolean;
  data?: TData;
  error?: TError;
  message?: string;
}
```

### DTOs de Tareas

#### CreateTaskInput
```typescript
interface CreateTaskInput {
  title: string;
  description?: string;
  categoryId?: string;
}
```

#### TaskOutput
```typescript
interface TaskOutput {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  categoryId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

### DTOs de Categorías

#### CreateCategoryInput
```typescript
interface CreateCategoryInput {
  name: string;
  color: string;
  icon?: string;
}
```

#### CategoryOutput
```typescript
interface CategoryOutput {
  id: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
}
```

## 🔧 Manejo de Errores

### Errores Específicos

- **TaskNotFoundError**: Tarea no encontrada
- **TaskValidationError**: Error de validación en tarea
- **CategoryNotFoundError**: Categoría no encontrada  
- **CategoryValidationError**: Error de validación en categoría
- **DuplicateCategoryNameError**: Nombre de categoría duplicado
- **CategoryHasTasksError**: Categoría con tareas asignadas

### Estructura de Error
```typescript
class UseCaseError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly details?: any
  );
}
```

## 📊 Patrones Implementados

### Command Query Responsibility Segregation (CQRS)
- **Commands**: Operaciones que modifican estado (Create, Update, Delete, Complete)
- **Queries**: Operaciones de lectura (GetAll, GetById, GetByCategory, GetStats)

### Repository Pattern
- Uso de interfaces del dominio para persistencia
- Inversión de dependencias
- Testabilidad mejorada

### DTO Pattern
- Separación entre entidades del dominio y datos de transporte
- Validación en la capa de aplicación
- Transformación de datos

## 🧪 Testing

### Estrategias de Testing

1. **Unit Testing**: Cada use case individualmente
2. **Integration Testing**: Use cases con repositorios mock
3. **Contract Testing**: Validación de interfaces
4. **Error Testing**: Manejo de casos de error

### Ejemplo de Test
```typescript
describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase;
  let mockTaskRepository: jest.Mocked<TaskRepository>;
  let mockCategoryRepository: jest.Mocked<CategoryRepository>;

  beforeEach(() => {
    mockTaskRepository = createMockTaskRepository();
    mockCategoryRepository = createMockCategoryRepository();
    useCase = new CreateTaskUseCase(mockTaskRepository, mockCategoryRepository);
  });

  it('should create a task successfully', async () => {
    // Test implementation
  });
});
```

## 📖 Uso desde Presentation Layer

### Inyección de Dependencias
```typescript
@Component({...})
export class TaskListComponent {
  constructor(
    private getAllTasksUseCase: GetAllTasksUseCase,
    private createTaskUseCase: CreateTaskUseCase
  ) {}
}
```

### Ejecución de Use Cases
```typescript
loadTasks(): void {
  this.getAllTasksUseCase.execute().subscribe({
    next: (tasks) => this.tasks.set(tasks),
    error: (error) => this.handleError(error)
  });
}

createTask(input: CreateTaskInput): void {
  this.createTaskUseCase.execute(input).subscribe({
    next: (task) => this.tasks.update(tasks => [...tasks, task]),
    error: (error) => this.handleError(error)
  });
}
```

## 🔄 Flujo de Datos

```
Presentation → Application → Domain → Infrastructure
     ↓              ↓          ↓           ↓
  Components → Use Cases → Entities → Repositories
     ↑              ↑          ↑           ↑
     ← DTOs ← ← ← Domain ← ← ← Data ← ← ← ←
```

## 📚 Principios Seguidos

- **Single Responsibility**: Cada use case una responsabilidad
- **Dependency Inversion**: Dependencias hacia abstracciones
- **Interface Segregation**: Interfaces específicas y pequeñas
- **Don't Repeat Yourself**: Reutilización de código común
- **Fail Fast**: Validación temprana de entradas
- **Observable Pattern**: Programación reactiva con RxJS

## 🚀 Próximos Pasos

1. **Implementación de Infrastructure Layer** (Task 4)
2. **Implementación de Presentation Layer** (Task 5)
3. **Testing Comprehensivo** (Task 16-17)
4. **Optimizaciones de Performance**

---

**Autor**: Edgar Guerrero  
**Fecha**: 21 de Noviembre de 2025  
**Versión**: 1.0.0