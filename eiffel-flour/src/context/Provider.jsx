import React from 'react';
import { CartProvider } from './cart/cartContext';
import { AuthProvider } from './auth/authContext';

const Provider = ({ children }) => {
    return (
        <AuthProvider>
            <CartProvider>{children}</CartProvider>
        </AuthProvider>
    );
};

export default Provider;