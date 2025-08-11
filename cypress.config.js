const { defineConfig } = require('cypress');

module.exports = defineConfig({
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    charts: true,
    reportPageTitle: 'Relatório de Testes',
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: false,
    reportDir: 'cypress/reports/json',
    overwrite: false,
    html: false,
    json: true
  },
  e2e: {
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
    baseUrl: 'https://localhost:7160',
  }
});
