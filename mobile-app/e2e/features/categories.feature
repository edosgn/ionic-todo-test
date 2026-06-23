Feature: Gestion de Categorias
  Como usuario de la aplicacion de tareas
  Quiero gestionar categorias
  Para organizar mis tareas por tema

  Background:
    Given que el usuario esta autenticado y en la pagina de "categories"

  Scenario: Crear una categoria exitosamente
    When el usuario abre el formulario de creacion de categoria
    And completa el formulario de categoria con:
      | nombre   | color   | icono     |
      | Trabajo  | #FF6B6B | briefcase |
    And guarda la categoria
    Then la categoria "Trabajo" aparece en la lista

  Scenario: Eliminar una categoria sin tareas
    Given que existe una categoria llamada "Personal"
    When el usuario intenta eliminar la categoria "Personal"
    And confirma la eliminacion
    Then la categoria "Personal" ya no aparece en la lista

  Scenario: No permitir eliminar categoria con tareas asociadas
    Given que existe una categoria llamada "Trabajo"
    And que la categoria "Trabajo" tiene 3 tareas asignadas
    When el usuario intenta eliminar la categoria "Trabajo"
    Then el usuario ve un mensaje de error con el texto "No se puede eliminar la categoría porque tiene tareas asignadas"
    And la categoria "Trabajo" permanece en la lista

  Scenario: Editar una categoria existente
    Given que existe una categoria llamada "Personal"
    When el usuario abre el formulario de edicion de la categoria "Personal"
    And completa el formulario de categoria con:
      | nombre    | color   | icono |
      | Personal+ | #4ECDC4 | star  |
    And guarda la categoria
    Then la categoria "Personal+" aparece en la lista
