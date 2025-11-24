Feature: The One Where the User Saves Their Favorites
  Como usuario autenticado
  Quiero agregar y quitar platillos y restaurantes a mis favoritos
  Para consultarlos rápido y mostrar afinidad con otros usuarios

  Scenario: The One Where the User Adds a Favorite Successfully
    Given que el usuario ha iniciado sesión
    And el platillo está activo en el sistema
    And el platillo no está en la lista de favoritos del usuario
    When el usuario da clic en "Agregar a favoritos"
    Then el sistema agrega el platillo a la lista de favoritos
    And se muestra el mensaje "Agregado a favoritos"
    And el nuevo favorito aparece en la sección "Mis Favoritos"

  Scenario: The One Where the User Removes a Favorite
    Given que el usuario ha iniciado sesión
    And el platillo ya está en los favoritos del usuario
    When el usuario selecciona "Quitar de favoritos"
    Then el sistema elimina el platillo de su lista de favoritos
    And ya no aparece en "Mis Favoritos"

  Scenario: The One Where the Item Is Inactive
    Given que el usuario ha iniciado sesión
    And el platillo está marcado como inactivo
    When el usuario intenta agregarlo como favorito
    Then el sistema muestra el mensaje "Elemento no disponible"
    And no agrega el favorito

  Scenario: The One Where the Favorite Already Exists
    Given que el usuario ha iniciado sesión
    And el platillo ya está en los favoritos del usuario
    When el usuario intenta agregarlo nuevamente
    Then el sistema no duplica el registro
    And se muestra el mensaje "Este platillo ya está en tus favoritos"
