import React, { Component } from 'react';
import coverImage from '../../assets/images/brownie-cover.jpg'

import './coverBanner.scss';

class CoverBanner extends Component {
    render() {
        return (
            <div className="cover-banner">
                <img className="zoomed" src={coverImage} alt="Cover" />
            </div>
        );
    }
}

export default CoverBanner;