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
  
    // Captura o ID do pedido pela tabela/listagem
    cy.checkMessage('Pedido de compra cadastrado com sucesso!');
    cy.get('table tbody tr:first td').first().invoke('text').then(id => {
      const pedidoId = id.trim();
      if (!pedidoId) throw new Error('ID do pedido não encontrado!');
      Cypress.env('pedidoId', pedidoId);
      cy.log(`Pedido ID capturado no teste: ${pedidoId}`);
      cy.get('#dt-search-0').clear().type(pedidoId);
    });
  };

  const searchOrder = (pedidoId, buttonName) => {
    cy.get('#dt-search-0').clear().type(pedidoId);
    cy.contains('td', pedidoId).parent('tr').within(() => {
      cy.contains('a', buttonName).click();
    });
    if (buttonName === 'Apagar') {
      cy.url().should('include', `/PedidoCompra/ApagarConfirmacao/${pedidoId}`);
    } else {
      cy.url().should('include', `/PedidoCompra/Editar/${pedidoId}`);
    }
  }

  const sendOrderToApproval = (pedidoId) => {
    searchOrder(pedidoId, 'Editar');
    cy.contains('button', 'Enviar para Aprovação').click();
    cy.checkMessage('Pedido enviado para aprovação.');
  }

  describe('new order', () => {    
    it('create', () => {
      createOrder();
    });
    
    it('delete', () => {
      cy.then(() => {
        const pedidoId = Cypress.env('pedidoId');
        if (!pedidoId) throw new Error('Pedido ID não definido!');
    
        searchOrder(pedidoId, 'Apagar');
        cy.contains('button', 'Apagar').click();
        cy.checkMessage('Pedido apagado com sucesso!');
      });
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
  });

  describe('approve order', () => {
    it('repprove', () => {
      createOrder();
    
      cy.then(() => {
        const pedidoId = Cypress.env('pedidoId');
        if (!pedidoId) throw new Error('Pedido ID não definido!');
    
        sendOrderToApproval(pedidoId)
    
        cy.contains('a', 'Aguardando Aprovação').click();
        searchOrder(pedidoId, 'Aprovar/Recusar');
        cy.contains('button', 'Reprovar Pedido').click();
    
        searchOrder(pedidoId, 'Editar');
        cy.get('#status').should('include.text', 'Reprovado');
      });
    });

    it('approve', () => {
      const pedidoId = Cypress.env('pedidoId');
      if (!pedidoId) throw new Error('Pedido ID não definido!');
      sendOrderToApproval(pedidoId);
  
      cy.contains('a', 'Aguardando Aprovação').click();

      searchOrder(pedidoId, 'Aprovar/Recusar');

      cy.contains('button', 'Aprovar Pedido').click();
      cy.checkMessage('Pedido aprovado com sucesso!');
      cy.contains('a', 'Aprovados').click();

      searchOrder(pedidoId, 'Pagar');
      cy.get('#status').should('include.text', 'Aprovado');
    });
  });
});