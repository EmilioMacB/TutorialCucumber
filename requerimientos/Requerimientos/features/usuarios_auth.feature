# language: es
@perfil @foto @ui @api
Característica: Gestión de foto de perfil (opcional y customizable)
  Como sistema
  Quiero permitir que las personas autenticadas actualicen su foto de perfil
  Para mostrar su identidad en el perfil y en sus reseñas

  Antecedentes:
    Dado que existe la aplicación CampusBites

  # 1) Solo usuarios autenticados pueden editar
  @auth
  Escenario: Restringir edición de foto a usuarios autenticados
    Dado que la persona NO ha iniciado sesión
    Cuando intenta abrir la opción "Editar foto de perfil"
    Entonces el sistema bloquea la acción
    Y se muestra el mensaje "Debes iniciar sesión para cambiar tu foto de perfil."

  # 2) El perfil debe existir/estar activo en BD
  @perfil
  Escenario: Rechazar guardado cuando el perfil no existe o está inactivo
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario NO existe o está en estado inactivo en la base de datos
    Cuando intenta guardar una nueva foto
    Entonces el sistema NO guarda cambios
    Y se muestra el mensaje "Perfil no encontrado".

  # 3) Subida exitosa con almacenamiento disponible y archivo válido
  @storage @happy
  Escenario: Guardar foto personalizada con almacenamiento disponible
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario existe y está activo
    Y el servicio de almacenamiento de imágenes está DISPONIBLE
    Y el usuario selecciona un archivo válido "foto_valida.webp" de 1.5 MB
    Cuando confirma la subida de la imagen
    Entonces el sistema sube la imagen y obtiene una URL pública
    Y actualiza el perfil con la nueva URL de imagen
    Y muestra el mensaje "Tu foto se ha actualizado correctamente."

  # 4) Falla al subir por almacenamiento no disponible
  @storage @error
  Escenario: Error al conectar con el servicio de almacenamiento
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario existe y está activo
    Y el servicio de almacenamiento de imágenes está NO disponible
    Y el usuario selecciona un archivo válido "foto_valida.jpg" de 2 MB
    Cuando confirma la subida de la imagen
    Entonces el sistema NO guarda cambios
    Y se muestra el mensaje "Error al conectar con el servicio de almacenamiento. Intenta más tarde."

  # 5) Vincular con foto institucional (SSO) - éxito
  @sso @happy
  Escenario: Actualizar foto usando avatar institucional cuando SSO está disponible
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario existe y está activo
    Y el servicio SSO ITESO está DISPONIBLE
    Cuando selecciona la opción "Usar mi foto institucional"
    Y autoriza el acceso al avatar institucional
    Entonces el sistema obtiene la URL del avatar institucional
    Y actualiza la foto del perfil con dicha URL
    Y muestra el mensaje "Tu foto se ha actualizado correctamente."

  # 6) Vincular con foto institucional (SSO) - error
  @sso @error
  Escenario: No se puede actualizar con avatar institucional cuando SSO está inactivo
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario existe y está activo
    Y el servicio SSO ITESO está NO disponible
    Cuando selecciona la opción "Usar mi foto institucional"
    Entonces el sistema NO guarda cambios
    Y se muestra el mensaje "No se pudo conectar con ITESO. Intenta más tarde."

  # 7) Validación de archivo (formato / tamaño)
  @validacion @outline
  Esquema del escenario: Rechazar archivo inválido por formato o tamaño
    Dado que la persona ha iniciado sesión
    Y el perfil del usuario existe y está activo
    Y el servicio de almacenamiento de imágenes está DISPONIBLE
    Y el usuario selecciona un archivo <archivo> de <peso> MB
    Cuando confirma la subida de la imagen
    Entonces el sistema NO guarda cambios
    Y se muestra el mensaje "Formato o tamaño no permitido."

    Ejemplos:
      | archivo              | peso |
      | "selfie.bmp"         | 1.0  |  # Formato no permitido
      | "selfie.jpg"         | 6.2  |  # Tamaño > 5 MB
      | "selfie.tiff"        | 2.0  |  # Formato no permitido
      | "selfie.png"         | 7.5  |  # Tamaño > 5 MB
