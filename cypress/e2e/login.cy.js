describe('Login module', () => {
  // Função para login do cliente

  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');
  });

  describe('Administrative login', () => {
    it('wrong password', () => {
      cy.fixture('login_admin').then(({ User }) => {
        cy.loginAdm(User, 'wrongpassword');
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Usuário e/ou senha inválido. Tente novamente!');
        
        cy.screenshot('login-wrong-password', { capture: 'viewport' });
      });
    });

    it('wrong user', () => {
      cy.fixture('login_admin').then(({ Senha }) => {
        cy.loginAdm('wronguser', Senha);
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Usuário e/ou senha inválido. Tente novamente!');
        
        cy.screenshot('login-wrong-user', { capture: 'viewport' });
      });
    });

    it('success login', () => {
      cy.fixture('login_admin').then(({ User, Senha }) => {
        cy.loginAdm(User, Senha);
        cy.url().should('include', '/Home');

        cy.screenshot('login-success', { capture: 'viewport' });
      });
    });
  });

  describe('Client login', () => {
    it('wrong password', () => {
      cy.fixture('login_client').then(({ CPF }) => {
        cy.loginClient(CPF, 'wrongpassword');
        cy.get('.alert.alert-danger')
          .should('be.visible')
          .and('contain', 'Senha inválida.');

          cy.screenshot('login-client-wrong-password', { capture: 'viewport' });
      });
    });

    it('wrong user', () => {
      cy.loginClient('wronguser', 'wrongpassword');
      cy.get('.alert.alert-danger')
        .should('be.visible')
        .and('contain', 'Cliente não encontrado.');

        cy.screenshot('login-client-wrong-user', { capture: 'viewport' });
    });

    it('success login', () => {
      cy.fixture('login_client').then(({ CPF, Senha }) => {
        cy.loginClient(CPF, Senha);
        cy.url().should('include', '/ClienteArea');

        cy.screenshot('login-client-success', { capture: 'viewport' });
      });
    });
  });
});