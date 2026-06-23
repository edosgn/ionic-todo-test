Feature: Gestion de Tareas
  Como usuario de la aplicacion de tareas
  Quiero gestionar mis tareas
  Para mantener un registro de mis pendientes

  Background:
    Given que el usuario esta autenticado y en la pagina de "tasks"

  Scenario: Crear una tarea exitosamente
    When el usuario abre el formulario de nueva tarea
    And completa el formulario de tarea con:
      | titulo          | descripcion            | categoria |
      | Comprar viveres | Leche, pan y huevos    | Personal  |
    And guarda la tarea
    Then la tarea "Comprar viveres" aparece en la lista

  Scenario: Completar una tarea
    Given que existe una tarea llamada "Comprar viveres"
    When el usuario marca la tarea "Comprar viveres" como completada
    Then la tarea "Comprar viveres" aparece como completada

  Scenario: Eliminar una tarea
    Given que existe una tarea llamada "Comprar viveres"
    When el usuario elimina la tarea "Comprar viveres"
    Then la tarea "Comprar viveres" ya no aparece en la lista

  Scenario: Filtrar tareas por busqueda
    Given que existen tareas llamadas "Comprar viveres" y "Hacer ejercicio"
    When el usuario escribe "ejercicio" en el buscador
    Then la tarea "Hacer ejercicio" aparece en la lista
    And la tarea "Comprar viveres" no es visible
