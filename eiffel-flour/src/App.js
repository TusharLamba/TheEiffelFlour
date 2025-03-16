import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import 'react-toastify/dist/ReactToastify.css';

import './App.scss';

function useResetOnHotReload() {
  const navigate = useNavigate();

  useEffect(() => {
    if (module.hot) {
      module.hot.accept(() => {
        navigate('/');
      });
    }
  }, [navigate]);
}


const App = ({ children }) => {
  useResetOnHotReload();

  return (
    <div className='app'>
        {children}
    </div>
  )
}

export default App;