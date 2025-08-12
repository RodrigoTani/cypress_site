// cypress/support/commands.js
Cypress.Commands.add('gerarCPF', () => {
    function gerarDigito(arr) {
      const soma = arr
        .map((v, i) => v * ((arr.length + 1) - i))
        .reduce((a, b) => a + b, 0);
  
      const resto = soma % 11;
      return resto < 2 ? 0 : 11 - resto;
    }
  
    const base = Array.from({ length: 9 }, () => Math.floor(Math.random() * 9));
    base.push(gerarDigito(base));
    base.push(gerarDigito(base));
  
    return base.join('');
});

Cypress.Commands.add('verifyErrorMessage', (expectedMessage) => {
    return cy.get("span.form-text.text-danger.field-validation-error")
      .then($elements => {
        const messages = Array.from($elements).map(el => el.textContent.trim());
  
        if (expectedMessage) {
          expect(messages).to.include(expectedMessage);
        }
  
        return messages;
      });
});
  
Cypress.Commands.add('gerarCelular', () => {
    const ddd = 11;
    const prefixo = 9;
    const numero = Math.floor(Math.random() * 900000000) + 100000000;
    return `${ddd}${prefixo}${numero}`.slice(0, 11);
});

Cypress.Commands.add('gerarEmail', () => {
    const timestamp = Date.now();
    return `user${timestamp}@teste.com`;
});  