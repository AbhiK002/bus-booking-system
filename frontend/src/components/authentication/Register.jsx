import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';
import './LoginRegister.css'

function Register({ setUser }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name || !email || !password) {
            toast.error('All fields are required');
            return;
        }

        axios.post(configs.getBackendUrl('/register'), { name, email, password })
            .then((res) => {
                if (res.data.valid) {
                    toast.success(res.data.message);
                    setUser(res.data.user_created);
                    localStorage.setItem(configs.tokenKey, res.data.token);
                    navigate(configs.homePage);
                } else {
                    toast.error('Registration failed');
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    };

    return (
        <div className='inp-div'>
            <h2>Register</h2>
            <form className='inp-form' onSubmit={handleSubmit}>
                <label>Name:</label>
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                <div className="spacer"></div>
                <button type="submit">Register</button>
                <button className='secondary' onClick={() => {
                    navigate(configs.loginPage);
                }} type="button">Login Instead</button>
            </form>
        </div>
    );
}

export default Register;
