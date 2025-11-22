import { of } from 'rxjs';
import { CategoryStore } from './category.store';
import { Category } from '../../domain/entities/category.entity';

const now = new Date();
const mockCategoryOutput = {
  id: 'c1',
  name: 'Personal',
  color: 'primary',
  icon: 'apps-outline',
  createdAt: now.toISOString(),
  updatedAt: now.toISOString()
};

const mockMapper = {
  toDomainArray: (outs: any[]) => outs.map(o => Category.fromJSON(o)),
  toDomain: (o: any) => Category.fromJSON(o)
};

const makeStore = () => {
  const getAllCategoriesUseCase = { execute: () => of([mockCategoryOutput]) };
  const createCategoryUseCase = { execute: (_: any) => of(mockCategoryOutput) };
  const updateCategoryUseCase = { execute: (_: any) => of(mockCategoryOutput) };
  const deleteCategoryUseCase = { execute: (_: any) => of({ affectedTasksCount: 0 }) };
  const getCategoryStatsUseCase = { execute: () => of({ totalCategories: 1 }) };

  return new CategoryStore(
    getAllCategoriesUseCase as any,
    createCategoryUseCase as any,
    updateCategoryUseCase as any,
    deleteCategoryUseCase as any,
    getCategoryStatsUseCase as any,
    mockMapper as any
  );
};

describe('CategoryStore', () => {
  it('loads categories and exposes sortedCategories', () => {
    const store = makeStore();
    expect(store.categories().length).toBe(0);
    store.loadCategories();
    expect(store.categories().length).toBe(1);
    expect(store.sortedCategories()[0].name).toBe('Personal');
  });

  it('getCategoryById returns correct category', () => {
    const store = makeStore();
    store.loadCategories();
    const cat = store.getCategoryById('c1');
    expect(cat).not.toBeNull();
    expect(cat?.name).toBe('Personal');
  });
});
