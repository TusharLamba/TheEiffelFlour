import React, { useState } from 'react';
import AddToCart from '../AddToCart/addToCart';
import { Placeholder } from 'react-bootstrap';

import { NoImageIcon } from '../common/icons';


import './itemCard.scss';

const ItemCard = ({ item }) => {

    const [ imageLoaded, setImageLoaded ] = useState(false);
    const [ imgUrl, setImgUrl ] = useState("http://via.placeholder.com/290x150?text=ImageCard");

    return (
        <div className='item-card'>
            <div className='item-card-header'>
                {!imageLoaded && imgUrl !== 'error' && (
                    <Placeholder as="div" animation="glow">
                        <Placeholder xs={12} className='img-placeholder' />
                    </Placeholder>
                )}
                {imgUrl !== 'error' ? (
                    <img className='item-card-image' 
                        src={imgUrl} 
                        alt={item.product_name}
                        onLoad={() => setImageLoaded(true)}
                        onError={() => setImgUrl('error')}
                    />
                ) : (
                    <NoImageIcon style={{ height: '100px', width: '100%' }} />
                )}
            </div>
            <div className='item-card-content'>
                <p className='name'>{item.product_name}</p>
                <p className='desc'>{item.description}</p>
            </div>
            <div className='item-card-footer'>
                <AddToCart item={item} />
            </div>
        </div>
    );
};

export default ItemCard;