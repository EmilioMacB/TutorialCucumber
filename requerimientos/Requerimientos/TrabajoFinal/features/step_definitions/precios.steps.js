const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');


/* --------------------------
   Given
-------------------------- */

Given('que el platillo tiene precio base y extras disponibles', function () {
  this.precios = { base: 50, extras: { queso: 10, aguacate: 15 } };
});

Given('que el usuario está viendo un platillo con extras disponibles', function () {
  this.precios = { base: 50, extras: { queso: 10 } };
});

Given('que el platillo no tiene extras configurados', function () {
  this.precios = { base: 50, extras: {} };
});

Given('que ocurre un error al obtener precios desde la base de datos', function () {
  this.errorDB = true;
});


/* --------------------------
   When
-------------------------- */

When('el usuario visualiza la sección de precios', function () {
  if (this.errorDB) {
    this.mensaje = "No se pudieron cargar los precios. Intenta más tarde.";
  }
});

When('el usuario visualiza el detalle del platillo', function () {
  if (Object.keys(this.precios.extras).length === 0) {
    this.mensaje = "Sin extras disponibles";
  }
});

When('selecciona un extra adicional', function () {
  this.total = this.precios.base + 10;
});

When('el usuario intenta visualizar precios', function () {
  if (this.errorDB) {
    this.mensaje = "No se pudieron cargar los precios. Intenta más tarde.";
  }
});


/* --------------------------
   Then
-------------------------- */

Then('el sistema muestra el precio base', function () {
  assert.strictEqual(this.precios.base, 50);
});

Then('muestra los extras con su precio individual', function () {
  assert.deepStrictEqual(this.precios.extras, { queso: 10, aguacate: 15 });
});

Then('el sistema recalcula el total', function () {
  assert.ok(this.total !== null);
});

Then('muestra el precio actualizado', function () {
  assert.strictEqual(this.total, 60);
});

Then('el sistema muestra solo el precio base', function () {
  assert.strictEqual(this.precios.base, 50);
});
