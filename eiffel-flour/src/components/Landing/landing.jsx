import React from 'react';
import CoverBanner from './coverBanner';
import Footer from '../Footer/footer';
import ItemGrid from '../Grids/itemGrid';

import './landing.scss';

const Landing = (props) => {
    return (
        <div className="landingPage">
            <CoverBanner />
            <ItemGrid />
            <Footer />
        </div>
    );
};


export default Landing;