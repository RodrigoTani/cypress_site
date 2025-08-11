describe('Login module', () => {
  // Função para login administrativo
  const loginAdm = (user, pass) => {
    cy.get("#LoginAdm").click();
    cy.get("#login").clear().type(user);
    cy.get("#senha").clear().type(pass);
    cy.contains('button', 'Entrar').click();
  };

  // Função para login do cliente
  const loginClient = (cpf, pass) => {
    cy.get("#LoginClient").click();
    cy.get("#CPF").clear().type(cpf);
    cy.get("#Senha").clear().type(pass);
    cy.contains('button', 'Entrar').click();
  };

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Administrative login', () => {
    it('wrong password', () => {
      cy.fixture('login_admin').then(({ User }) => {
        loginAdm(User, 'wrongpassword');
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Usuário e/ou senha inválido. Tente novamente!');
        
        cy.screenshot('login-wrong-password', { capture: 'viewport' });
      });
    });

    it('wrong user', () => {
      cy.fixture('login_admin').then(({ Senha }) => {
        loginAdm('wronguser', Senha);
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Usuário e/ou senha inválido. Tente novamente!');
        
        cy.screenshot('login-wrong-user', { capture: 'viewport' });
      });
    });

    it('success login', () => {
      cy.fixture('login_admin').then(({ User, Senha }) => {
        loginAdm(User, Senha);
        cy.url().should('include', '/Home');

        cy.screenshot('login-success', { capture: 'viewport' });
      });
    });
  });

  describe('Client login', () => {
    it('wrong password', () => {
      cy.fixture('login_client').then(({ CPF }) => {
        loginClient(CPF, 'wrongpassword');
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Senha inválida.');

          cy.screenshot('login-client-wrong-password', { capture: 'viewport' });
      });
    });

    it('wrong user', () => {
      loginClient('wronguser', 'wrongpassword');
      cy.get('.alert.alert-danger')
        .should('be.visible')
        .and('contain', 'Cliente não encontrado.');

        cy.screenshot('login-client-wrong-user', { capture: 'viewport' });
    });

    it('success login', () => {
      cy.fixture('login_client').then(({ CPF, Senha }) => {
        loginClient(CPF, Senha);
        cy.url().should('include', '/ClienteArea');

        cy.screenshot('login-client-success', { capture: 'viewport' });
      });
    });
  });
});