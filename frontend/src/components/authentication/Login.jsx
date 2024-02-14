import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';

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
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button type="submit">Login</button>
                <button className='secondary' onClick={() => {
                    navigate(configs.registerPage);
                }} type="button">Register Instead</button>
            </form>
        </div>
    );
}

export default Login;
