/**
 * Task Entity - Representa una tarea en el dominio de la aplicación
 * 
 * Esta entidad contiene la lógica de negocio para las tareas
 * siguiendo los principios de Domain Driven Design (DDD)
 */
export class Task {
  constructor(
    public readonly id: string,
    public title: string,
    public description: string,
    public completed: boolean,
    public categoryId: string | null,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Marca la tarea como completada
   */
  complete(): void {
    this.completed = true;
    this.updatedAt = new Date();
  }

  /**
   * Marca la tarea como no completada
   */
  uncomplete(): void {
    this.completed = false;
    this.updatedAt = new Date();
  }

  /**
   * Asigna una categoría a la tarea
   * @param categoryId ID de la categoría a asignar
   */
  assignCategory(categoryId: string): void {
    this.categoryId = categoryId;
    this.updatedAt = new Date();
  }

  /**
   * Remueve la categoría de la tarea
   */
  removeCategory(): void {
    this.categoryId = null;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza el título y descripción de la tarea
   * @param title Nuevo título
   * @param description Nueva descripción
   */
  update(title: string, description: string): void {
    this.title = title;
    this.description = description;
    this.updatedAt = new Date();
  }

  /**
   * Verifica si la tarea pertenece a una categoría específica
   * @param categoryId ID de la categoría a verificar
   * @returns true si la tarea pertenece a la categoría
   */
  belongsToCategory(categoryId: string): boolean {
    return this.categoryId === categoryId;
  }

  /**
   * Verifica si la tarea está sin categorizar
   * @returns true si la tarea no tiene categoría asignada
   */
  isUncategorized(): boolean {
    return this.categoryId === null;
  }

  /**
   * Crea una instancia de Task con valores por defecto
   * @param id ID único de la tarea
   * @param title Título de la tarea
   * @param description Descripción de la tarea
   * @param categoryId ID de la categoría (opcional)
   * @returns Nueva instancia de Task
   */
  static create(
    id: string,
    title: string,
    description = '',
    categoryId?: string
  ): Task {
    const now = new Date();
    return new Task(
      id,
      title,
      description,
      false, // completed = false por defecto
      categoryId || null,
      now, // createdAt
      now  // updatedAt
    );
  }

  /**
   * Convierte la entidad a un objeto plano para serialización
   * @returns Objeto plano con las propiedades de la tarea
   */
  toJSON(): {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      completed: this.completed,
      categoryId: this.categoryId,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Crea una instancia de Task desde un objeto plano
   * @param data Objeto con los datos de la tarea
   * @returns Nueva instancia de Task
   */
  static fromJSON(data: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    categoryId: string | null;
    createdAt: string;
    updatedAt: string;
  }): Task {
    return new Task(
      data.id,
      data.title,
      data.description,
      data.completed,
      data.categoryId,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}