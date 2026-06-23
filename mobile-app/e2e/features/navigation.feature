Feature: Navegacion entre pantallas
  Como usuario de la aplicacion de tareas
  Quiero navegar entre las diferentes pantallas
  Para acceder a las funcionalidades de la aplicacion

  Background:
    Given que el usuario esta autenticado y en la pagina de "tasks"

  Scenario: Navegar a la pagina de categorias desde la pagina de tareas
    When el usuario hace clic en el boton "Categorias"
    Then el usuario ve el texto "Categorías"

  Scenario: Navegar de vuelta a la pagina de tareas
    Given que el usuario esta autenticado y en la pagina de "categories"
    When el usuario hace clic en el boton "Volver"
    Then el usuario ve el texto "Mis Tareas"

  Scenario: Navegar a creacion de nueva tarea
    When el usuario hace clic en el boton "Agregar tarea"
    Then el usuario ve el texto "Nueva Tarea"
