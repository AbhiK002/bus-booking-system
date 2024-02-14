import { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home from './Home'
import Register from './components/authentication/Register'
import Login from './components/authentication/Login'
import Dashboard from './components/dashboards/Dashboard'
import AdminDashboard from './components/dashboards/AdminDashboard'
import Booking from './components/Booking'
import NavBar from './components/NavBar'
import configs from './config.js'
import axios from 'axios';

function App() {
  let [user, setUser] = useState({});

  useEffect(() => {
    const token = localStorage.getItem(configs.tokenKey);
    if (token) {
      axios.post(configs.getBackendUrl("/autologin"), {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          if (response.data.valid) {
            setUser(response.data.user);
          } else {
            localStorage.removeItem(configs.tokenKey);
          }
        })
        .catch(error => {
          localStorage.removeItem(configs.tokenKey);
        });
    }
  }, []);

  return (
    <>
      <ToastContainer />
      <NavBar userDetails={user} />
      <main>
        <Routes>
          <Route path={configs.homePage} Component={Home} />
          <Route path={configs.registerPage} Component={Register} />
          <Route path={configs.loginPage} Component={
            () => {
              return <Login setUser={setUser} />
            }
          } />
          <Route path={configs.dashboardPage} Component={
            () => {
              return <Dashboard user={setUser} setUser={setUser} />
            }
          } />
          <Route path={configs.bookingPage} Component={Booking} />
          <Route path={configs.adminDashboardPage} Component={
            () => {
              return <AdminDashboard user={setUser} setUser={setUser} />
            }
          } />
        </Routes>
      </main>
    </>
  )
}

export default App
