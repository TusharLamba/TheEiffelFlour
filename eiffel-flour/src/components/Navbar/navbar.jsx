import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag } from 'react-icons/fa';
import { Badge } from 'react-bootstrap';
import { LoginRegister } from '../common/utils';

import './navbar.scss';
import CartContext from '../../context/cart/cartContext';

const Navbar = () => {

    const [showLogin, setShowLogin] = useState(false);
    const { cartItems } = useContext(CartContext);
    const navigate = useNavigate();

    const calculateTotalItems = () => {
        return cartItems.reduce((total, ci) => total + ci.quantity, 0);
    }

    const goToCart = () => {
        navigate("/cart");
    }

    return (
        <>
            <nav className="app-navbar">
                <div className="logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>The Eiffel Flour</div>
                <ul className="app-nav-links">
                    <li><Link className="app-nav-link" to="/About">Our Story</Link></li>
                    <li><Link className="app-nav-link" to="/Menu">Baker Catalog</Link></li>
                    <li><Link className="app-nav-link" to="/BulkOrders">Bulk orders</Link></li>
                    <li><Link className="app-nav-link" to="/Contact">Contact</Link></li>
                </ul>
                <div className="nav-icons">
                    <button className='nav-btn' aria-label="Shopping Cart" onClick={goToCart}>
                        <FaShoppingBag /><Badge className='shopping-bag-badge' bg='danger'>{calculateTotalItems() > 0 ? calculateTotalItems(): ''}</Badge>
                    </button>
                    <button className='nav-btn' aria-label="My Profile"
                        onMouseEnter={() => setShowLogin(true)}
                        onMouseLeave={() => setShowLogin(false)}
                        onClick={() => setShowLogin(true)}
                    >
                        {showLogin && <LoginRegister />}
                        <FaUser />
                    </button>
                </div>
            </nav>
        </>
    );
}

export default Navbar;