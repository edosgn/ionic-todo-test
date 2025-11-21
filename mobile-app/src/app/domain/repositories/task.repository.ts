import { Observable } from 'rxjs';
import { Task } from '../entities/task.entity';

/**
 * TaskRepository - Interfaz del repositorio de tareas
 * 
 * Define los contratos para la persistencia de tareas
 * siguiendo el patrón Repository de DDD
 * Esta interfaz será implementada en la capa de infraestructura
 */
export abstract class TaskRepository {
  /**
   * Obtiene todas las tareas
   * @returns Observable con array de todas las tareas
   */
  abstract findAll(): Observable<Task[]>;

  /**
   * Busca una tarea por su ID
   * @param id ID de la tarea a buscar
   * @returns Observable con la tarea encontrada o null si no existe
   */
  abstract findById(id: string): Observable<Task | null>;

  /**
   * Busca todas las tareas de una categoría específica
   * @param categoryId ID de la categoría
   * @returns Observable con array de tareas de la categoría
   */
  abstract findByCategory(categoryId: string): Observable<Task[]>;

  /**
   * Busca todas las tareas completadas
   * @returns Observable con array de tareas completadas
   */
  abstract findCompleted(): Observable<Task[]>;

  /**
   * Busca todas las tareas pendientes (no completadas)
   * @returns Observable con array de tareas pendientes
   */
  abstract findPending(): Observable<Task[]>;

  /**
   * Busca todas las tareas sin categoría asignada
   * @returns Observable con array de tareas sin categoría
   */
  abstract findUncategorized(): Observable<Task[]>;

  /**
   * Busca tareas que contengan un texto específico en título o descripción
   * @param searchTerm Término de búsqueda
   * @returns Observable con array de tareas que coinciden con la búsqueda
   */
  abstract searchByText(searchTerm: string): Observable<Task[]>;

  /**
   * Guarda una nueva tarea
   * @param task Tarea a guardar
   * @returns Observable con la tarea guardada
   */
  abstract save(task: Task): Observable<Task>;

  /**
   * Actualiza una tarea existente
   * @param task Tarea con los datos actualizados
   * @returns Observable con la tarea actualizada
   */
  abstract update(task: Task): Observable<Task>;

  /**
   * Elimina una tarea por su ID
   * @param id ID de la tarea a eliminar
   * @returns Observable que completa cuando la tarea ha sido eliminada
   */
  abstract delete(id: string): Observable<void>;

  /**
   * Elimina todas las tareas de una categoría específica
   * @param categoryId ID de la categoría
   * @returns Observable que completa cuando las tareas han sido eliminadas
   */
  abstract deleteByCategory(categoryId: string): Observable<void>;

  /**
   * Cuenta el total de tareas
   * @returns Observable con el número total de tareas
   */
  abstract count(): Observable<number>;

  /**
   * Cuenta las tareas completadas
   * @returns Observable con el número de tareas completadas
   */
  abstract countCompleted(): Observable<number>;

  /**
   * Cuenta las tareas pendientes
   * @returns Observable con el número de tareas pendientes
   */
  abstract countPending(): Observable<number>;

  /**
   * Cuenta las tareas de una categoría específica
   * @param categoryId ID de la categoría
   * @returns Observable con el número de tareas de la categoría
   */
  abstract countByCategory(categoryId: string): Observable<number>;

  /**
   * Verifica si existe una tarea con el ID especificado
   * @param id ID de la tarea
   * @returns Observable con true si existe, false en caso contrario
   */
  abstract exists(id: string): Observable<boolean>;
}