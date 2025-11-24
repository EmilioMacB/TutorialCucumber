const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');


/* --------------------------
   Given
-------------------------- */

Given('que el usuario ha iniciado sesión', function () {
  this.loggeado = true;
});

Given('el platillo está activo en el sistema', function () {
  this.activo = true;
});

Given('el platillo no está en la lista de favoritos del usuario', function () {
  this.favoritos = [];
});

Given('el platillo ya está en los favoritos del usuario', function () {
  this.favoritos = ["Tacos al pastor"];
});

Given('el platillo está marcado como inactivo', function () {
  this.activo = false;
});


/* --------------------------
   When
-------------------------- */

When('el usuario da clic en "Agregar a favoritos"', function () {
  if (!this.activo) {
    this.mensaje = "Elemento no disponible";
    return;
  }

  if (this.favoritos.includes("Tacos al pastor")) {
    this.mensaje = "Este platillo ya está en tus favoritos";
    return;
  }

  this.favoritos.push("Tacos al pastor");
  this.mensaje = "Agregado a favoritos";
});

When('el usuario selecciona "Quitar de favoritos"', function () {
  this.favoritos = [];
});

When('el usuario intenta agregarlo como favorito', function () {
  if (!this.activo) {
    this.mensaje = "Elemento no disponible";
  }
});

When('el usuario intenta agregarlo nuevamente', function () {
  if (this.favoritos.includes("Tacos al pastor")) {
    this.mensaje = "Este platillo ya está en tus favoritos";
  }
});


/* --------------------------
   Then
-------------------------- */

Then('el sistema agrega el platillo a la lista de favoritos', function () {
  assert.ok(this.favoritos.length === 1);
});

Then('el nuevo favorito aparece en la sección "Mis Favoritos"', function () {
  assert.ok(this.favoritos.length === 1);
});

Then('el sistema elimina el platillo de su lista de favoritos', function () {
  assert.deepStrictEqual(this.favoritos, []);
});

Then('ya no aparece en "Mis Favoritos"', function () {
  assert.deepStrictEqual(this.favoritos, []);
});

Then('no agrega el favorito', function () {
  assert.ok(this.favoritos.length === 0);
});

Then('el sistema no duplica el registro', function () {
  assert.ok(this.favoritos.length === 1);
});
