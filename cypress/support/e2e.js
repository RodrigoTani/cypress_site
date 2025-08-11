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

afterEach(() => {
  // salva o localStorage após cada teste
  Object.keys(localStorage).forEach(key => {
    LOCAL_STORAGE_MEMORY[key] = localStorage.getItem(key)
  })
})

Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignora todos os erros uncaught da aplicação
  return false
})