/**
 * Task-Category Cross-Store Integration Tests (BDD-style)
 *
 * These tests validate the integration BETWEEN TaskStore and CategoryStore,
 * the most critical cross-store interaction in the application.
 * Written in BDD-style to demonstrate Behavior-Driven Development principles
 * for integration testing.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { of } from 'rxjs';
import { Injector, runInInjectionContext } from '@angular/core';
import { TaskStore } from '../../src/app/presentation/stores/task.store';
import { CategoryStore } from '../../src/app/presentation/stores/category.store';
import { Task } from '../../src/app/domain/entities/task.entity';
import { Category } from '../../src/app/domain/entities/category.entity';
import { FeatureFlagStore } from '../../src/app/presentation/stores/feature-flag.store';

// ---------------------------------------------------------------------------
// Helpers - shared mocks
// ---------------------------------------------------------------------------
const now = new Date();

// Category mocks
const mockCategoryOutput = {
  id: 'c1',
  name: 'Personal',
  color: '#4ECDC4',
  icon: 'person',
  createdAt: now,
  updatedAt: now,
};

const mockCategoryOutput2 = {
  id: 'c2',
  name: 'Trabajo',
  color: '#FF6B6B',
  icon: 'briefcase',
  createdAt: now,
  updatedAt: now,
};

// Task mocks - linked to categories above
const mockTaskOutput = {
  id: 't1',
  title: 'Comprar viveres',
  description: 'Leche, pan, huevos',
  completed: false,
  categoryId: 'c1', // assigned to "Personal"
  createdAt: now,
  updatedAt: now,
};

const mockTaskOutput2 = {
  id: 't2',
  title: 'Hacer ejercicio',
  description: '30 minutos de cardio',
  completed: true,
  categoryId: 'c1', // also assigned to "Personal"
  createdAt: now,
  updatedAt: now,
};

const mockTaskOutput3 = {
  id: 't3',
  title: 'Estudiar Angular',
  description: 'Revisar señales',
  completed: false,
  categoryId: 'c2', // assigned to "Trabajo"
  createdAt: now,
  updatedAt: now,
};

const mockTaskOutput4 = {
  id: 't4',
  title: 'Sin categoría',
  description: '',
  completed: false,
  categoryId: null, // no category
  createdAt: now,
  updatedAt: now,
};

const isoMapper = {
  toDomainArray: (outputs: any[]) =>
    outputs.map((o: any) =>
      Task.fromJSON({
        ...o,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
        updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : o.updatedAt,
      }),
    ),
  toDomain: (o: any) =>
    Task.fromJSON({
      ...o,
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : o.updatedAt,
    }),
};

const categoryMapper = {
  toDomainArray: (outs: any[]) =>
    outs.map((o: any) =>
      Category.fromJSON({
        ...o,
        createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
        updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : o.updatedAt,
      }),
    ),
  toDomain: (o: any) =>
    Category.fromJSON({
      ...o,
      createdAt: o.createdAt instanceof Date ? o.createdAt.toISOString() : o.createdAt,
      updatedAt: o.updatedAt instanceof Date ? o.updatedAt.toISOString() : o.updatedAt,
    }),
};

/**
 * Create a mock FeatureFlagStore with default values suitable for testing.
 */
function createMockFeatureFlagStore(): FeatureFlagStore {
  const mock: any = {
    maxTasksLimit: () => 200,
    categoriesEnabled: () => true,
    deleteTaskEnabled: () => true,
    appTitle: () => 'Mis Tareas',
    statisticsVisible: () => true,
    initialized: () => true,
    shouldShowCategories: () => true,
    shouldShowDeleteButton: () => true,
    featureFlags: () => ({
      enableCategories: true,
      enableDeleteTask: true,
      appTitle: 'Mis Tareas',
      maxTasks: 200,
      showStatistics: true,
      themeConfig: { primaryColor: '#3880ff', accentColor: '#0cd1e8', darkMode: false },
    }),
    loading: () => false,
    error: () => null,
  };
  return mock as FeatureFlagStore;
}

/**
 * Create a TaskStore with mocked dependencies, properly handling
 * the inject() call inside its constructor via Angular Injector.
 */
function createTaskStoreWithMocks(
  overrides?: {
    getAllTasks?: any;
    getTaskById?: any;
    createTask?: any;
    updateTask?: any;
    deleteTask?: any;
    completeTask?: any;
    getTasksByCategory?: any;
  },
): TaskStore {
  const getAllTasksUseCase = overrides?.getAllTasks ?? { execute: () => of([mockTaskOutput, mockTaskOutput2, mockTaskOutput3, mockTaskOutput4]) };
  const getTaskByIdUseCase = overrides?.getTaskById ?? { execute: () => of(mockTaskOutput) };
  const createTaskUseCase = overrides?.createTask ?? { execute: () => of(mockTaskOutput) };
  const updateTaskUseCase = overrides?.updateTask ?? { execute: () => of(mockTaskOutput) };
  const deleteTaskUseCase = overrides?.deleteTask ?? { execute: () => of(void 0) };
  const completeTaskUseCase = overrides?.completeTask ?? { execute: () => of({ ...mockTaskOutput, completed: true }) };
  const getTasksByCategoryUseCase = overrides?.getTasksByCategory ?? { execute: () => of([mockTaskOutput, mockTaskOutput2]) };

  const injector = Injector.create({
    providers: [
      { provide: FeatureFlagStore, useFactory: createMockFeatureFlagStore },
    ],
  });

  return runInInjectionContext(injector, () => {
    return new TaskStore(
      getAllTasksUseCase as any,
      getTaskByIdUseCase as any,
      createTaskUseCase as any,
      updateTaskUseCase as any,
      deleteTaskUseCase as any,
      completeTaskUseCase as any,
      getTasksByCategoryUseCase as any,
      isoMapper as any,
    );
  });
}

/**
 * Create a TaskStore pre-loaded with tasks linked to categories.
 */
function createTaskStore() {
  return createTaskStoreWithMocks();
}

/**
 * Create a CategoryStore pre-loaded with categories.
 */
function createCategoryStore() {
  return new CategoryStore(
    { execute: () => of([mockCategoryOutput, mockCategoryOutput2]) } as any,
    { execute: () => of(mockCategoryOutput) } as any,
    { execute: () => of(mockCategoryOutput) } as any,
    { execute: () => of({ affectedTasksCount: 0 }) } as any,
    { execute: () => of({ totalCategories: 2 }) } as any,
    categoryMapper as any,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Feature: Integración entre TaskStore y CategoryStore', () => {
  let taskStore: TaskStore;
  let categoryStore: CategoryStore;

  beforeEach(() => {
    taskStore = createTaskStore();
    categoryStore = createCategoryStore();

    // Load data into both stores
    taskStore.loadTasks();
    categoryStore.loadCategories();
  });

  // -----------------------------------------------------------------------
  // Scenario: Contar tareas por categoría
  // -----------------------------------------------------------------------
  describe('Scenario: Contar tareas por categoría', () => {
    it('Given tareas y categorías cargadas, When se consulta el contador de tareas por categoría, Then retorna el número correcto de tareas asignadas', () => {
      // Given (data loaded in beforeEach)
      // c1 = Personal tiene 2 tareas (t1, t2)
      // c2 = Trabajo tiene 1 tarea (t3)

      // When
      const countForC1 = taskStore.getTaskCountByCategory()('c1');
      const countForC2 = taskStore.getTaskCountByCategory()('c2');

      // Then
      expect(countForC1).toBe(2);
      expect(countForC2).toBe(1);
    });

    it('Given tareas cargadas, When se consulta el contador para una categoría sin tareas, Then retorna 0', () => {
      // Given
      // c999 no existe en ninguna tarea

      // When
      const count = taskStore.getTaskCountByCategory()('c999');

      // Then
      expect(count).toBe(0);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Validación de tareas por categoría antes de eliminar
  // -----------------------------------------------------------------------
  describe('Scenario: Validación de tareas antes de eliminar categoría', () => {
    it('Given una categoría sin tareas asignadas, When se verifica el contador, Then debería permitir eliminación segura', () => {
      // Given - creamos una categoría sin tareas
      const emptyCategoryId = 'c-empty';
      // Our task store has no tasks with this category ID

      // When
      const taskCount = taskStore.getTaskCountByCategory()(emptyCategoryId);

      // Then
      expect(taskCount).toBe(0);
      // This means category with emptyCategoryId can be safely deleted
    });

    it('Given una categoría con tareas (2 tareas en Personal), When se verifica el contador, Then muestra cuántas tareas se verían afectadas', () => {
      // Given (c1 = Personal has 2 tasks)

      // When
      const affectedTaskCount = taskStore.getTaskCountByCategory()('c1');

      // Then
      expect(affectedTaskCount).toBe(2);
      // La UI muestra este número antes de confirmar la eliminación,
      // advirtiendo que 2 tareas perderán su categoría
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Filtrar tareas por categoría específica
  // -----------------------------------------------------------------------
  describe('Scenario: Filtrar tareas por categoría específica', () => {
    it('Given tareas cargadas de múltiples categorías, When se filtran por una categoría, Then solo se muestran las tareas de esa categoría', () => {
      // Given (data loaded)

      // When
      taskStore.setCategoryFilter('c1');

      // Then
      const filtered = taskStore.filteredTasks();
      expect(filtered.length).toBe(2);
      expect(filtered.every((t) => t.categoryId === 'c1')).toBe(true);
      expect(filtered[0].title).toBe('Comprar viveres');
      expect(filtered[1].title).toBe('Hacer ejercicio');
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Tareas sin categoría asignada
  // -----------------------------------------------------------------------
  describe('Scenario: Tareas sin categoría asignada', () => {
    it('Given tareas con y sin categoría, When se consultan tareas no categorizadas, Then retorna solo las que tienen categoryId = null', () => {
      // Given (data loaded)

      // When
      const uncategorized = taskStore.uncategorizedTasks();

      // Then
      expect(uncategorized.length).toBe(1);
      expect(uncategorized[0].id).toBe('t4');
      expect(uncategorized[0].title).toBe('Sin categoría');
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Cargar tareas de una categoría específica desde el repositorio
  // -----------------------------------------------------------------------
  describe('Scenario: Cargar tareas de una categoría específica', () => {
    it('Given el store inicializado, When se cargan tareas por categoría, Then se actualiza el signal con el filtro activo', () => {
      // Given
      const freshTaskStore = createTaskStoreWithMocks({
        getAllTasks: { execute: () => of([mockTaskOutput, mockTaskOutput2]) },
      });

      // When
      freshTaskStore.loadTasksByCategory('c1');

      // Then
      expect(freshTaskStore.selectedCategoryId()).toBe('c1');
      expect(freshTaskStore.tasks().length).toBe(2);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Integración de estadísticas entre stores
  // -----------------------------------------------------------------------
  describe('Scenario: Estadísticas combinadas de tareas y categorías', () => {
    it('Given ambos stores cargados, When se consultan estadísticas de tareas, Then los totales reflejan la distribución por categoría', () => {
      // Given
      const taskStats = taskStore.taskStats();
      const categories = categoryStore.categories();

      // When - calcular distribución por categoría
      const distribution = categories.map((cat) => ({
        category: cat.name,
        taskCount: taskStore.getTaskCountByCategory()(cat.id),
      }));

      // Then
      expect(taskStats.total).toBe(4);
      expect(distribution).toEqual([
        { category: 'Personal', taskCount: 2 },
        { category: 'Trabajo', taskCount: 1 },
      ]);
    });
  });
});
