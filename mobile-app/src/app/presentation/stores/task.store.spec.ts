import { of } from 'rxjs';
import { TaskStore } from './task.store';
import { Task } from '../../domain/entities/task.entity';

// Minimal mocks for use cases and mapper
const mockTaskOutput = {
  id: 't1',
  title: 'Test task',
  description: 'desc',
  completed: false,
  categoryId: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockMapper = {
  toDomainArray: (outputs: any[]) => outputs.map(o => Task.fromJSON(o)),
  toDomain: (o: any) => Task.fromJSON(o)
};

const makeStore = () => {
  const getAllTasksUseCase = { execute: () => of([mockTaskOutput]) };
  const getTaskByIdUseCase = { execute: (_: any) => of(mockTaskOutput) };
  const createTaskUseCase = { execute: (_: any) => of(mockTaskOutput) };
  const updateTaskUseCase = { execute: (_: any) => of(mockTaskOutput) };
  const deleteTaskUseCase = { execute: (_: any) => of(void 0) };
  const completeTaskUseCase = { execute: (_: any) => of({ ...mockTaskOutput, completed: true }) };
  const getTasksByCategoryUseCase = { execute: (_: any) => of([mockTaskOutput]) };

  return new TaskStore(
    getAllTasksUseCase as any,
    getTaskByIdUseCase as any,
    createTaskUseCase as any,
    updateTaskUseCase as any,
    deleteTaskUseCase as any,
    completeTaskUseCase as any,
    getTasksByCategoryUseCase as any,
    mockMapper as any
  );
};

describe('TaskStore', () => {
  it('loads tasks and updates tasks signal', () => {
    const store = makeStore();

    expect(store.tasks()).toEqual([]);
    store.loadTasks();
    expect(store.tasks().length).toBe(1);
    expect(store.tasks()[0].id).toBe('t1');
  });

  it('filters tasks by search term', () => {
    const store = makeStore();
    store.loadTasks();

    expect(store.filteredTasks().length).toBe(1);

    store.setSearchTerm('non-existing');
    expect(store.filteredTasks().length).toBe(0);

    store.setSearchTerm('Test');
    expect(store.filteredTasks().length).toBe(1);
  });

  it('calculates stats correctly', () => {
    const store = makeStore();
    store.loadTasks();

    const stats = store.taskStats();
    expect(stats.total).toBe(1);
    expect(stats.completed).toBe(0);
    expect(stats.pending).toBe(1);
  });
});
