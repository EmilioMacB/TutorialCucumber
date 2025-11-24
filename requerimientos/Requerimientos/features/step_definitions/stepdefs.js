// features/step_definitions/stepdefs.js
// Ejecuta con: npx cucumber-js --publish-quiet

const { Given, When, Then, Before, setDefaultTimeout } = require('@cucumber/cucumber');
const assert = require('assert/strict');

setDefaultTimeout(60 * 1000);

let ctx;

Before(() => {
  ctx = {
    appExists: false,
    isAuthenticated: false,
    profileExistsAndActive: false,
    storageAvailable: false,
    ssoAvailable: false,
    selectedFile: null,
    authorizedSSO: false,
    profilePhotoUrl: null,
    lastMessage: null,
    lastActionBlocked: false,
    changesSaved: false,
  };
});

// -----------------------------
// Utilidades
// -----------------------------
const ALLOWED_EXT = ['jpg', 'jpeg', 'png', 'webp'];
const MAX_MB = 5;

function extOf(name) {
  const p = name.lastIndexOf('.');
  return p === -1 ? '' : name.slice(p + 1).toLowerCase();
}

function validateFile(fileName, sizeMB) {
  const ext = extOf(fileName);
  const okExt = ALLOWED_EXT.includes(ext);
  const okSize = Number(sizeMB) <= MAX_MB;
  return { ext, okExt, okSize, isValid: okExt && okSize };
}

function tryUpload() {
  if (!ctx.isAuthenticated) {
    ctx.lastActionBlocked = true;
    ctx.lastMessage = 'Debes iniciar sesión para cambiar tu foto de perfil.';
    ctx.changesSaved = false;
    return;
  }
  if (!ctx.profileExistsAndActive) {
    ctx.lastActionBlocked = true;
    ctx.lastMessage = 'Perfil no encontrado';
    ctx.changesSaved = false;
    return;
  }
  if (!ctx.storageAvailable) {
    ctx.lastActionBlocked = true;
    ctx.lastMessage = 'Error al conectar con el servicio de almacenamiento. Intenta más tarde.';
    ctx.changesSaved = false;
    return;
  }
  if (!ctx.selectedFile || !ctx.selectedFile.isValid) {
    ctx.lastActionBlocked = true;
    ctx.lastMessage = 'Formato o tamaño no permitido.';
    ctx.changesSaved = false;
    return;
  }
  ctx.profilePhotoUrl = `https://cdn.example.com/${ctx.selectedFile.name}`;
  ctx.changesSaved = true;
  ctx.lastActionBlocked = false;
  ctx.lastMessage = 'Tu foto se ha actualizado correctamente.';
}

function tryUseSSO() {
  if (!ctx.isAuthenticated || !ctx.profileExistsAndActive) {
    ctx.lastMessage = 'Perfil no encontrado';
    ctx.changesSaved = false;
    ctx.lastActionBlocked = true;
    return;
  }
  if (!ctx.ssoAvailable) {
    ctx.lastMessage = 'No se pudo conectar con ITESO. Intenta más tarde.';
    ctx.changesSaved = false;
    ctx.lastActionBlocked = true;
    return;
  }
  if (!ctx.authorizedSSO) {
    ctx.lastMessage = 'No autorizado por SSO.';
    ctx.changesSaved = false;
    ctx.lastActionBlocked = true;
    return;
  }
  ctx.profilePhotoUrl = 'https://sso.iteso.mx/avatar/usuario.jpg';
  ctx.changesSaved = true;
  ctx.lastActionBlocked = false;
  ctx.lastMessage = 'Tu foto se ha actualizado correctamente.';
}

// -----------------------------
// Steps
// -----------------------------

// Antecedente
Given(/^que existe la aplicación CampusBites$/, function () {
  ctx.appExists = true;
});

// 1) Solo usuarios autenticados
Given(/^que la persona NO ha iniciado sesión$/, function () {
  ctx.isAuthenticated = false;
});
When(/^intenta abrir la opción "Editar foto de perfil"$/, function () {
  if (!ctx.isAuthenticated) {
    ctx.lastActionBlocked = true;
    ctx.lastMessage = 'Debes iniciar sesión para cambiar tu foto de perfil.';
  }
});
Then(/^el sistema bloquea la acción$/, function () {
  assert.equal(ctx.lastActionBlocked, true);
});
Then(/^se muestra el mensaje "Debes iniciar sesión para cambiar tu foto de perfil\."$/, function () {
  assert.equal(ctx.lastMessage, 'Debes iniciar sesión para cambiar tu foto de perfil.');
});

// 2) Perfil inexistente/inactivo
Given(/^que la persona ha iniciado sesión$/, function () {
  ctx.isAuthenticated = true;
});
Given(/^el perfil del usuario NO existe o está en estado inactivo en la base de datos$/, function () {
  ctx.profileExistsAndActive = false;
});
When(/^intenta guardar una nueva foto$/, function () {
  ctx.selectedFile = { name: 'dummy.png', sizeMB: 1, ext: 'png', isValid: true };
  tryUpload();
});
Then(/^el sistema NO guarda cambios$/, function () {
  assert.equal(ctx.changesSaved, false);
});
Then(/^se muestra el mensaje "Perfil no encontrado"\.$/, function () {
  assert.equal(ctx.lastMessage, 'Perfil no encontrado');
});

// 3) Subida exitosa con almacenamiento disponible
Given(/^el perfil del usuario existe y está activo$/, function () {
  ctx.profileExistsAndActive = true;
});
Given(/^el servicio de almacenamiento de imágenes está DISPONIBLE$/, function () {
  ctx.storageAvailable = true;
});
Given(/^el usuario selecciona un archivo válido "([^"]*)" de ([0-9]+(?:\.[0-9]+)?) MB$/, function (nombre, peso) {
  const res = validateFile(nombre, Number(peso));
  ctx.selectedFile = { name: nombre, sizeMB: Number(peso), ext: res.ext, isValid: res.isValid };
  assert.equal(res.isValid, true);
});
When(/^confirma la subida de la imagen$/, function () {
  tryUpload();
});
Then(/^el sistema sube la imagen y obtiene una URL pública$/, function () {
  assert.ok(ctx.profilePhotoUrl && ctx.profilePhotoUrl.startsWith('https://cdn.example.com/'));
});
Then(/^actualiza el perfil con la nueva URL de imagen$/, function () {
  assert.ok(ctx.profilePhotoUrl);
  assert.equal(ctx.changesSaved, true);
});
Then(/^muestra el mensaje "Tu foto se ha actualizado correctamente\."$/, function () {
  assert.equal(ctx.lastMessage, 'Tu foto se ha actualizado correctamente.');
});

// 4) Falla por almacenamiento no disponible
Given(/^el servicio de almacenamiento de imágenes está NO disponible$/, function () {
  ctx.storageAvailable = false;
});
Given(/^el usuario selecciona un archivo válido "([^"]*)" de ([0-9]+(?:\.[0-9]+)?) MB para error$/, function (nombre, peso) {
  const res = validateFile(nombre, Number(peso));
  ctx.selectedFile = { name: nombre, sizeMB: Number(peso), ext: res.ext, isValid: res.isValid };
});
Then(/^se muestra el mensaje "Error al conectar con el servicio de almacenamiento\. Intenta más tarde\."$/, function () {
  assert.equal(ctx.lastMessage, 'Error al conectar con el servicio de almacenamiento. Intenta más tarde.');
});

// 5) Vincular con SSO disponible
Given(/^el servicio SSO ITESO está DISPONIBLE$/, function () {
  ctx.ssoAvailable = true;
});
When(/^selecciona la opción "Usar mi foto institucional"$/, function () {
  tryUseSSO(); // ahora sí se ejecuta
});
When(/^autoriza el acceso al avatar institucional$/, function () {
  ctx.authorizedSSO = true;
  tryUseSSO();
});
Then(/^el sistema obtiene la URL del avatar institucional$/, function () {
  assert.ok(ctx.profilePhotoUrl && ctx.profilePhotoUrl.includes('sso.iteso.mx'));
});
Then(/^actualiza la foto del perfil con dicha URL$/, function () {
  assert.ok(ctx.profilePhotoUrl);
  assert.equal(ctx.changesSaved, true);
});

// 6) Vincular con SSO inactivo
Given(/^el servicio SSO ITESO está NO disponible$/, function () {
  ctx.ssoAvailable = false;
});
Then(/^se muestra el mensaje "No se pudo conectar con ITESO\. Intenta más tarde\."$/, function () {
  assert.equal(ctx.lastMessage, 'No se pudo conectar con ITESO. Intenta más tarde.');
});

// 7) Validación archivo inválido
Given(/^el usuario selecciona un archivo "([^"]*)" de ([0-9]+(?:\.[0-9]+)?) MB$/, function (nombre, peso) {
  const res = validateFile(nombre, Number(peso));
  ctx.selectedFile = { name: nombre, sizeMB: Number(peso), ext: res.ext, isValid: res.isValid };
});
Then(/^se muestra el mensaje "Formato o tamaño no permitido\."$/, function () {
  assert.equal(ctx.lastMessage, 'Formato o tamaño no permitido.');
});
