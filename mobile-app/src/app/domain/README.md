# Domain Layer - Arquitectura Hexagonal

Esta es la capa de **Dominio** de nuestra aplicación, siguiendo los principios de **Arquitectura Hexagonal** (Ports and Adapters) y **Domain Driven Design (DDD)**.

## 📋 Estructura

```
domain/
├── entities/           # Entidades del dominio
│   ├── task.entity.ts         # Entidad Task con lógica de negocio
│   └── category.entity.ts     # Entidad Category con lógica de negocio
├── repositories/       # Interfaces de repositorios (Ports)
│   ├── task.repository.ts     # Contrato para persistencia de tareas
│   └── category.repository.ts # Contrato para persistencia de categorías
├── value-objects/      # Value Objects
│   ├── task-id.vo.ts          # Value Object para ID de tareas
│   └── category-id.vo.ts      # Value Object para ID de categorías
└── index.ts           # Barrel export para la capa de dominio
```

## 🎯 Principios Aplicados

### 1. **Independencia de Frameworks**
- No depende de Angular, Ionic o cualquier framework específico
- Contiene únicamente lógica de negocio pura en TypeScript

### 2. **Entidades (Entities)**
Las entidades representan los conceptos principales del dominio:

#### Task Entity
- **Responsabilidades**: Gestión del ciclo de vida de una tarea
- **Métodos de negocio**: 
  - `complete()` / `uncomplete()`: Cambiar estado de completitud
  - `assignCategory()` / `removeCategory()`: Gestión de categorías
  - `update()`: Actualización de datos
  - `belongsToCategory()`: Verificación de pertenencia

#### Category Entity  
- **Responsabilidades**: Gestión de categorías para organizar tareas
- **Métodos de negocio**:
  - `update()`: Actualización de nombre, color e icono
  - `updateName()`, `updateColor()`, `updateIcon()`: Actualizaciones específicas
- **Métodos estáticos**: Colores e iconos predefinidos

### 3. **Value Objects**
Objetos inmutables que representan conceptos del dominio:

#### TaskId & CategoryId
- **Encapsulan**: Lógica de validación de IDs
- **Proporcionan**: Métodos de generación y validación
- **Garantizan**: Consistencia en el formato de identificadores

### 4. **Repository Pattern (Ports)**
Las interfaces de repositorio definen contratos para la persistencia:

#### TaskRepository
- **CRUD básico**: save, update, delete, findById, findAll
- **Consultas específicas**: findByCategory, findCompleted, findPending
- **Búsquedas**: searchByText
- **Estadísticas**: count, countCompleted, countPending

#### CategoryRepository
- **CRUD básico**: save, update, delete, findById, findAll
- **Consultas específicas**: findByName, findMostUsed, findUnused
- **Validaciones**: existsByName, existsByNameExcluding
- **Ordenamiento**: findAllSorted, findAllByCreationDate

## 🔧 Beneficios de esta Arquitectura

### 1. **Testabilidad**
- Las entidades y value objects son fáciles de testear (no dependencies)
- Los contratos de repositorios permiten fácil mocking
- Lógica de negocio aislada y verificable

### 2. **Mantenibilidad**
- Lógica de negocio centralizada en entidades
- Cambios en persistencia no afectan el dominio
- Interfaces claras y bien definidas

### 3. **Escalabilidad**
- Fácil agregar nuevas entidades y value objects
- Repositorios extensibles sin romper contratos existentes
- Separación clara de responsabilidades

### 4. **Reutilización**
- Entidades pueden usarse en diferentes contextos
- Value objects garantizan consistencia en toda la aplicación
- Interfaces de repositorio permiten diferentes implementaciones

## 🧪 Testing

Para testear esta capa de dominio:

```typescript
// Ejemplo de test para Task entity
describe('Task Entity', () => {
  it('should complete task and update timestamp', () => {
    const task = Task.create('task_1', 'Test task');
    const originalUpdatedAt = task.updatedAt;
    
    task.complete();
    
    expect(task.completed).toBe(true);
    expect(task.updatedAt).not.toEqual(originalUpdatedAt);
  });
});
```

## 🔄 Próximos Pasos

Esta capa de dominio será utilizada por:

1. **Application Layer** (Task 3): Use cases que orquestan la lógica de negocio
2. **Infrastructure Layer** (Task 4): Implementaciones concretas de los repositorios
3. **Presentation Layer** (Task 5): UI que consume los use cases

## 📚 Referencias

- [Clean Architecture - Robert C. Martin](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [Hexagonal Architecture - Alistair Cockburn](https://alistair.cockburn.us/hexagonal-architecture/)
- [Domain Driven Design - Eric Evans](https://domainlanguage.com/ddd/)

---

**Creado**: Task 2 - Arquitectura Hexagonal - Domain Layer  
**Fecha**: 21 de Noviembre de 2025  
**Autor**: Edgar Guerrero