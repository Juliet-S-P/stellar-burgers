/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Установка токенов авторизации
       */
      setAuthTokens(): Chainable<void>;
      
      /**
       * Очистка токенов авторизации
       */
      clearAuthTokens(): Chainable<void>;
      
      /**
       * Перетаскивание элемента
       */
      dragTo(selector: string): Chainable<Element>;
      
      /**
       * Добавление ингредиента в конструктор
       */
      addIngredientToConstructor(ingredientName: string): Chainable<void>;
      
      /**
       * Ожидание загрузки ингредиентов
       */
      waitForIngredients(): Chainable<void>;

      /**
       * Установка значения в localStorage
       */
      setLocalStorage(key: string, value: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('setLocalStorage', (key, value) => {
  cy.window().then((win) => {
    // Приведение типа для обхода проверки TypeScript
    const windowWithStorage = win as unknown as Window;
    windowWithStorage.localStorage.setItem(key, value);
  });
});

Cypress.Commands.add('setAuthTokens', () => {
  cy.setCookie('accessToken', 'test-access-token');
  cy.setLocalStorage('refreshToken', 'test-refresh-token');
});

Cypress.Commands.add('clearAuthTokens', () => {
  cy.clearCookies();
  cy.window().then((win) => {
    const windowWithStorage = win as unknown as Window;
    windowWithStorage.localStorage.clear();
  });
});

Cypress.Commands.add('dragTo', { prevSubject: 'element' }, (subject, selector) => {
  cy.wrap(subject).trigger('dragstart');
  cy.get(selector).trigger('drop');
  return cy.wrap(subject);
});

Cypress.Commands.add('addIngredientToConstructor', (ingredientName) => {
  cy.contains('p', ingredientName)
    .parent()
    .dragTo('[class*="constructor"]');
});

Cypress.Commands.add('waitForIngredients', () => {
  cy.intercept('GET', '**/api/ingredients').as('getIngredients');
  cy.wait('@getIngredients');
});

export {};
