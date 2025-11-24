const { Before, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Before(function () {
  this.mensaje = null;
  this.sugerencias = [];
  this.favoritos = [];
  this.precios = null;
  this.total = null;
  this.conexion = true;
  this.seleccion = null;
  this.activo = true;
  this.errorDB = false;
});

/**
 * Paso genérico para cualquier mensaje en pantalla
 */
Then('se muestra el mensaje {string}', function (mensajeEsperado) {
  assert.strictEqual(this.mensaje, mensajeEsperado);
});

// Caso: "Then el sistema muestra el mensaje "Texto""
Then('el sistema muestra el mensaje {string}', function (expectedMessage) {
  assert.strictEqual(this.mensaje, expectedMessage);
});

// Caso: "And muestra el mensaje "Texto""
Then('muestra el mensaje {string}', function (expectedMessage) {
  assert.strictEqual(this.mensaje, expectedMessage);
});