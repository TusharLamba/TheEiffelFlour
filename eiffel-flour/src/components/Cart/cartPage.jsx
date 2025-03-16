import React, { useContext, useState } from 'react';
import CartContext from '../../context/cart/cartContext';
import { FaDumpster, FaDumpsterFire } from 'react-icons/fa';
import AddToCart from '../AddToCart/addToCart';
import { Spinner, Placeholder } from 'react-bootstrap';

import { NoImageIcon, TrashCanIcon } from '../common/icons';

import './cartPage.scss';


const CartPage = () => {

    const [ imgUrl, setImgUrl ] = useState('http://via.placeholder.com/290x150?text=ImageCard');

    const [ clearIcon, setClearIcon ] = useState('dumpster');
    const [ imageLoaded, setImageLoaded ] = useState(false);
    const { cartItems, cartIsReady, addItemToCart, removeItemFromCart, clearCart } = useContext(CartContext);


    const handleClearItemClick = (item) => {
        if (clearIcon === 'dumpster') {
            setClearIcon('dumpsterRed');
        } else {
            removeItemFromCart(item, true);
        }
    }

    const orderTotal = cartItems.reduce((total, ci) => {
        total += ci.price * ci.quantity;
        return total;
    }, 0);

    const delvFee = orderTotal > 500 ? Math.floor(0.1 * orderTotal): 70;

    const renderCartItemCards = () => {
        return cartItems.map((cItem, i) => {
            return (
                <>
                    <div key={`cart-${cItem.product_id}-${i}`} className='cart-item-card'>
                        <div className='cart-item-content'>
                            <div className='cart-item-img'>
                                {!imageLoaded && imgUrl !== 'error' && (
                                    <Placeholder as="div" animation="glow">
                                        <Placeholder xs={4} className='img-placeholder' />
                                    </Placeholder>
                                )}
                                { imgUrl !== 'error' ? (
                                    <img 
                                        src={imgUrl}
                                        alt={cItem.product_name} 
                                        onLoad={() => setImageLoaded(true)}
                                        onError={() => setImgUrl('error')}
                                    />
                                ): (
                                    <NoImageIcon style={{ height: '150px', maxWidth: '290px' }} />
                                )}
                            </div>
                            <div className='cart-item-info'>
                                <div className='item-metadata'>
                                    <p className='name'>{cItem.product_name}</p>
                                    <p className='description'>{cItem.description}</p>
                                    <p className='price'>&#x20B9; {cItem.price}</p>
                                </div>
                                <p className='quantity'><AddToCart item={cItem} /></p>
                            </div>
                        </div>
                        <div className='cart-item-action'> 
                            <div className='clear-cart-item' onClick={(e) => handleClearItemClick(cItem)}>
                                {clearIcon === 'dumpster' ? <TrashCanIcon style={{ height: '20px', width: '20px'}} /> : <TrashCanIcon style={{  height: '20px', width: '20px', color: 'red' }} />}
                            </div>
                        </div>
                    </div>
                    { i < cartItems.length-1 && <hr className='hr-dividor' /> }
                </>
            );
        })
    }


    return (
        <>
            {!cartIsReady ? ( <Spinner animation='border' role='status'></Spinner>)
            : (
                <div id='cartPage' className='cart-page'>
                    <div className='left-pane'>
                        <div className='cart-item-list'>
                            {renderCartItemCards()}
                        </div>
                    </div>
                    <div className='right-pane'>
                        <div className='order-details'>
                            <h3 className='title'>Order Details</h3>
                            <div className='order-item'>
                                <span>Bag total</span>
                                <span>&#x20B9; {orderTotal}</span>
                            </div>
                            <div className='order-item'>
                                <span>Bag discount</span>
                                <span>{}</span>
                            </div>
                            <div className='order-item'>
                                <span>Delivery Fee</span>
                                <span>{delvFee}</span>
                            </div>
                            <div className='order-total'>
                                <span>Order Total</span>
                                <span>{}</span>
                            </div>
                            <button className='order-checkout-btn'>Place Order</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default CartPage;