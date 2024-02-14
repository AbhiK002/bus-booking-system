import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import configs from '../config';
import './NavBar.css'

function NavBar({ userDetails }) {
    const userLoggedIn = userDetails._id != undefined || userDetails._id != null;
    const navigate = useNavigate();

    return (
        <nav className="navbar">
            <div className="navbar-logo" onClick={() => {
                navigate(configs.homePage)
            }}>
                BusGo
            </div>
            <div className="navbar-profile">
                <Link to={userLoggedIn ? (userDetails.admin ? configs.adminDashboardPage : configs.dashboardPage) : configs.loginPage}>{userLoggedIn ? "Dashboard" : "Login/Sign Up"}</Link>
            </div>
        </nav>
    );
};

export default NavBar;
