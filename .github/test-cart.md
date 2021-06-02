# Testes pages/Cart/index.tsx
- **should be able to increase/decrease a product amount**

    Para que esse teste passe você deve renderizar corretamente o valor da quantidade de cada produto adicionado ao carrinho e ser capaz de incrementar e decrementar os valores ao clicar

    no botões `<button *data-testid*="increment-product">` e `<button *data-testid*="decrement-product">` respect

- **should not be able to decrease a product amount when value is 1**

    Para que esse teste passe você deve desabilitar o botão `<button*data-testid*="decrement-product">` quando a quantidade do produto for igual a 1.

- **shoud be able to remove a product**

    Para que esse teste passe você deve ser capaz de remover o produto do carrinho ao clicar no botão `<button*data-testid*="remove-product">`
