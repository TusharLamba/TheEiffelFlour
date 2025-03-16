import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSortAlphaDown, FaSortAlphaUp } from 'react-icons/fa';

import './utils.scss';
import { ButtonGroup, Button } from 'react-bootstrap';

export const ItemFilter = (props) => {
    return (
        <div className='item-filter'>
            
        </div>
    );
};


export const ItemSort = ({ setType }) => {

    const ascBtn = useRef();
    const descBtn = useRef();

    const handleAscClick = (e) => {
        setType('ASC');
        
        if (ascBtn.current)
            ascBtn.current.style.background = '#5c636a';
        if (descBtn.current)
            descBtn.current.style.background = '#6c757d';
    }

    const handleDescClick = (e) => {
        setType('DESC');
        
        if (ascBtn.current)
            ascBtn.current.style.background = '#6c757d';
        if (descBtn.current)
            descBtn.current.style.background = '#5c636a';
    }

    return (
        <>
            <ButtonGroup className='item-sort' aria-label='Sort'>
                <button className='item-sort-asc btn btn-secondary' ref={ascBtn} onClick={handleAscClick}>
                    <FaSortAlphaDown />
                </button>
                <button className='item-sort-desc btn btn-secondary' ref={descBtn} onClick={handleDescClick}>
                    <FaSortAlphaUp />
                </button>
            </ButtonGroup>
        </>
    );
};


export const ItemSearch = (props) => {

    return (
        <div className='item-search'>
            <button className='item-search-btn'><FaSearch /></button>
            <input className='item-search-input'
                placeholder='Start typing to search...'
                type='text'
                value={props.value}
                onChange={e => props.setSearch(e.target.value)}
            />
            <button className='item-search-reset'>X</button>
        </div>
    );
};

export const LoginRegister = (props) => {
    const navigate = useNavigate();

    return (
        <div className='login-register'>
            <Button variant='primary' className='login-btn'    onClick={() => navigate('/login')}   >Login</Button>
            <Button variant='primary' className='register-btn' onClick={() => navigate('/register')}>Register</Button>
        </div>
    );
}