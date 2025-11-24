import { Observable } from 'rxjs';
import { Category } from '../entities/category.entity';

/**
 * CategoryRepository - Interfaz del repositorio de categorías
 * 
 * Define los contratos para la persistencia de categorías
 * siguiendo el patrón Repository de DDD
 * Esta interfaz será implementada en la capa de infraestructura
 */
export abstract class CategoryRepository {
  /**
   * Obtiene todas las categorías
   * @returns Observable con array de todas las categorías
   */
  abstract findAll(): Observable<Category[]>;

  /**
   * Busca una categoría por su ID
   * @param id ID de la categoría a buscar
   * @returns Observable con la categoría encontrada o null si no existe
   */
  abstract findById(id: string): Observable<Category | null>;

  /**
   * Busca una categoría por su nombre
   * @param name Nombre de la categoría
   * @returns Observable con la categoría encontrada o null si no existe
   */
  abstract findByName(name: string): Observable<Category | null>;

  /**
   * Busca categorías que contengan un texto específico en su nombre
   * @param searchTerm Término de búsqueda
   * @returns Observable con array de categorías que coinciden con la búsqueda
   */
  abstract searchByName(searchTerm: string): Observable<Category[]>;

  /**
   * Obtiene categorías ordenadas por nombre
   * @param ascending true para orden ascendente, false para descendente
   * @returns Observable con array de categorías ordenadas
   */
  abstract findAllSorted(ascending?: boolean): Observable<Category[]>;

  /**
   * Obtiene categorías ordenadas por fecha de creación
   * @param ascending true para orden ascendente, false para descendente
   * @returns Observable con array de categorías ordenadas por fecha
   */
  abstract findAllByCreationDate(ascending?: boolean): Observable<Category[]>;

  /**
   * Guarda una nueva categoría
   * @param category Categoría a guardar
   * @returns Observable con la categoría guardada
   */
  abstract save(category: Category): Observable<Category>;

  /**
   * Actualiza una categoría existente
   * @param category Categoría con los datos actualizados
   * @returns Observable con la categoría actualizada
   */
  abstract update(category: Category): Observable<Category>;

  /**
   * Elimina una categoría por su ID
   * @param id ID de la categoría a eliminar
   * @returns Observable que completa cuando la categoría ha sido eliminada
   */
  abstract delete(id: string): Observable<void>;

  /**
   * Cuenta el total de categorías
   * @returns Observable con el número total de categorías
   */
  abstract count(): Observable<number>;

  /**
   * Verifica si existe una categoría con el ID especificado
   * @param id ID de la categoría
   * @returns Observable con true si existe, false en caso contrario
   */
  abstract exists(id: string): Observable<boolean>;

  /**
   * Verifica si existe una categoría con el nombre especificado
   * @param name Nombre de la categoría
   * @returns Observable con true si existe, false en caso contrario
   */
  abstract existsByName(name: string): Observable<boolean>;

  /**
   * Verifica si existe una categoría con el nombre especificado,
   * excluyendo una categoría específica (útil para validar al editar)
   * @param name Nombre de la categoría
   * @param excludeId ID de la categoría a excluir de la búsqueda
   * @returns Observable con true si existe otra categoría con ese nombre
   */
  abstract existsByNameExcluding(name: string, excludeId: string): Observable<boolean>;

  /**
   * Obtiene las categorías más utilizadas (basado en el número de tareas asignadas)
   * @param limit Número máximo de categorías a retornar
   * @returns Observable con array de categorías más utilizadas
   */
  abstract findMostUsed(limit?: number): Observable<Category[]>;

  /**
   * Obtiene las categorías menos utilizadas o sin uso
   * @returns Observable con array de categorías sin tareas asignadas
   */
  abstract findUnused(): Observable<Category[]>;
}