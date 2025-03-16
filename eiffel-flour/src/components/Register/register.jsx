import React, { useState } from 'react';
import { FaCheck, FaEye, FaEyeSlash } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from 'react-bootstrap'

import useToast from '../../hooks/useToast';

import './register.scss';

const Register = (props) => {
    const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPass: '' });
    const [checkbox, setCheckbox] = useState(false);
    const [errors, setErrors] = useState({ username: '', email: '', password: '', confirmPass: '' });
    //const [submitStatus, setSubmitStatus] = useState({ code: '', msg: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [usernameCheck, setUsernameCheck] = useState('');
    const [usernameAvailable, setUsernameAvailable] = useState(false);

    const { notify } = useToast();
    const navigate = useNavigate();

    const validateField = async (e) => {
        const fieldName = e.target.name;

        let isValid = true;
        const { email, password, confirmPass } = formData;
        const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
        const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        const value = formData[fieldName];

        // generic non-empty validation
        if (!value) {
            if (fieldName === 'confirmPass') {
                if (password !== '')
                    setErrors({ ...errors, confirmPass: "Confirm Password field can't be empty" });
                return false;
            }
            setErrors({ ...errors, [fieldName]: `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required` });
            return false;
        }
        if (fieldName === 'username') {
            setUsernameCheck('loading');
            try {
                const resp = await fetch(`http://localhost:3500/user/isUserAvailable/${value}`, {
                    method: 'GET'
                });
                if (resp.status === 200) {
                    setErrors({ ...errors, [fieldName]: 'Username is available' });
                    //e.target.setCustomValidity('');
                    isValid = true;
                    setUsernameAvailable(true);
                    setUsernameCheck('done');
                } else if (resp.status === 403) {
                    setErrors({ ...errors, [fieldName]: 'Username is already taken' });
                    //e.target.setCustomValidity('Username is already taken. Please try another');
                    isValid = false;
                    setUsernameAvailable(false);
                    setUsernameCheck('done');
                }
            } catch (err) {
                console.error(err);
            }
        }
        if (fieldName === 'email') {
            if (!emailPattern.test(email)) {
                setErrors({ ...errors, [fieldName]: 'Email Id is not valid' });
               // e.target.setCustomValidity('Please enter a valid email ID');
                isValid = false;
            }
        }
        else if (fieldName === 'password') {
            if (!passPattern.test(password)) {
                setErrors({ ...errors, [fieldName]: "Must be at least 8 characters, including lowercase & uppercase letters, numbers and special symbols (@$!%*?&)" });
               // e.target.setCustomValidity('Must be at least 8 characters, including lowercase & uppercase letters, numbers and special symbols (@$!%*?&)');
                isValid = false;
            }
        }
        else if (fieldName === 'confirmPass') {
            if (password !== confirmPass) {
                setErrors({ ...errors, [fieldName]: "Passwords don't match" });
               // e.target.setCustomValidity("Passwords don't match");
                isValid = false;
            }
        }

        return isValid;
    }

    const validateForm = async () => {
        const { username, email, password, confirmPass } = formData;
        const newErrors = { ...errors };

        const emailPattern = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/
        const passPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

        if (username === "") {
            newErrors.username = "Username is required"
        }
        else {
            // TO-DO
            // if (!checkIfAvailable(values.username)) {
            //   newErrors.username = "Username is not available";
            // }
            
        }
        if (email === "") {
            newErrors.email = "Email ID is required";
        }
        else if (!emailPattern.test(email)) {
            newErrors.email = "Email ID is not valid";
        }
        if (password === "") {
            newErrors.password = "Password is required";
        }
        else if (!passPattern.test(password)) {
            newErrors.email = "Password should contain a combination of at least 8 characters, including lowercase letters, uppercase letters, numbers and special symbols (@$!%*?&)";
        }
        else if (password !== confirmPass) {
            newErrors.confirmPass = "Passwords don't match";
        }

        setErrors(newErrors);
        return Object.values(newErrors).every(value => value === '');  // returns true if there are no errors
    }

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData({ ...formData, [name]: value.trim() });

        if (name === 'username') {
        // username should be in lowercase
            setFormData({ ...formData, username: value.toLowerCase() });
        }
        // reset errors as the user starts typing
        setErrors({ ...errors, [name]: '' });

        // reset username check status as user starts typing
        if (name === 'username') {
            setUsernameCheck('');
            setUsernameAvailable(false);
        }
        //setSubmitStatus({ code: '', msg: '' });
    }

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' || event.altKey) {
            validateField(event);
        }
    }

    const handleBlur = (event) => {
        validateField(event);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            // submit user data to server & create user
            try {
                const resp = await fetch('http://localhost:3500/user/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify(formData)
                });
                console.log(resp);
                if (resp.status !== 201) {
                   // setSubmitStatus({ code: '500', msg: "User registration failed" });
                    notify('error', 'User registration failed');
                    return;
                } else {
                    notify('success', 'User registered successfully.');
                    setTimeout(() => navigate('/login'), 2000);
                }
            } catch(err) {
                console.error(err);
            }
            console.log("User registered. SUCCESS!!");
         //   setSubmitStatus({ code: '201', msg: "User registered successfully" });
        } else {
            console.log("Validation failed. Please check the form");
          //  setSubmitStatus({ code: '403', msg: "Validation Failed" });
        }
    }

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    }

   

    return (
        <div className="register-container">
            <div className="register-form">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <div className='username-check form-input'>
                            <input type="text" id="username" name="username"
                                required
                                placeholder='JamesBond007'
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                onBlur={handleBlur}
                                value={formData.username}
                            />
                            {usernameCheck === 'loading' ? <Spinner size='sm' animation="border" /> : (
                                usernameCheck === '' ? <></> : (
                                    usernameAvailable ? <FaCheck /> : <span>X</span>
                                )
                            )}
                        </div>
                        {errors.username.trim() !== '' && <span className='input-hint'>{errors.username}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className='form-input' type="email" id="email" name="email"
                            required
                            placeholder='james.bond@misix.com'
                            pattern="[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$"
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            onBlur={handleBlur}
                            value={formData.email}
                        />
                        {errors.email.trim() !== '' && <span className='input-hint'>{errors.email}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className='form-input' type="password" id="password" name="password"
                            required
                            placeholder='Enter password'
                            pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}"
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                            onBlur={handleBlur}
                            value={formData.password}
                        />
                        {errors.password.trim() !== '' && <span className='input-hint'>{errors.password}</span>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Confirm Password</label>
                        <div id="confirm-pass" className='confirm-pass'>
                            <input className='form-input' type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPass"
                                required
                                pattern={formData.password}
                                placeholder='Re-enter password'
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                                onBlur={handleBlur}
                                value={formData.confirmPass}
                            />
                            <button type="button" onClick={togglePasswordVisibility}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        {errors.confirmPass.trim() !== '' && <span className='input-hint'>{errors.confirmPass}</span>}
                    </div>
                    <div className="register-form-check">
                        <input type="checkbox" id="terms" name="terms"
                            onChange={() => setCheckbox(!checkbox)}
                            value={checkbox}
                        />
                        <label htmlFor="terms">I Agree to the Terms & Conditions</label>
                    </div>
                    <button type="submit" className="register-button" disabled={!checkbox}>SIGN UP</button>
                    <div className="form-footer">
                        Already have an Account? <Link to="/login">Login Now!</Link>
                    </div>
                </form>
            </div>
            <footer className="form-footer">
                <p>© 2024 The Eiffel Flour - A French Patisserrie Brand</p>
            </footer>
            {/* {submitStatus.code === '201' ?
                <div className='success-msg'>
                    User Account created successfully
                </div>
                : submitStatus.code === '500' ?
                    <div className='failure-msg'>
                        {`User account couldn't be created ${submitStatus.msg}`}
                    </div>
                    : <></>
            } */}
        </div>
    );
};

export default Register;