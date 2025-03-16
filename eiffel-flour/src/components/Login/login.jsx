import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import './login.scss';

const Login = () => {
    const [ credentials, setCredentials ] = useState({ username: '', password: ''});
    const [ showPassword, setShowPassword ] = useState(false);
    const [ submitStatus, setSubmitStatus ] = useState({ code: '', msg: '' });

    const handleChange = (e) => {
        const { value, name } = e.target;
        setCredentials({ ...credentials, [name]: value.trim() });
        if (name === 'username') {
            setCredentials({ ...credentials, username: value.toLowerCase() });
        }
    }

    const handleSubmit = (e) => {
        // call login api and get token (in cookie), if authenticated
        setSubmitStatus({ code: '200', msg: 'Login successful!!' });
        
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

    return (
        <div className="login-container">
            <div className="login-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username/Email</label>
                        <input type="text" id="username" name="username" 
                        onChange={handleChange}
                        value={credentials.username} />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <div id="login-pass" className='login-pass'>
                        <input type={showPassword ? 'text': 'password'} id="password" name="password"
                            onChange={handleChange}
                            value={credentials.confirmPass} />
                        <button type="button" onClick={togglePasswordVisibility}>
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        </div>
                    </div>
                    <button type="submit" className="login-button">SIGN IN</button>
                    <div className="form-footer">
                        <p>Don't have an Account? <Link to="/register">Register!</Link></p>
                    </div>
                </form>
            </div>
            <footer className="form-footer">
                <p>© 2024 The Eiffel Flour - A French Patisserrie Brand</p>
            </footer>
            { submitStatus.code === '200' ? 
                <div className='success-msg'>
                Login successfull!
                </div>
                : submitStatus.code.startsWith('4') || submitStatus.code.startsWith('5') ?
                <div className='failure-msg'>
                {`Login failed - ${submitStatus.msg}`}
                </div>
                : <></>
            }
        </div>
    );
};

export default Login;