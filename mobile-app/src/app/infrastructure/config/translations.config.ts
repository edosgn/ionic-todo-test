/**
 * Translations Configuration
 * 
 * Centralized configuration for all application text labels and messages.
 * Uses Object.freeze() for immutability and follows i18n best practices.
 * 
 * @author Edgar Guerrero
 * @since 1.0.0
 */

/**
 * Application Text Labels
 * 
 * Contains all user-facing text organized by feature/component.
 * Each section is frozen to prevent runtime modifications.
 */
export const TRANSLATIONS = Object.freeze({
  
  // Common terms used across the application
  COMMON: Object.freeze({
    LOADING: 'Cargando...',
    ERROR: 'Error',
    RETRY: 'Reintentar',
    CANCEL: 'Cancelar',
    SAVE: 'Guardar',
    DELETE: 'Eliminar',
    EDIT: 'Editar',
    CREATE: 'Crear',
    UPDATE: 'Actualizar',
    ADD: 'Agregar',
    SEARCH: 'Buscar',
    CLOSE: 'Cerrar',
    BACK: 'Atrás',
    CONTINUE: 'Continuar',
    CONFIRM: 'Confirmar',
    OK: 'OK'
  } as const),

  // Navigation and page titles
  NAVIGATION: Object.freeze({
    TASKS: 'Tareas',
    CATEGORIES: 'Categorías',
    SETTINGS: 'Configuración',
    HOME: 'Inicio'
  } as const),

  // Task-related translations
  TASKS: Object.freeze({
    TITLE: 'Tareas',
    NEW_TASK: 'Nueva Tarea',
    EDIT_TASK: 'Editar Tarea',
    ALL_TASKS: 'Todas las Tareas',
    PENDING: 'Pendientes',
    COMPLETED: 'Completadas',
    TOTAL_TASKS: 'Total Tareas',
    COMPLETED_TASKS: 'Completadas',
    PENDING_TASKS: 'Pendientes',
    PROGRESS: 'Progreso',
    
    // Search and filters
    SEARCH_PLACEHOLDER: 'Buscar tareas...',
    NO_TASKS_FOUND: 'No hay tareas que coincidan con tus filtros',
    NO_TASKS_YET: 'Aún no hay tareas',
    NO_TASKS: 'Aún no hay tareas',
    NO_FILTERED_TASKS: 'No hay tareas que coincidan con tus filtros',
    NO_FILTERED_TASKS_DESCRIPTION: 'Prueba ajustando tu búsqueda o criterios de filtro',
    NO_TASKS_DESCRIPTION: '¡Crea tu primera tarea para empezar!',
    
    // Empty states
    EMPTY_STATE_MESSAGE: '¡Crea tu primera tarea para empezar!',
    EMPTY_FILTERED_MESSAGE: 'Prueba ajustando tu búsqueda o criterios de filtro',
    
    // Task limits
    TASK_LIMIT_REACHED: 'Límite de Tareas Alcanzado',
    TASK_LIMIT_MESSAGE: 'Has alcanzado el límite máximo de {0} tareas. Por favor, elimina algunas tareas antes de crear nuevas.',
    
    // Form fields
    TITLE_LABEL: 'Título',
    TITLE_PLACEHOLDER: 'Ingresa el título de la tarea',
    DESCRIPTION_LABEL: 'Descripción',
    DESCRIPTION_PLACEHOLDER: 'Ingresa la descripción de la tarea (opcional)',
    DESCRIPTION_HELPER: 'Opcional - Agrega más detalles sobre esta tarea',
    
    // Actions
    ADD_TASK: 'Agregar Tarea',
    CREATE_TASK: 'Crear Tarea',
    UPDATE_TASK: 'Actualizar Tarea',
    DELETE_TASK: 'Eliminar Tarea',
    COMPLETE_TASK: 'Completar Tarea',
    MARK_PENDING: 'Marcar como Pendiente',
    
    // Validation messages
    TITLE_REQUIRED: 'El título es requerido y debe tener al menos 2 caracteres',
    TITLE_MAX_LENGTH: 'El título no puede exceder los 100 caracteres',
    DESCRIPTION_MAX_LENGTH: 'La descripción no puede exceder los 500 caracteres',
    
    // Loading states
    LOADING_TASKS: 'Cargando tareas...',
    CREATING_TASK: 'Creando tarea...',
    UPDATING_TASK: 'Actualizando tarea...',
    DELETING_TASK: 'Eliminando tarea...',
    
    // Error messages
    LOAD_ERROR: 'Error al cargar las tareas',
    CREATE_ERROR: 'Error al crear la tarea',
    UPDATE_ERROR: 'Error al actualizar la tarea',
    DELETE_ERROR: 'Error al eliminar la tarea',
    SAVE_ERROR: 'Error al guardar la tarea',
    MAX_LIMIT_ERROR: 'No se puede crear la tarea. Se ha alcanzado el límite máximo de {0} tareas.',
    
    // Success messages
    CREATED_SUCCESS: 'Tarea creada exitosamente',
    UPDATED_SUCCESS: 'Tarea actualizada exitosamente',
    DELETED_SUCCESS: 'Tarea eliminada exitosamente',
    COMPLETED_SUCCESS: 'Tarea marcada como completada',
    PENDING_SUCCESS: 'Tarea marcada como pendiente'
  } as const),

  // Category-related translations
  CATEGORIES: Object.freeze({
    TITLE: 'Categorías',
    NEW_CATEGORY: 'Nueva Categoría',
    EDIT_CATEGORY: 'Editar Categoría',
    CATEGORY_SELECTION: 'Selección de Categoría',
    NO_CATEGORY: 'Sin Categoría',
    CREATE: 'Crear Categoría',
    NO_CATEGORIES: 'Aún No Hay Categorías',
    NO_CATEGORIES_DESCRIPTION: '¡Crea tu primera categoría para organizar mejor tus tareas!',
    
    // Statistics
    STATISTICS_TITLE: 'Estadísticas de Categorías',
    TOTAL_CATEGORIES: 'Total Categorías',
    WITH_TASKS: 'Con Tareas',
    UNASSIGNED_TASKS: 'Tareas Sin Asignar',
    
    // Search and filters
    SEARCH_PLACEHOLDER: 'Buscar categorías...',
    NO_CATEGORIES_FOUND: 'No se encontraron categorías que coincidan',
    NO_CATEGORIES_YET: 'Aún No Hay Categorías',
    
    // Empty states
    EMPTY_STATE_MESSAGE: '¡Crea tu primera categoría para organizar mejor tus tareas!',
    EMPTY_SELECTION_MESSAGE: 'Tareas sin categoría',
    EMPTY_AVAILABLE_MESSAGE: 'No hay categorías disponibles',
    EMPTY_AVAILABLE_HELPER: 'Crea categorías primero para organizar tus tareas',
    
    // Form fields
    NAME_LABEL: 'Nombre',
    NAME_PLACEHOLDER: 'Ingresa el nombre de la categoría',
    COLOR_LABEL: 'Color',
    ICON_LABEL: 'Icono',
    DESCRIPTION_LABEL: 'Descripción',
    DESCRIPTION_PLACEHOLDER: 'Descripción de la categoría (opcional)',
    
    // Actions
    ADD_CATEGORY: 'Agregar Categoría',
    CREATE_CATEGORY: 'Crear Categoría',
    UPDATE_CATEGORY: 'Actualizar Categoría',
    DELETE_CATEGORY: 'Eliminar Categoría',
    SELECT_CATEGORY: 'Seleccionar Categoría',
    
    // Validation messages
    NAME_REQUIRED: 'El nombre de la categoría es requerido',
    NAME_MIN_LENGTH: 'El nombre debe tener al menos 2 caracteres',
    NAME_MAX_LENGTH: 'El nombre no puede exceder los 50 caracteres',
    COLOR_REQUIRED: 'Selecciona un color para la categoría',
    ICON_REQUIRED: 'Selecciona un icono para la categoría',
    
    // Loading states
    LOADING_CATEGORIES: 'Cargando categorías...',
    CREATING_CATEGORY: 'Creando categoría...',
    UPDATING_CATEGORY: 'Actualizando categoría...',
    DELETING_CATEGORY: 'Eliminando categoría...',
    
    // Error messages
    LOAD_ERROR: 'Error al cargar las categorías',
    CREATE_ERROR: 'Error al crear la categoría',
    UPDATE_ERROR: 'Error al actualizar la categoría',
    DELETE_ERROR: 'Error al eliminar la categoría',
    DELETE_WITH_TASKS_ERROR: 'No se puede eliminar una categoría que tiene tareas asignadas',
    CANNOT_DELETE_HAS_TASKS: 'No se puede eliminar la categoría porque tiene tareas asignadas',
    
    // Success messages
    CREATED_SUCCESS: 'Categoría creada exitosamente',
    UPDATED_SUCCESS: 'Categoría actualizada exitosamente',
    DELETED_SUCCESS: 'Categoría eliminada exitosamente',
    DELETE_CONFIRMATION: 'Esta acción eliminará permanentemente la categoría',
    
    // Date labels
    CREATED_DATE: 'Creado',
    UPDATED_DATE: 'Actualizado'
  } as const),

  // Form-related translations
  FORMS: Object.freeze({
    // Labels
    TITLE: 'Título',
    DESCRIPTION: 'Descripción',
    CATEGORY_SELECTION: 'Selección de Categoría',
    NEW_TASK: 'Nueva Tarea',
    EDIT_TASK: 'Editar Tarea',
    CREATE_TASK: 'Crear Tarea',
    UPDATE_TASK: 'Actualizar Tarea',
    
    // Placeholders
    TITLE_PLACEHOLDER: 'Ingresa el título de la tarea',
    DESCRIPTION_PLACEHOLDER: 'Ingresa la descripción de la tarea (opcional)',
    DESCRIPTION_HELPER: 'Opcional - Agrega más detalles sobre esta tarea',
    TITLE_ERROR: 'El título es requerido y debe tener al menos 2 caracteres',
    
    // Validation
    REQUIRED_FIELD: 'Campo requerido',
    INVALID_FORMAT: 'Formato inválido',
    MIN_LENGTH: 'Mínimo {0} caracteres',
    MAX_LENGTH: 'Máximo {0} caracteres',
    CHARACTER_COUNT: '{0} de {1} caracteres',
    OPTIONAL: 'Opcional',
    REQUIRED: 'Requerido'
  } as const),

  // Date and time formats
  DATES: Object.freeze({
    TODAY: 'Hoy',
    YESTERDAY: 'Ayer',
    TOMORROW: 'Mañana',
    JUST_NOW: 'Ahora mismo',
    MINUTES_AGO: 'Hace {0} minutos',
    HOURS_AGO: 'Hace {0} horas',
    DAYS_AGO: 'Hace {0} días',
    WEEKS_AGO: 'Hace {0} semanas',
    MONTHS_AGO: 'Hace {0} meses',
    YEARS_AGO: 'Hace {0} años',
    CREATED: 'Creado'
  } as const),

  // Theme and settings
  THEME: Object.freeze({
    LIGHT_MODE: 'Modo Claro',
    DARK_MODE: 'Modo Oscuro',
    AUTO_MODE: 'Automático',
    TOGGLE_THEME: 'Cambiar Tema',
    APPEARANCE: 'Apariencia'
  } as const),

  // Accessibility labels
  ACCESSIBILITY: Object.freeze({
    CLOSE_BUTTON: 'Cerrar',
    BACK_BUTTON: 'Regresar',
    MENU_BUTTON: 'Menú',
    SEARCH_BUTTON: 'Buscar',
    ADD_BUTTON: 'Agregar',
    EDIT_BUTTON: 'Editar',
    DELETE_BUTTON: 'Eliminar',
    COMPLETE_TASK: 'Marcar tarea como {0}',
    FILTER_BY: 'Filtrar por {0}',
    SORT_BY: 'Ordenar por {0}'
  } as const),

  // Confirmation dialogs
  DIALOGS: Object.freeze({
    DELETE_TASK: 'Eliminar Tarea',
    DELETE_TASK_CONFIRM: '¿Estás seguro de que quieres eliminar "{0}"? Esta acción no se puede deshacer.',
    DELETE_CATEGORY: 'Eliminar Categoría',
    DELETE_CATEGORY_CONFIRM: '¿Estás seguro de que quieres eliminar "{0}"? Esta acción no se puede deshacer.',
    DELETE_TASK_TITLE: 'Eliminar Tarea',
    DELETE_TASK_MESSAGE: '¿Estás seguro de que quieres eliminar esta tarea?',
    DELETE_CATEGORY_TITLE: 'Eliminar Categoría',
    DELETE_CATEGORY_MESSAGE: '¿Estás seguro de que quieres eliminar esta categoría?',
    UNSAVED_CHANGES_TITLE: 'Cambios Sin Guardar',
    UNSAVED_CHANGES_MESSAGE: 'Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?',
    CONFIRM_DELETE: 'Sí, Eliminar',
    CONFIRM_DISCARD: 'Sí, Descartar',
    KEEP_EDITING: 'Seguir Editando'
  } as const),

  // Network and connectivity
  NETWORK: Object.freeze({
    OFFLINE: 'Sin Conexión',
    ONLINE: 'Conectado',
    SYNC_ERROR: 'Error de Sincronización',
    RETRY_SYNC: 'Reintentar Sincronización',
    CHANGES_SAVED_LOCALLY: 'Cambios guardados localmente',
    WILL_SYNC_WHEN_ONLINE: 'Se sincronizará cuando haya conexión'
  } as const)

} as const);

/**
 * Translation utilities
 * 
 * Helper functions for working with translations
 */
export const TranslationUtils = Object.freeze({
  
  /**
   * Replace placeholders in translation strings
   * Example: replacePlaceholders('Hello {0}!', ['World']) => 'Hello World!'
   */
  replacePlaceholders: (text: string, replacements: (string | number)[]): string => {
    return text.replace(/{(\d+)}/g, (match, index) => {
      const replacement = replacements[parseInt(index, 10)];
      return replacement !== undefined ? String(replacement) : match;
    });
  },

  /**
   * Get nested translation value safely
   * Example: getTranslation('TASKS.TITLE') => 'Tareas'
   */
  getTranslation: (key: string): string => {
    const keys = key.split('.');
    let current: any = TRANSLATIONS;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key; // Return the key as fallback
      }
    }
    
    return typeof current === 'string' ? current : key;
  }

} as const);

// Type definitions for better TypeScript support
export type TranslationKey = keyof typeof TRANSLATIONS;
export type CommonTranslationKey = keyof typeof TRANSLATIONS.COMMON;
export type TaskTranslationKey = keyof typeof TRANSLATIONS.TASKS;
export type CategoryTranslationKey = keyof typeof TRANSLATIONS.CATEGORIES;