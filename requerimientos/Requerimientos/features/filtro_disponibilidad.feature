Feature: Filtro de disponibilidad de platillos
  Como usuario de CampusBites
  quiero poder activar un filtro para mostrar solo los platillos disponibles
  para visualizar únicamente lo que puedo comprar en ese momento.

  Background:
    Dado que existe la aplicación CampusBites
    Y el usuario ha iniciado sesión correctamente

  Scenario: Mostrar solo platillos disponibles
    Dado que hay platillos disponibles y agotados en la base de datos
    Cuando el usuario activa el filtro "Mostrar solo disponibles"
    Entonces el sistema oculta todos los platillos agotados
    Y muestra únicamente los disponibles

  Scenario: Actualización automática al marcar disponibilidad
    Dado que una cafetería marca un platillo como disponible
    Cuando el sistema actualiza el estado de los platillos
    Entonces el platillo aparece automáticamente en la lista filtrada

  Scenario: Error de conexión con la base de datos
    Dado que no hay conexión con la base de datos
    Cuando el usuario activa el filtro "Mostrar solo disponibles"
    Entonces el sistema muestra el mensaje "No se puede verificar la disponibilidad en este momento."

  Scenario: No hay platillos disponibles
    Dado que todos los platillos están agotados
    Cuando el usuario activa el filtro "Mostrar solo disponibles"
    Entonces el sistema muestra el mensaje "Sin resultados disponibles."
