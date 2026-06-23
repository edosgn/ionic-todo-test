/**
 * CategoryStore Integration Tests (BDD-style)
 *
 * These tests validate the integration between CategoryStore, its use cases,
 * and domain entities. Written in BDD-style with descriptive Feature/Scenario
 * naming to demonstrate Behavior-Driven Development principles.
 *
 * @author Edgar Guerrero
 * @since 1.0.0
 */

import { of, throwError } from 'rxjs';
import { CategoryStore } from '../../src/app/presentation/stores/category.store';
import { Category } from '../../src/app/domain/entities/category.entity';

// ---------------------------------------------------------------------------
// Helper: build a store with mocked use cases and a mapper
// ---------------------------------------------------------------------------
const now = new Date();
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

const mockMapper = {
  toDomainArray: (outs: any[]) => outs.map((o) => Category.fromJSON({ ...o, createdAt: o.createdAt.toISOString(), updatedAt: o.updatedAt.toISOString() })),
  toDomain: (o: any) => Category.fromJSON({ ...o, createdAt: o.createdAt.toISOString(), updatedAt: o.updatedAt.toISOString() }),
};

function createStore() {
  const getAllCategoriesUseCase = { execute: () => of([mockCategoryOutput, mockCategoryOutput2]) };
  const createCategoryUseCase = { execute: (_: any) => of(mockCategoryOutput) };
  const updateCategoryUseCase = { execute: (_: any) => of(mockCategoryOutput) };
  const deleteCategoryUseCase = { execute: (_: any) => of({ affectedTasksCount: 0 }) };
  const getCategoryStatsUseCase = { execute: () => of({ totalCategories: 2 }) };

  return new CategoryStore(
    getAllCategoriesUseCase as any,
    createCategoryUseCase as any,
    updateCategoryUseCase as any,
    deleteCategoryUseCase as any,
    getCategoryStatsUseCase as any,
    mockMapper as any,
  );
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('Feature: Gestión de categorías (CategoryStore)', () => {
  let store: CategoryStore;

  beforeEach(() => {
    store = createStore();
  });

  // -----------------------------------------------------------------------
  // Scenario: Cargar categorías desde el repositorio
  // -----------------------------------------------------------------------
  describe('Scenario: Cargar categorías desde el repositorio', () => {
    it('Given el store está vacío, When se cargan las categorías, Then se actualiza el signal con los datos del repositorio', () => {
      // Given
      expect(store.categories().length).toBe(0);
      expect(store.hasCategories()).toBe(false);

      // When
      store.loadCategories();

      // Then
      expect(store.categories().length).toBe(2);
      expect(store.hasCategories()).toBe(true);
      expect(store.categories()[0].name).toBe('Personal');
      expect(store.categories()[1].name).toBe('Trabajo');
    });

    it('Given categorías cargadas, When se ordenan alfabéticamente, Then sortedCategories devuelve la lista ordenada por nombre', () => {
      // Given
      store.loadCategories();

      // When
      const sorted = store.sortedCategories();

      // Then
      expect(sorted[0].name).toBe('Personal');
      expect(sorted[1].name).toBe('Trabajo');
      expect(sorted.length).toBe(2);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Crear una nueva categoría
  // -----------------------------------------------------------------------
  describe('Scenario: Crear una nueva categoría', () => {
    it('Given un store con categorías cargadas, When se crea una categoría, Then se agrega al signal de categorías', () => {
      // Given
      const newCategoryOutput = {
        id: 'c3',
        name: 'Salud',
        color: '#45B7D1',
        icon: 'fitness',
        createdAt: now,
        updatedAt: now,
      };
      const createUseCase = { execute: () => of(newCategoryOutput) };
      const storeWithCreate = new CategoryStore(
        { execute: () => of([mockCategoryOutput]) } as any,
        createUseCase as any,
        { execute: () => of(mockCategoryOutput) } as any,
        { execute: () => of({ affectedTasksCount: 0 }) } as any,
        { execute: () => of({ totalCategories: 2 }) } as any,
        mockMapper as any,
      );
      storeWithCreate.loadCategories();
      const initialCount = storeWithCreate.categories().length;

      // When
      storeWithCreate.createCategory({ name: 'Salud', color: '#45B7D1', icon: 'fitness' }).subscribe();

      // Then
      expect(storeWithCreate.categories().length).toBe(initialCount + 1);
      const newCat = storeWithCreate.categories().find((c) => c.name === 'Salud');
      expect(newCat).toBeDefined();
      expect(newCat!.color).toBe('#45B7D1');
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Obtener una categoría por ID
  // -----------------------------------------------------------------------
  describe('Scenario: Obtener una categoría por ID', () => {
    it('Given categorías cargadas, When se busca por ID existente, Then retorna la categoría correcta', () => {
      // Given
      store.loadCategories();

      // When
      const found = store.getCategoryById('c1');

      // Then
      expect(found).not.toBeNull();
      expect(found!.name).toBe('Personal');
    });

    it('Given categorías cargadas, When se busca por ID inexistente, Then retorna null', () => {
      // Given
      store.loadCategories();

      // When
      const found = store.getCategoryById('nonexistent');

      // Then
      expect(found).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Validar existencia de nombre duplicado
  // -----------------------------------------------------------------------
  describe('Scenario: Validar nombre duplicado', () => {
    it('Given categorías cargadas, When se verifica un nombre existente, Then retorna true', () => {
      // Given
      store.loadCategories();

      // When / Then
      expect(store.categoryNameExists('Personal')).toBe(true);
      expect(store.categoryNameExists('personal')).toBe(true); // case-insensitive
    });

    it('Given categorías cargadas, When se verifica un nombre nuevo, Then retorna false', () => {
      // Given
      store.loadCategories();

      // When / Then
      expect(store.categoryNameExists('Nueva')).toBe(false);
    });

    it('Given categorías cargadas, When se verifica un nombre excluyendo el ID propio, Then retorna false', () => {
      // Given
      store.loadCategories();

      // When / Then
      expect(store.categoryNameExists('Personal', 'c1')).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Eliminar una categoría
  // -----------------------------------------------------------------------
  describe('Scenario: Eliminar una categoría', () => {
    it('Given categorías cargadas, When se elimina una categoría, Then se remueve del signal', () => {
      // Given
      store.loadCategories();
      const initialCount = store.categories().length;

      // When
      store.deleteCategory('c1').subscribe();

      // Then
      expect(store.categories().length).toBe(initialCount - 1);
      expect(store.getCategoryById('c1')).toBeNull();
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Manejo de errores al cargar
  // -----------------------------------------------------------------------
  describe('Scenario: Manejo de errores al cargar categorías', () => {
    it('Given un repositorio que falla, When se cargan categorías, Then se propaga el error en el signal de error', () => {
      // Given
      const failingUseCase = { execute: () => throwError(() => new Error('Network error')) };
      const storeWithError = new CategoryStore(
        failingUseCase as any,
        { execute: () => of(mockCategoryOutput) } as any,
        { execute: () => of(mockCategoryOutput) } as any,
        { execute: () => of({ affectedTasksCount: 0 }) } as any,
        { execute: () => of({ totalCategories: 2 }) } as any,
        mockMapper as any,
      );

      // When
      storeWithError.loadCategories();

      // Then
      expect(storeWithError.error()).not.toBeNull();
      expect(storeWithError.error()).toContain('Network error');
      expect(storeWithError.loading()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // Scenario: Computed signals derivadas
  // -----------------------------------------------------------------------
  describe('Scenario: Computed signals derivadas', () => {
    it('Given categorías cargadas, When se consultan computed signals, Then retornan valores correctos', () => {
      // Given
      store.loadCategories();

      // When / Then
      expect(store.categoryCount()).toBe(2);
      expect(store.hasCategories()).toBe(true);
    });

    it('Given el store vacío, When no hay categorías, Then hasCategories es false y categoryCount es 0', () => {
      // Given (store vacío)
      // When / Then
      expect(store.hasCategories()).toBe(false);
      expect(store.categoryCount()).toBe(0);
    });
  });
});
