Feature: The One With the Detailed Prices
  Como usuario
  Quiero ver los precios base y los extras
  Para conocer el total antes de pedir

  Scenario: The One Where the User Sees Base Price and Extras
    Given que el platillo tiene precio base y extras disponibles
    When el usuario visualiza la sección de precios
    Then el sistema muestra el precio base
    And muestra los extras con su precio individual

  Scenario: The One Where the Total Updates Dynamically
    Given que el usuario está viendo un platillo con extras disponibles
    When selecciona un extra adicional
    Then el sistema recalcula el total
    And muestra el precio actualizado

  Scenario: The One With No Extras
    Given que el platillo no tiene extras configurados
    When el usuario visualiza el detalle del platillo
    Then el sistema muestra solo el precio base
    And muestra el mensaje "Sin extras disponibles"

  Scenario: The One Where the Database Fails
    Given que ocurre un error al obtener precios desde la base de datos
    When el usuario intenta visualizar precios
    Then el sistema muestra el mensaje "No se pudieron cargar los precios. Intenta más tarde."
