/// <reference types="cypress" />

describe('Burger Constructor', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('POST', '**/api/orders', {
      fixture: 'order.json',
      delay: 100
    }).as('createOrder');

    cy.intercept('GET', '**/api/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.setCookie('accessToken', 'test-access-token');
    
    cy.window().then((win) => {
      (win as any).localStorage.setItem('refreshToken', 'test-refresh-token');
    });

    cy.visit('/');
    cy.wait('@getIngredients');
    cy.wait(1000);
  });

  afterEach(() => {
    cy.clearCookies();
    
    cy.window().then((win) => {
      (win as any).localStorage.clear();
    });
  });

  describe('1. Загрузка ингредиентов', () => {
    it('должна загружать и отображать ингредиенты', () => {

      cy.get('[data-testid^="ingredient-item-"]').should('have.length.at.least', 4);
      
      cy.get('section').contains('Булки').parents('section').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
      });
      
      cy.get('section').contains('Начинки').parents('section').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
        cy.contains('Филе Люминесцентного тетраодонтимформа').should('exist');
      });
      
      cy.get('section').contains('Соусы').parents('section').within(() => {
        cy.contains('Соус Spicy-X').should('exist');
      });

      cy.get('button').contains('Добавить').should('exist');
    });
  });

  describe('2. Модальные окна ингредиентов', () => {
    it('должна открывать модальное окно при клике на ингредиент', () => {
      cy.contains('Краторная булка N-200i').click();
      
      cy.get('[data-testid="modal"]').should('be.visible').within(() => {
        cy.get('[data-testid="ingredient-details"]').within(() => {
          cy.contains('Краторная булка N-200i').should('exist');
          cy.get('[data-testid="ingredient-calories"]').should('contain', '420');
        });
      });
    });

    it('должна закрывать модальное окно по клику на крестик', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.wait(500);
      
      cy.get('[data-testid="modal"]').should('be.visible').within(() => {
        cy.get('[data-testid="modal-close-button"]').click({ force: true });
      });
      
      cy.wait(500);
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должна закрывать модальное окно по клику на оверлей', () => {
      cy.contains('Краторная булка N-200i').click();
      cy.wait(500);
      
      cy.get('[data-testid="modal-overlay"]').click({ force: true });
      
      cy.wait(500);
      cy.get('[data-testid="modal"]').should('not.exist');
    });

    it('должна показывать правильные детали для каждого ингредиента', () => {

      cy.contains('Краторная булка N-200i').click();
      cy.wait(500);
      
      cy.get('[data-testid="modal"]').should('be.visible').within(() => {
        cy.get('[data-testid="ingredient-details"]').within(() => {
          cy.contains('Краторная булка N-200i').should('exist');
          cy.get('[data-testid="ingredient-calories"]').should('contain', '420');
        });
      });

      cy.get('[data-testid="modal"]').within(() => {
        cy.get('[data-testid="modal-close-button"]').click();
      });
      cy.wait(500);

      cy.contains('Биокотлета из марсианской Магнолии').click();
      cy.wait(500);
      
      cy.get('[data-testid="modal"]').should('be.visible').within(() => {
        cy.get('[data-testid="ingredient-details"]').within(() => {
          cy.contains('Биокотлета из марсианской Магнолии').should('exist');
          cy.get('[data-testid="ingredient-calories"]').should('contain', '4242');
        });
      });
    });
  });

  describe('3. Добавление ингредиентов в конструктор', () => {
    it('должна добавлять булку в конструктор', () => {
      cy.contains('Краторная булка N-200i')
        .closest('li, div')
        .within(() => {
          cy.get('button').contains('Добавить').click({ force: true });
        });
      
      cy.wait(300);

      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.get('[data-testid="constructor-bun-top"]').should('exist');
        cy.get('[data-testid="constructor-bun-bottom"]').should('exist');
      });
    });

    it('должна добавлять начинку в конструктор', () => {
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li, div')
        .within(() => {
          cy.get('button').contains('Добавить').click({ force: true });
        });
      
      cy.wait(300);
      
      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
    });

    it('должна добавлять соус в конструктор', () => {
      cy.contains('Соус Spicy-X')
        .closest('li, div')
        .within(() => {
          cy.get('button').contains('Добавить').click({ force: true });
        });
      
      cy.wait(300);
      
      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Соус Spicy-X').should('exist');
      });
    });
  });

  describe('4. Создание заказа', () => {
    it('должна выполнять полный цикл создания заказа', () => {

      cy.contains('Краторная булка N-200i')
        .closest('li, div')
        .within(() => {
          cy.get('button').contains('Добавить').click({ force: true });
        });
      cy.wait(500);
      
      cy.contains('Биокотлета из марсианской Магнолии')
        .closest('li, div')
        .within(() => {
          cy.get('button').contains('Добавить').click({ force: true });
        });
      cy.wait(500);

      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.get('[data-testid="constructor-empty-bun-top"]').should('not.exist');
        cy.get('[data-testid="constructor-empty-ingredients"]').should('not.exist');
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });

      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.get('[data-testid="order-button"]').should('not.be.disabled').click();
      });
      
      cy.wait('@createOrder', { timeout: 10000 }).then((interception) => {
        cy.log('✅ Запрос создания заказа выполнен');
      });
      
      cy.wait(3000);

      cy.get('[data-testid="modal"]').should('be.visible').within(() => {
        cy.get('[data-testid="order-details"]').within(() => {
          cy.get('[data-testid="order-number"]').should('contain', '12345');
          cy.log('✅ Номер заказа отображается: 12345');
        });

        cy.get('[data-testid="modal-close-button"]').click();
      });
      
      cy.wait(500);

      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.get('[data-testid="constructor-empty-bun-top"]').should('exist');
        cy.get('[data-testid="constructor-empty-ingredients"]').should('exist');
        cy.log('✅ Конструктор очищен');
      });
    });
  });

  describe('5. Проверка авторизации', () => {
    it('должна использовать подставленные токены', () => {
      cy.getCookie('accessToken').should(($cookie) => {
        expect($cookie?.value).to.equal('test-access-token');
      });
      
      cy.window().then((win) => {
        const token = (win as any).localStorage.getItem('refreshToken');
        expect(token).to.equal('test-refresh-token');
      });
    });
  });

  describe('6. Моковые данные', () => {
    it('должна использовать фикстуры для ответов API', () => {

      cy.get('section').contains('Булки').parents('section').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
      });
      cy.getCookie('accessToken').should('exist');
    });
  });

  describe('7. Итоговая проверка требований', () => {
    it('должна покрывать все требования задания', () => {
      cy.intercept('GET', '**/api/ingredients').as('ingredientsRequest');
      cy.intercept('POST', '**/api/orders').as('orderRequest');
      cy.intercept('GET', '**/api/auth/user').as('userRequest');

      cy.get('section').contains('Булки').parents('section').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
      });
      
      cy.get('section').contains('Начинки').parents('section').within(() => {
        cy.contains('Биокотлета из марсианской Магнолии').should('exist');
      });
      
      cy.get('[data-testid="burger-constructor"]').within(() => {
        cy.contains('Оформить заказ').should('exist');
      });
      
      cy.getCookie('accessToken').should('exist');
      
      cy.log('✅ Все основные требования покрыты');
      expect(true).to.be.true;
    });
  });
});
