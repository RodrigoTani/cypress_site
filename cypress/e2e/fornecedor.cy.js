describe('purchase order', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.visit('/');

    cy.loginAdm('rodrigo.tani', '12345');
    cy.url().should('include', '/Home');

    cy.navigateMenu('Menu Estoque', '1 - Pedido de Compra');
    cy.url().should('include', '/PedidoCompra');
  });

  describe('new order', () => {
    const list = {
      produtos: [
        {
          name: "IPHONE 16 PRO MAX 128gb",
          quantity: 1,
          price: "12000,00"
        },
        {
          name: "LEITE INTEGRAL ITALAC",
          quantity: 15,
          price: "2,00"
        }
      ]
    }

    it('success', () => {
      cy.contains('a', 'Novo Pedido').click();
      cy.url().should('include', '/PedidoCompra/Criar');
      cy.get('select#FornecedorId').select('TANI IT CONSULTING LTDA');
    
      for(let i = 0; i < list.produtos.length; i++) {
        cy.contains('button', 'Adicionar Item').click();
        cy.get(`select[name="Itens[${i}].ProdutoId"]`).select(list.produtos[i].name);
        cy.get(`input[name="Itens[${i}].Quantidade"]`).clear().type(list.produtos[i].quantity);
        cy.get(`input[name="Itens[${i}].PrecoUnitario"]`).clear().type(list.produtos[i].price);
      }

      cy.get('#Observacoes').type('Pedido de teste automatizado');
      cy.contains('button', 'Salvar Pedido').click();
      cy.checkSuccessMessage('Pedido de compra cadastrado com sucesso!');
      cy.url().should('include', '/PedidoCompra');
    });    
  })
})