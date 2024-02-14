import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'

function Login({ setUser }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            toast.error('Email and password are required');
            return;
        }

        axios.post(configs.getBackendUrl('/login'), { email, password })
            .then((res) => {
                if (res.data.valid) {
                    toast.success(res.data.message)
                    setUser(res.data.user);
                    localStorage.setItem(configs.tokenKey, res.data.token);
                    navigate(configs.homePage);
                } else {
                    toast.error('Invalid credentials');
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    };

    return (
        <div className='login-div'>
            <h1>Login</h1>
            <form className='login-form' onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className='spacer'></div>
                <button type="submit">Login</button>
                <button className='secondary' onClick={() => {
                    navigate(configs.registerPage);
                }} type="button">Register Instead</button>
            </form>
        </div>
    );
}

export default Login;
