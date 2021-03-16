import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';

import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    const storageCart = localStorage.getItem('@RocketShoes:cart');
    if (storageCart) {
      return JSON.parse(storageCart);
    }
    return [];
  });

  function updateCart(cart: Product[]) {
    setCart(cart)
    localStorage.setItem('@RocketShoes:cart', JSON.stringify(cart))
  }

  const addProduct = async (productId: number) => {
    try {
      const { data: productStock } = await api
        .get<Pick<Product, 'amount'>>(`stock/${productId}`)
      const [findProduct] = cart.filter(product => product.id === productId)

      if (!findProduct && productStock.amount > 0) {
        const { data: newProduct } = await api.get<Omit<Product, 'amount'>>(`/products/${productId}`)
        const updatedCart = [...cart, { ...newProduct, amount: 1 }]
        updateCart(updatedCart)
        return;
      }

      if (findProduct.amount < productStock.amount) {
        const updatedCart = cart.map(item => {
          if (item.id === productId) item.amount += 1;
          return item
        })
        updateCart(updatedCart)
        return;
      }
      toast.error('Quantidade solicitada fora de estoque');

    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: number) => {
    try {
      const isPresent = cart.findIndex(product => product.id === productId)
      if (isPresent === -1) throw new Error()
      const updatedCart = cart.filter(product => product.id !== productId)
      updateCart(updatedCart)
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if(amount===0){
        throw new Error()
      }

      const [findProduct] = cart.filter(product => product.id === productId)
      const { data: productStock } = await api
        .get<Pick<Product, 'amount'>>(`stock/${productId}`)
      if (findProduct.amount + amount > productStock.amount) {
        toast.error('Quantidade solicitada fora de estoque');
        return
      }

      const updatedCart = cart.map(item => {
        if (item.id === productId) item.amount = amount;
        return item
      })
      updateCart(updatedCart)

    } catch {
      toast.error('Erro na alteração de quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
