/**
 * CategoryId Value Object - Representa el identificador único de una categoría
 * 
 * Value Object que encapsula la lógica de validación y generación
 * de identificadores para las categorías siguiendo principios de DDD
 */
export class CategoryId {
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
   * Compara si dos CategoryId son iguales
   * @param other Otro CategoryId a comparar
   * @returns true si son iguales
   */
  equals(other: CategoryId): boolean {
    return this.value === other.value;
  }

  /**
   * Convierte el CategoryId a string
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
      throw new Error('CategoryId cannot be empty');
    }

    if (value.length > 100) {
      throw new Error('CategoryId cannot be longer than 100 characters');
    }

    // Validar que solo contenga caracteres alfanuméricos, guiones y underscores
    const validIdRegex = /^[a-zA-Z0-9_-]+$/;
    if (!validIdRegex.test(value)) {
      throw new Error('CategoryId can only contain alphanumeric characters, hyphens and underscores');
    }
  }

  /**
   * Crea un nuevo CategoryId desde un string
   * @param value Valor del ID
   * @returns Nueva instancia de CategoryId
   */
  static create(value: string): CategoryId {
    return new CategoryId(value);
  }

  /**
   * Genera un nuevo CategoryId único usando timestamp y caracteres aleatorios
   * @returns Nueva instancia de CategoryId con valor generado
   */
  static generate(): CategoryId {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 9);
    const id = `category_${timestamp}_${random}`;
    return new CategoryId(id);
  }

  /**
   * Crea un CategoryId desde un UUID estándar
   * @returns Nueva instancia de CategoryId con formato UUID
   */
  static generateUUID(): CategoryId {
    const uuid = crypto.randomUUID();
    return new CategoryId(`category_${uuid}`);
  }

  /**
   * Genera IDs predefinidos para categorías comunes
   * @returns Object con CategoryIds para categorías predefinidas
   */
  static getCommonCategoryIds(): {
    personal: CategoryId;
    work: CategoryId;
    shopping: CategoryId;
    health: CategoryId;
    learning: CategoryId;
  } {
    return {
      personal: new CategoryId('category_personal'),
      work: new CategoryId('category_work'),
      shopping: new CategoryId('category_shopping'),
      health: new CategoryId('category_health'),
      learning: new CategoryId('category_learning')
    };
  }

  /**
   * Verifica si un string es un CategoryId válido sin crear la instancia
   * @param value Valor a validar
   * @returns true si el valor es válido para crear un CategoryId
   */
  static isValid(value: string): boolean {
    try {
      new CategoryId(value);
      return true;
    } catch {
      return false;
    }
  }
}