import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import App from './App';
import reportWebVitals from './reportWebVitals';
import Provider from './context/Provider';
import Register from './components/Register/register';
import Login from './components/Login/login';
import Navbar from './components/Navbar/navbar';
import CartPage from './components/cart/cartPage';
import Landing from './components/Landing/landing';
import { ToastContainer, Bounce } from 'react-toastify';


import './index.css';
import './assets/scss/main.scss';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(

    <Provider>
      <BrowserRouter>
      <App>
        <Navbar />
        <Routes>
          <Route index path='/' element={<Landing />} />
          <Route path='/register'  element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/cart' element={<CartPage />} />
        </Routes>

        <ToastContainer id="myContainer" 
            position='bottom-right'
            autoClose={5000}
            hideProgressBar={false}
            closeOnClick
            pauseOnHover={true}
            theme='light'
            transition={Bounce}
            limit={3} 
        />
      </App>
      </BrowserRouter>
    </Provider>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
