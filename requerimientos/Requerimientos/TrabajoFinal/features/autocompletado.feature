Feature: The One Where the Search Completes Itself
  Como usuario
  Quiero ver sugerencias mientras escribo
  Para encontrar más rápido lo que busco

  Scenario: The One With the Prefix Matches
    Given que el usuario escribe "ta"
    When el sistema consulta coincidencias
    Then se muestran sugerencias como "tacos" y "tamales"

  Scenario: The One With the Substring Matches
    Given que el usuario escribe "ve"
    When el sistema busca coincidencias
    Then se muestran sugerencias como "Ensalada verde" y "Vegetariano"

  Scenario: The One With No Suggestions
    Given que el usuario escribe un texto sin coincidencias
    When el sistema consulta coincidencias
    Then se muestra el mensaje "Sin sugerencias"

  Scenario: The One Where There Is No Connection
    Given que no hay conexión al servidor de búsqueda
    When el usuario intenta obtener sugerencias
    Then se muestra el mensaje "No se pueden mostrar sugerencias"

  Scenario: The One Where the User Selects a Suggestion
    Given que hay sugerencias disponibles
    When el usuario selecciona la sugerencia "Tacos al pastor"
    Then el sistema abre la página del platillo
