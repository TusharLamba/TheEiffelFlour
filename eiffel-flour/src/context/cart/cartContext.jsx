import React, { createContext, useCallback, useState } from 'react';
import useToast from '../../hooks/useToast';


const CartContext = createContext();

// TODO: Implement persistent cart and update cart when user logs in 
// initial state
// const initialState = {
//     items: [],
//     cartIsReady: true,
// }

// const cartReducer = (state, action) => {
//     const { type, payload } = action;

//     switch(type) {
//         case 'UPDATE_CART': {
//             return {
//                 items: payload,
//                 cartIsReady: true
//             };
//         }
//         case 'DELETE_CART': {
//             return {
//                 ...initialState,
//                 cartIsReady: true
//             };
//         }

//         default: {
//             return state;
//         }
//     }
// }

export const CartProvider = ({ children }) => {

    //const [state, dispatch] = useReducer(cartReducer, initialState);
    const [cart, setCart] = useState({cartItems: [], cartIsReady: true});
    const { notify } = useToast();

    const fetchCart = async () => {
        setCart({...cart, cartIsReady: false});

        try {
            const response = await fetch('https://fakestoreapi.com/carts/1');
            const data = await response.json();
            setCart({items: data, cartIsReady: true});
        } catch (error) {
            console.error(error);
            // toast the error, like can't fetch exisiting cart items
            setCart({items: [], cartIsReady: true});
        }
    }

    const addItemToCart = (item) => {
        if (!cart.cartIsReady) {  // check how to use cartIsReady
            // do validation on incoming item
            return -1;
        }  
        const itemIndex = cart.cartItems.findIndex(i => i.product_name.trim() === item.product_name.trim());
        if (itemIndex > -1) {
            if (item.max_qty && cart.cartItems[itemIndex].quantity + 1 > item.max_qty) {
                // use some toast to show error message
                notify('error', 'Quantity exceeds maximum stock limit');
                return -1;
            }
            setCart(prev => {
                const updatedItems = [...prev.cartItems];
                updatedItems[itemIndex].quantity += 1;
                return {cartItems: updatedItems, cartIsReady: true};
            });
        } else {
            setCart(prev => ({cartItems: [...prev.cartItems, {...item, quantity: 1}], cartIsReady: true}));
        }
        
    };

    const removeItemFromCart = (item, completeRemoval) => {
        if (!cart.cartIsReady) {
            // use some toast to show error message
            console.log('removeItemFromCart: Cart is not ready');
            return -1;
        }
        const existingItemIdx = cart.cartItems.findIndex(i => i.product_name.trim() === item.product_name.trim());
        if (existingItemIdx === -1) {
            // use some toast to show error message
            notify('warn', 'Item not found in cart', {autoClose: 2000, pauseOnHover: false});
            console.log('removeItemFromCart: Item not found in cart');
            return -1;
        }
        // reduce quantity by 1 if completeRemoval flag is not set
        if (!completeRemoval && cart.cartItems[existingItemIdx].quantity > 1) {
            setCart(prev => {
                const updatedItems = [...prev.cartItems];
                updatedItems[existingItemIdx].quantity -= 1;
                return {cartItems: updatedItems, cartIsReady: true};
            });
        } else {
            setCart(prev => ({cartItems: prev.cartItems.filter(i => i.product_name.trim() !== item.product_name.trim()), cartIsReady: true}));
        }
    };

    const clearCart = () => {
        if (!cart.cartIsReady) {
            // use some toast to show error message
            return;
        }  
        setCart({items: [], cartIsReady: true});
    }

    const saveCart = async () => {
        if (!cart.cartIsReady) {
            // use some toast to show error message
            return;
        }
        try {
            const response = await fetch('https://fakestoreapi.com/carts/1', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(cart.items),
            });
            if (response.ok) {
                // use some toast to show success message
                notify('success', 'Cart saved successfully', {autoClose: 2000, pauseOnHover: false});

            } else {
                // use some toast to show error message
                notify('error', 'Failed to save cart', {autoClose: 2000, pauseOnHover: false});
            }
        } catch (error) {
            console.error(error);
            // use some toast to show error message
            notify('error', 'Failed to save cart', {autoClose: 2000, pauseOnHover: false});
        }
    }

    return (
        <CartContext.Provider value={{ ...cart, addItemToCart, removeItemFromCart, clearCart, saveCart }}>
            {children}
        </CartContext.Provider>
    );
}

export default CartContext;