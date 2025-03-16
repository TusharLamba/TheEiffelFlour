import React, { useCallback, useEffect, useState } from 'react';
import ItemCard from '../itemCard/ItemCard';
import { ItemFilter, ItemSearch, ItemSort } from '../common/utils';
import Spinner from 'react-bootstrap/Spinner';

import './itemGrid.scss';

const ItemGrid = (props) => {
    const [ displayItems, setDisplayItems ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ searchText, setSearchText ] = useState('');
    const [ sortType, setSortType ] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const resp = await fetch('http://localhost:3500/product/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await resp.json();
                console.log(data);
                if (!resp.ok || data.result.length === 0) {
                    throw new Error(data.message);
                }
                setIsLoading(false);
                setDisplayItems(data?.result);
            } catch (err) {
                console.error('Error in fetching data', err.message);
            }
        }
        // fetches the items to be displayed for order from API
        fetchData();
    }, []);

    const renderGridItems = useCallback(() => {
        let resultGrid = [...displayItems];
        // filter bases on searchText
        if (searchText.trim().length > 0)
            resultGrid = resultGrid.filter((item) => item.product_name?.indexOf(searchText) > -1 || item.description?.indexOf(searchText) > -1);

        // sort based on sortType
        if (sortType) {
            resultGrid = sortType === 'ASC' ?
                resultGrid.sort((a, b) => a.product_name.localeCompare(b.product_name))
            :   resultGrid.sort((a, b) => b.product_name.localeCompare(a.product_name));
        }
        // transform to jsx
        resultGrid = resultGrid.map((item, idx) => {
            return (
                <div className='menu-grid-item' key={`${item.product_name}-gItem-${idx}`}>
                    <ItemCard item={item} />
                </div>
            );
        });

        return resultGrid;
    }, [displayItems, searchText, sortType]);

    console.log()

    
    return (
        <div className='menu'>
            {isLoading ? 
                <Spinner animation='border' role='status'>
                    <span className='hidden'></span>
                </Spinner>
                :
                (<>
                    <div className='menu-header'>Baker Catalog</div>
                    <div className='grid-arrangers'>
                        <ItemSort setType={setSortType} />
                        <ItemFilter />
                        <ItemSearch search={searchText} setSearch={setSearchText} />
                    </div>
                    <div className='menu-grid-container'>
                        {renderGridItems()}
                    </div>
                </>)
            }
        </div>
    );
};

export default ItemGrid;