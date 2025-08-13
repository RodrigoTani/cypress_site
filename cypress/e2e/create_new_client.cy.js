describe('Create new Client', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');

    cy.get("#LoginClient").click();
    cy.get('a').contains('Criar nova conta').click();
  });

  const user = {
    name: 'Automation Test', 
    email: 'rodrigotanni@hotmail.com',
    cellphone: '11963925158',
    birthDate: '2000-01-01',
    password: '123@Senha'
  };

  const fillForm = () => {
    cy.get('#Nome').type(user.name);
    cy.get('#Email').type(user.email);
    cy.get('#Celular').type(user.cellphone);

    return cy.gerarCPF().then((cpf) => {
      cy.get('#CPF').type(cpf);
      user.cpf = cpf;
    }).then(() => {
      cy.get('#DataNascimento').type(user.birthDate);
    }).then(() => {
      return cy.get('#Genero').then($select => {
        const opcoes = $select.find('option');
        const qtd = opcoes.length;

        const indice = Math.floor(Math.random() * (qtd - 1)) + 1;

        const valor = opcoes.eq(indice).val();
        user.gender = valor;
        return cy.get('#Genero').select(valor);
      });
    }).then(() => {
      cy.get('#senhaInput').type(user.password);
    });
  };

  it('without name', () => {
    fillForm().then(() => {
      cy.get('#Nome').clear();
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('O campo Nome é obrigatório.');

      cy.screenshot('without-name', { capture: 'viewport' });
    });
  });

  it('without e-mail', () => {
    fillForm().then(() => {
      cy.get('#Email').clear();
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('O campo E-mail é obrigatório.');

      cy.screenshot('without-email', { capture: 'viewport' });
    });
  });

  it('without cellphone', () => {
    fillForm().then(() => {
      cy.get('#Celular').clear();
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('O campo Celular é obrigatório.');

      cy.screenshot('without-cellphone', { capture: 'viewport' });
    });
  });

  it('without birthdate', () => {
    fillForm().then(() => {
      cy.get('#DataNascimento').clear();
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('O campo data de nascimento é obrigatório.');

      cy.screenshot('without-birthday', { capture: 'viewport' });
    });
  });

  it('without gender', () => {
    fillForm().then(() => {
      cy.get('#Genero').select('');
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('O campo gênero é obrigatório.');

      cy.screenshot('without-gender', { capture: 'viewport' });
    });
  });

  it('without password', () => {
    fillForm().then(() => {
      cy.get('#senhaInput').clear();
      cy.contains('button', 'Salvar').click();
      cy.verifyErrorMessage('Digite a senha');

      cy.screenshot('without-password', { capture: 'viewport' });
    });
  });

  it('exist cellphone', () => {
    fillForm();
    cy.get('#Email').clear().type('rodrigotanni@gmail.com');
    
    cy.contains('button', 'Salvar').click();
    cy.verifyErrorMessage('Já existe um cliente com esse celular.');
    
    cy.screenshot('exist-cellphone', { capture: 'viewport' });
  });

  it('exist email', () => {
    fillForm();
    
    cy.gerarCelular().then(celular => {
      user.cellphone = celular;
      cy.get('#Celular').clear().type(celular);
    });

    cy.contains('button', 'Salvar').click();
    cy.verifyErrorMessage('Já existe um cliente com esse email.');

    cy.screenshot('exist-email', { capture: 'viewport' });
  });

  it('success', () => {
    fillForm();
    
    cy.gerarCelular().then(celular => {
      user.cellphone = celular;
      cy.get('#Celular').clear().type(celular);
    });

    cy.gerarEmail().then(email => {
      user.email = email;
      cy.get('#Email').clear().type(email);
    });

    cy.log(JSON.stringify(user));
    cy.contains('button', 'Salvar').click();

    cy.get('.alert.alert-success')
    .should('be.visible')
    .and('contain', 'Cliente criado com sucesso.');

    cy.screenshot('success', { capture: 'viewport' });
  });
});
