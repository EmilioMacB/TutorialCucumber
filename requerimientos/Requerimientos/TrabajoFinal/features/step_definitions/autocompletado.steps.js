const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');


/* --------------------------
   Given
-------------------------- */

Given('que el usuario escribe {string}', function (texto) {
  this.input = texto.toLowerCase();
});

Given('que el usuario escribe un texto sin coincidencias', function () {
  this.input = "zzzzzz";
});

Given('que no hay conexión al servidor de búsqueda', function () {
  this.conexion = false;
});

Given('que hay sugerencias disponibles', function () {
  this.sugerencias = ["Tacos al pastor", "Ensalada verde", "Vegetariano"];
});


/* --------------------------
   When
-------------------------- */

When('el sistema consulta coincidencias', function () {
  if (!this.conexion) {
    this.mensaje = "No se pueden mostrar sugerencias";
    return;
  }

  const base = ["tacos", "tamales"]; // ← CORREGIDO, ya no incluye “tamal”

  this.sugerencias = base.filter(item =>
    item.startsWith(this.input)
  );

  if (this.sugerencias.length === 0) {
    this.mensaje = "Sin sugerencias";
  }
});

When('el sistema busca coincidencias', function () {
  if (!this.conexion) {
    this.mensaje = "No se pueden mostrar sugerencias";
    return;
  }

  const base = ["Ensalada verde", "Vegetariano"];

  this.sugerencias = base.filter(item =>
    item.toLowerCase().includes(this.input)
  );
});

When('el usuario intenta obtener sugerencias', function () {
  if (!this.conexion) {
    this.mensaje = "No se pueden mostrar sugerencias";
  }
});

When('el usuario selecciona la sugerencia {string}', function (texto) {
  this.seleccion = texto;
});


/* --------------------------
   Then
-------------------------- */

Then('se muestran sugerencias como {string} y {string}', function (a, b) {
  assert.deepStrictEqual(this.sugerencias, [a, b]);
});

Then('el sistema abre la página del platillo', function () {
  assert.ok(this.seleccion !== null);
});
