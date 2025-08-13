import './commands'
import 'cypress-file-upload';
import 'cypress-mochawesome-reporter/register';

let LOCAL_STORAGE_MEMORY = {}

beforeEach(() => {
  // restaura o localStorage
  Object.keys(LOCAL_STORAGE_MEMORY).forEach(key => {
    localStorage.setItem(key, LOCAL_STORAGE_MEMORY[key])
  })
})

afterEach(function () {
  // salva o localStorage após cada teste
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage.getItem(key)
  })

  // Se o teste falhou, captura print
  if (this.currentTest.state === 'failed') {
    const testName = this.currentTest.title.replace(/[:\/]/g, ''); // remove caracteres inválidos
    cy.screenshot(`erro-${testName}`, { capture: 'runner' });
  }
})

// Ignora erros uncaught da aplicação
Cypress.on('uncaught:exception', (err, runnable) => {
  return false
})