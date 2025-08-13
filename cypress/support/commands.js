
// Login
    //Login administrativo
        Cypress.Commands.add('loginAdm', (user, pass) => {
            cy.get("#LoginAdm").click();
            cy.get("#login").clear().type(user);
            cy.get("#senha").clear().type(pass);
            cy.contains('button', 'Entrar').click();
        });

    //Login cliente
        Cypress.Commands.add('loginClient', (cpf, pass) => {
            cy.get('#LoginClient').click();
            cy.get('#CPF').clear().type(cpf);
            cy.get('#Senha').clear().type(pass);
            cy.contains('button', 'Entrar').click();
        });
  
// Navigation Admin Menu
    Cypress.Commands.add('navigateMenu', (menu, submenu) => {
        // Clica no botão do módulo para abrir o menu principal e garante que abriu
        cy.contains('button.dropdown-toggle', menu)
        .click()
        .should('have.attr', 'aria-expanded', 'true');
    
        // Busca o submenu pelo texto e extrai o href para navegar direto
        cy.contains('ul.dropdown-menu a.dropdown-item.botao-verde', submenu)
        .should('exist')               // garante que o item está na DOM
        .invoke('attr', 'href')       // pega o href
        .then(href => {
            expect(href, `Verifica href do submenu "${submenu}"`).to.be.a('string').and.not.be.empty;
            cy.visit(href);
        });
    });

// Data Generation
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

// Validations
    Cypress.Commands.add('verifyErrorMessage', (expectedMessage) => {
        return cy.get('span.text-danger.field-validation-error, span.form-text.text-danger.field-validation-error')
        .then($elements => {
            const messages = Array.from($elements).map(el => el.textContent.trim());
    
            if (expectedMessage) {
            expect(messages).to.include(expectedMessage);
            }
    
            return messages;
        });
    });

    Cypress.Commands.add('checkMessage', (expectedSuccessMessage) => {
        return cy.get('body').then($body => {
          if ($body.find('.alert.alert-success').length) {
            // Mensagem de sucesso
                return cy.get('.alert.alert-success')
                .should('be.visible')
                .and('contain', expectedSuccessMessage)
                .invoke('text')
                .then(text => {
                    const match = text.match(/(\d+)\s*-\s*/);
                    const pedidoId = match ? match[1] : null;
                    cy.log(`Pedido ID capturado: ${pedidoId}`);
                    return cy.wrap(pedidoId);
                });
          } else if ($body.find('.alert.alert-danger').length) {
            // Mensagem de erro
                return cy.get('.alert.alert-danger')
                .should('be.visible')
                .and('contain', expectedSuccessMessage)
                .invoke('text')
                .then(text => {
                    cy.log(`Erro encontrado: ${text}`);
                    return cy.wrap(null);
                });
          } else {
            throw new Error('Nenhuma mensagem de alerta encontrada na tela.');
          }
        });
      });