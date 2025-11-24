⚙️ Instalación

Asegúrate de tener Node.js instalado (versión 16+ recomendada).
npm install

Instala Cucumber (si no está ya en package.json):
npm install @cucumber/cucumber --save-dev

▶️ Ejecutar las pruebas

Para correr TODOS los escenarios:

npm test


O directamente:

npx cucumber-js


Para correr solo un feature, por ejemplo favoritos:

npx cucumber-js features/favoritos.feature