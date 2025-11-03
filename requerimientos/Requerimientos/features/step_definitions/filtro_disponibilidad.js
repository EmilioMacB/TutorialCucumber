const { Given, When, Then, Before } = require('@cucumber/cucumber');
const assert = require('assert/strict');

let ctx;

Before(() => {
  ctx = {
    appExists: false,
    isAuthenticated: false,
    connectionOk: true,
    dishes: [],
    filterActive: false,
    visibleDishes: [],
    lastMessage: null,
  };
});

// Funciones auxiliares
function applyFilter() {
  if (!ctx.connectionOk) {
    ctx.visibleDishes = [];
    ctx.lastMessage = 'No se puede verificar la disponibilidad en este momento.';
    return;
  }

  if (!ctx.filterActive) {
    ctx.visibleDishes = ctx.dishes;
    return;
  }

  const visibles = ctx.dishes.filter(d => d.available);
  ctx.visibleDishes = visibles;

  if (visibles.length === 0) {
    ctx.lastMessage = 'Sin resultados disponibles.';
  }
}

// ---------------- Steps ----------------

Given('que existe la aplicación CampusBites', function () {
  ctx.appExists = true;
});

Given('el usuario ha iniciado sesión correctamente', function () {
  ctx.isAuthenticated = true;
});

Given('que hay platillos disponibles y agotados en la base de datos', function () {
  ctx.dishes = [
    { name: 'Chilaquiles', available: true },
    { name: 'Torta ahogada', available: false },
    { name: 'Ensalada ITESO', available: true },
  ];
});

When('el usuario activa el filtro {string}', function (filtro) {
  if (filtro === 'Mostrar solo disponibles') ctx.filterActive = true;
  applyFilter();
});

Then('el sistema oculta todos los platillos agotados', function () {
  assert.ok(!ctx.visibleDishes.find(d => !d.available));
});

Then('muestra únicamente los disponibles', function () {
  assert.deepEqual(
    ctx.visibleDishes.map(d => d.name),
    ['Chilaquiles', 'Ensalada ITESO']
  );
});

Given('una cafetería marca un platillo como disponible', function () {
  ctx.dishes.push({ name: 'Molletes', available: true });
});

When('el sistema actualiza el estado de los platillos', function () {
  applyFilter();
});

Then('el platillo aparece automáticamente en la lista filtrada', function () {
  const nombres = ctx.visibleDishes.map(d => d.name);
  assert.ok(nombres.includes('Molletes'));
});

Given('no hay conexión con la base de datos', function () {
  ctx.connectionOk = false;
});

Then('el sistema muestra el mensaje {string}', function (mensaje) {
  assert.equal(ctx.lastMessage, mensaje);
});

Given('todos los platillos están agotados', function () {
  ctx.dishes = [
    { name: 'Pizza ITESO', available: false },
    { name: 'Ensalada César', available: false },
  ];
});
