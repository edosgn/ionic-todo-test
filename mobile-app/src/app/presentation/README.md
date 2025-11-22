# Presentation Layer

Esta capa maneja la interfaz de usuario y la lógica de presentación de la aplicación. Implementa una arquitectura reactiva usando Angular Signals y sigue las mejores prácticas de UX para aplicaciones móviles con Ionic.

## Estructura

```
presentation/
├── components/              # Componentes reutilizables de UI
│   ├── task-list/          # Lista de tareas con filtros
│   └── task-form/          # Formulario para crear/editar tareas
├── pages/                  # Páginas de la aplicación
│   └── tasks/             # Página principal de tareas
├── stores/                # Gestión de estado reactivo
│   ├── task.store.ts      # Store de tareas con Signals
│   └── category.store.ts  # Store de categorías con Signals
├── mappers/               # Conversión DTO/Entity para presentación
│   ├── task-presentation.mapper.ts
│   └── category-presentation.mapper.ts
├── presentation.module.ts  # Módulo Angular para DI
├── index.ts               # Barrel exports
└── README.md              # Este archivo
```

## Componentes Principales

### TaskStore
- **Propósito**: Gestión reactiva del estado de tareas
- **Tecnología**: Angular Signals para reactividad óptima
- **Funcionalidades**:
  - Estado reactivo de tareas con computed signals
  - Filtrado por categoría y búsqueda de texto
  - Estadísticas automáticas (totales, completadas, pendientes)
  - Integración con use cases de la capa de aplicación
  - Manejo de estado de carga y errores

### CategoryStore
- **Propósito**: Gestión reactiva del estado de categorías
- **Funcionalidades**:
  - Lista de categorías ordenada y filtrable
  - Validación de nombres duplicados
  - Estadísticas de uso de categorías
  - Sincronización con el TaskStore

### TaskListComponent
- **Propósito**: Lista interactiva de tareas con UI móvil-first
- **Características**:
  - Lista virtual para rendimiento con muchos elementos
  - Filtros por categoría con chips visuales
  - Búsqueda en tiempo real con debounce
  - Swipe actions para editar/eliminar
  - Estados de carga, error y empty state
  - Estadísticas visuales en tiempo real
  - Responsive design para móvil y tablet

### TaskFormComponent
- **Propósito**: Formulario reactivo para crear/editar tareas
- **Características**:
  - Validación en tiempo real
  - Selector de categorías con preview visual
  - Soporte para modo creación y edición
  - Manejo de errores con feedback visual
  - Diseño móvil-first con accesibilidad

## Patrones Implementados

### Signal-Based Architecture
```typescript
// Store reactivo con computed signals
class TaskStore {
  private readonly _tasks = signal<Task[]>([]);
  private readonly _loading = signal<boolean>(false);
  
  readonly tasks = this._tasks.asReadonly();
  readonly loading = this._loading.asReadonly();
  
  // Computed signals para estado derivado
  readonly completedTasks = computed(() => 
    this._tasks().filter(task => task.completed)
  );
  
  readonly taskStats = computed(() => ({
    total: this._tasks().length,
    completed: this.completedTasks().length,
    // ...
  }));
}
```

### Dependency Injection Pattern
```typescript
// Inyección de stores en componentes
export class TaskListComponent {
  private readonly taskStore = inject(TaskStore);
  private readonly categoryStore = inject(CategoryStore);
  
  readonly tasks = this.taskStore.filteredTasks;
  readonly categories = this.categoryStore.categories;
}
```

### Presentation Mapper Pattern
```typescript
// Conversión DTO -> Domain Entity para UI
class TaskPresentationMapper {
  toDomain(dto: TaskOutput): Task {
    return new Task(/* ... */);
  }
}
```

## Características de UX/UI

### Diseño Mobile-First
- **Responsive**: Adaptable a móvil, tablet y desktop
- **Touch-friendly**: Botones y áreas táctiles optimizadas
- **Swipe gestures**: Acciones naturales de deslizar
- **FAB**: Floating Action Button para acción primaria

### Estados de UI
- **Loading**: Spinners y skeletons durante carga
- **Empty State**: Ilustraciones y CTAs cuando no hay datos
- **Error State**: Mensajes claros con acciones de recuperación
- **Success State**: Feedback visual de acciones exitosas

### Accesibilidad
- **Contraste**: Cumple WCAG 2.1 AA
- **Screen readers**: Labels y roles apropiados
- **Keyboard navigation**: Navegación completa por teclado
- **Focus management**: Estados de foco claros

### Animaciones y Micro-interacciones
- **Page transitions**: Transiciones suaves entre vistas
- **Button states**: Estados hover/active/disabled
- **List animations**: Animaciones de entrada/salida en listas
- **Loading states**: Indicadores de progreso elegantes

## Integración con Capas

### Capa de Aplicación
```typescript
// Los stores consumen use cases
createTask(input: CreateTaskInput): Observable<Task> {
  return this.createTaskUseCase.execute(input).pipe(
    map(taskOutput => this.mapper.toDomain(taskOutput))
  );
}
```

### Capa de Dominio
```typescript
// Los componentes trabajan con entidades de dominio
onToggleComplete(task: Task): void {
  task.complete(); // Método de negocio
  this.taskStore.updateTask(task);
}
```

## Gestión de Estado

### Reactive State Flow
```
User Action → Store Method → Use Case → Repository
     ↑                                        ↓
Component Signal ← Computed Signal ← Store Update
```

### Estado Local vs Global
- **Global State**: Tasks, Categories, User preferences
- **Local State**: Form data, UI state (modals, loading)
- **Computed State**: Filtros, estadísticas, estados derivados

## Optimizaciones de Rendimiento

### Change Detection
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush // Cuando sea posible
})
```

### TrackBy Functions
```typescript
trackByTaskId(index: number, task: Task): string {
  return task.id; // Evita re-rendering innecesario
}
```

### Lazy Loading
```typescript
// Componentes cargados bajo demanda
const routes: Routes = [
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/tasks.page').then(m => m.TasksPage)
  }
];
```

### Virtual Scrolling
```html
<!-- Para listas grandes -->
<cdk-virtual-scroll-viewport itemSize="80">
  <ion-item *cdkVirtualFor="let task of tasks()">
    <!-- Task content -->
  </ion-item>
</cdk-virtual-scroll-viewport>
```

## Testing

### Component Testing
```typescript
describe('TaskListComponent', () => {
  it('should display tasks', () => {
    // Arrange
    const mockTasks = [/* ... */];
    taskStore.tasks.set(mockTasks);
    
    // Act
    fixture.detectChanges();
    
    // Assert
    expect(component.tasks()).toEqual(mockTasks);
  });
});
```

### Store Testing
```typescript
describe('TaskStore', () => {
  it('should filter tasks by category', () => {
    // Test signal-based state management
    store._tasks.set(mockTasks);
    store.setCategoryFilter('category-1');
    
    expect(store.filteredTasks()).toHaveLength(2);
  });
});
```

## Uso

### Importar el módulo
```typescript
import { PresentationModule } from './presentation';

@NgModule({
  imports: [PresentationModule]
})
export class AppModule {}
```

### Usar componentes
```typescript
import { TaskListComponent, TaskFormComponent } from './presentation';

@Component({
  imports: [TaskListComponent, TaskFormComponent],
  template: `
    <app-task-list></app-task-list>
    <app-task-form [task]="selectedTask"></app-task-form>
  `
})
export class TasksPage {}
```

### Inyectar stores
```typescript
export class TasksComponent {
  private readonly taskStore = inject(TaskStore);
  
  readonly tasks = this.taskStore.tasks;
  readonly loading = this.taskStore.loading;
}
```

## Próximos Pasos

1. **Routing**: Navegación entre páginas con Angular Router
2. **Modals**: Diálogos y overlays para formularios
3. **Toasts**: Notificaciones de feedback al usuario
4. **Pull to Refresh**: Actualización manual de datos
5. **Infinite Scroll**: Carga paginada para listas grandes
6. **Dark Mode**: Tema oscuro con preferencias del sistema
7. **Offline UI**: Estados para funcionamiento sin conexión
8. **Animation Library**: Micro-interacciones avanzadas

## Tecnologías

- **Angular 18+**: Framework con Signals
- **Ionic 8+**: Componentes móviles
- **RxJS**: Programación reactiva
- **Angular CDK**: Virtual scrolling, overlays
- **Ionicons**: Iconografía consistente

## Mejores Prácticas

1. **Signals over Subjects**: Preferir Signals para estado local
2. **Computed over Methods**: Usar computed para estado derivado  
3. **Standalone Components**: Evitar NgModules cuando sea posible
4. **Barrel Exports**: Centralizar exports por funcionalidad
5. **Error Boundaries**: Manejo graceful de errores de UI
6. **Loading States**: Siempre mostrar feedback de carga
7. **Optimistic Updates**: Actualizar UI antes de confirmar
8. **Consistent Naming**: Convenciones claras de nomenclatura