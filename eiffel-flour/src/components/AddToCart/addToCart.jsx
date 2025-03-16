import React, { useContext, useState } from 'react';

import { FaMinus, FaPlus } from 'react-icons/fa';
import CartContext from '../../context/cart/cartContext';

import './addToCart.scss';

const AddToCart = ({ item }) => {
    
    const [ counter, setCounter ] = useState(item.quantity ? item.quantity: 0);
    const [ disabled, setDisabled ] = useState({ increment: false, decrement: false });
    const { cartIsReady, addItemToCart, removeItemFromCart } = useContext(CartContext);

    const incrementCounter = () => {
        const added = addItemToCart(item);
        if (added !== -1) {
            setDisabled({increment: false, decrement: false});
            setCounter((prev) => prev + 1);
        } else {
            setDisabled({increment: true});
        }
    };
    
    const decrementCounter = () => {
        const removed = removeItemFromCart(item);
        if (removed !== -1) {
            setDisabled({increment: false, decrement: false});
            setCounter((prev) => prev - 1);
        } else {
            setDisabled({decrement: true});
        }
    };

    return (
        <div className='addTo-cart'>
            {counter === 0 ?
                <button className='start-adding' onClick={incrementCounter}>Add+</button>
            : (
                <>
                    <button className='counter-btn dec-counter' onClick={decrementCounter} disabled={!cartIsReady || disabled.decrement}><FaMinus /></button>
                    <span className='count'>{counter}</span>
                    <button className='counter-btn inc-counter' onClick={incrementCounter} disabled={!cartIsReady || disabled.increment}><FaPlus /></button>
                </>
            )}
        </div>
    );
};

export default AddToCart;