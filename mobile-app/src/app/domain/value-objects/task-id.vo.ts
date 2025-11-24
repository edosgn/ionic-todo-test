/**
 * TaskId Value Object - Representa el identificador único de una tarea
 * 
 * Value Object que encapsula la lógica de validación y generación
 * de identificadores para las tareas siguiendo principios de DDD
 */
export class TaskId {
  private constructor(private readonly value: string) {
    this.validate(value);
  }

  /**
   * Obtiene el valor del ID
   * @returns String con el valor del ID
   */
  getValue(): string {
    return this.value;
  }

  /**
   * Compara si dos TaskId son iguales
   * @param other Otro TaskId a comparar
   * @returns true si son iguales
   */
  equals(other: TaskId): boolean {
    return this.value === other.value;
  }

  /**
   * Convierte el TaskId a string
   * @returns String con el valor del ID
   */
  toString(): string {
    return this.value;
  }

  /**
   * Valida que el ID tenga un formato válido
   * @param value Valor del ID a validar
   * @throws Error si el ID no es válido
   */
  private validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('TaskId cannot be empty');
    }

    if (value.length > 100) {
      throw new Error('TaskId cannot be longer than 100 characters');
    }

    // Validar que solo contenga caracteres alfanuméricos, guiones y underscores
    const validIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validIdRegex.test(value)) {
      throw new Error('TaskId can only contain alphanumeric characters, hyphens and underscores');
    }
  }

  /**
   * Crea un nuevo TaskId desde un string
   * @param value Valor del ID
   * @returns Nueva instancia de TaskId
   */
  static create(value: string): TaskId {
    return new TaskId(value);
  }

  /**
   * Genera un nuevo TaskId único usando timestamp y caracteres aleatorios
   * @returns Nueva instancia de TaskId con valor generado
   */
  static generate(): TaskId {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 9);
    const id = `task_${timestamp}_${random}`;
    return new TaskId(id);
  }

  /**
   * Crea un TaskId desde un UUID estándar
   * @returns Nueva instancia de TaskId con formato UUID
   */
  static generateUUID(): TaskId {
    const uuid = crypto.randomUUID();
    return new TaskId(`task_${uuid}`);
  }

  /**
   * Verifica si un string es un TaskId válido sin crear la instancia
   * @param value Valor a validar
   * @returns true si el valor es válido para crear un TaskId
   */
  static isValid(value: string): boolean {
    try {
      new TaskId(value);
      return true;
    } catch {
      return false;
    }
  }
}