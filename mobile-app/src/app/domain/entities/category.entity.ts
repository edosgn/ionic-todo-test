/**
 * Category Entity - Representa una categoría de tareas en el dominio de la aplicación
 * 
 * Esta entidad contiene la lógica de negocio para las categorías
 * siguiendo los principios de Domain Driven Design (DDD)
 */
export class Category {
  constructor(
    public readonly id: string,
    public name: string,
    public color: string,
    public icon: string,
    public readonly createdAt: Date,
    public updatedAt: Date
  ) {}

  /**
   * Actualiza el nombre de la categoría
   * @param name Nuevo nombre de la categoría
   */
  updateName(name: string): void {
    this.name = name;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza el color de la categoría
   * @param color Nuevo color en formato hex (#ffffff) o nombre de color de Ionic
   */
  updateColor(color: string): void {
    this.color = color;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza el icono de la categoría
   * @param icon Nuevo nombre del icono de Ionicons
   */
  updateIcon(icon: string): void {
    this.icon = icon;
    this.updatedAt = new Date();
  }

  /**
   * Actualiza la información completa de la categoría
   * @param name Nuevo nombre
   * @param color Nuevo color
   * @param icon Nuevo icono
   */
  update(name: string, color: string, icon: string): void {
    this.name = name;
    this.color = color;
    this.icon = icon;
    this.updatedAt = new Date();
  }

  /**
   * Valida que el color sea un color hex válido
   * @param color Color a validar
   * @returns true si el color es válido
   */
  static isValidHexColor(color: string): boolean {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  }

  /**
   * Lista de colores predefinidos de Ionic
   * @returns Array de colores disponibles
   */
  static getIonicColors(): string[] {
    return [
      'primary',
      'secondary',
      'tertiary',
      'success',
      'warning',
      'danger',
      'light',
      'medium',
      'dark'
    ];
  }

  /**
   * Lista de iconos comunes para categorías
   * @returns Array de nombres de iconos de Ionicons
   */
  static getCommonIcons(): string[] {
    return [
      'home',
      'briefcase',
      'school',
      'fitness',
      'restaurant',
      'car',
      'medical',
      'library',
      'gift',
      'heart',
      'star',
      'bookmark',
      'calendar',
      'checkmark-circle',
      'flag',
      'folder',
      'person',
      'settings',
      'time',
      'trophy'
    ];
  }

  /**
   * Crea una instancia de Category con valores por defecto
   * @param id ID único de la categoría
   * @param name Nombre de la categoría
   * @param color Color de la categoría (opcional, por defecto 'primary')
   * @param icon Icono de la categoría (opcional, por defecto 'folder')
   * @returns Nueva instancia de Category
   */
  static create(
    id: string,
    name: string,
    color = 'primary',
    icon = 'folder'
  ): Category {
    const now = new Date();
    return new Category(
      id,
      name,
      color,
      icon,
      now, // createdAt
      now  // updatedAt
    );
  }

  /**
   * Convierte la entidad a un objeto plano para serialización
   * @returns Objeto plano con las propiedades de la categoría
   */
  toJSON(): {
    id: string;
    name: string;
    color: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
  } {
    return {
      id: this.id,
      name: this.name,
      color: this.color,
      icon: this.icon,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString()
    };
  }

  /**
   * Crea una instancia de Category desde un objeto plano
   * @param data Objeto con los datos de la categoría
   * @returns Nueva instancia de Category
   */
  static fromJSON(data: {
    id: string;
    name: string;
    color: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
  }): Category {
    return new Category(
      data.id,
      data.name,
      data.color,
      data.icon,
      new Date(data.createdAt),
      new Date(data.updatedAt)
    );
  }
}