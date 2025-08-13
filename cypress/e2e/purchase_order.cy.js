describe('purchase order', () => {
  let pedidoId;

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

    const createOrder = () => {
      cy.contains('a', 'Novo Pedido').click();
      cy.url().should('include', '/PedidoCompra/Criar');
      cy.get('select#FornecedorId').select('TANI IT CONSULTING LTDA');
    
      for (let i = 0; i < list.produtos.length; i++) {
        cy.contains('button', 'Adicionar Item').click();
        cy.get(`select[name="Itens[${i}].ProdutoId"]`).select(list.produtos[i].name);
        cy.get(`input[name="Itens[${i}].Quantidade"]`).clear().type(list.produtos[i].quantity);
        cy.get(`input[name="Itens[${i}].PrecoUnitario"]`).clear().type(list.produtos[i].price);
      }
    
      cy.get('#Observacoes').type('Pedido de teste automatizado');
      cy.contains('button', 'Salvar Pedido').click();
    
      cy.checkMessage('Pedido de compra cadastrado com sucesso!').then(pedidoId => {
        if (!pedidoId) throw new Error('ID do pedido não encontrado!');
        cy.log(`Pedido ID capturado no teste: ${pedidoId}`);
        Cypress.env('pedidoId', pedidoId);
        cy.get('#dt-search-0').type(pedidoId);
      });
    };
    
    it('create', () => {
      createOrder();
    });
    
    it('delete', () => {
      const pedidoId = Cypress.env('pedidoId');
      if (!pedidoId) throw new Error('Pedido ID não definido!');
    
      cy.get('#dt-search-0').type(pedidoId);
      cy.contains('td', '1').parent('tr').within(() => {
        cy.contains('a', 'Apagar').click();
        cy.url().should('include', '/PedidoCompra/ApagarConfirmacao');
      });
      cy.contains('button', 'Apagar').click();
      cy.checkMessage('Pedido apagado com sucesso!');
    });

    it('should not create order without items', () => {
      cy.contains('a', 'Novo Pedido').click();
      cy.url().should('include', '/PedidoCompra/Criar');
      cy.get('select#FornecedorId').select('TANI IT CONSULTING LTDA');
      cy.contains('button', 'Salvar Pedido').click();
      cy.checkMessage('O pedido de compra deve conter pelo menos um item.');
    });

    it('should not create order without supplier', () => {
      cy.contains('a', 'Novo Pedido').click();
      cy.url().should('include', '/PedidoCompra/Criar');

      for (let i = 0; i < list.produtos.length; i++) {
        cy.contains('button', 'Adicionar Item').click();
        cy.get(`select[name="Itens[${i}].ProdutoId"]`).select(list.produtos[i].name);
        cy.get(`input[name="Itens[${i}].Quantidade"]`).clear().type(list.produtos[i].quantity);
        cy.get(`input[name="Itens[${i}].PrecoUnitario"]`).clear().type(list.produtos[i].price);
      }

      cy.contains('button', 'Salvar Pedido').click();
      cy.verifyErrorMessage('O Fornecedor é obrigatório.');
    });
  })
})