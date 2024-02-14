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
  let [locations, setLocations] = useState({});
  let [buses, setBuses] = useState([]);

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
  useEffect(() => {
    // Fetch locations
    axios.get(configs.getBackendUrl('/get-locations'))
        .then(response => {
            setLocations(response.data.locations);
        })
        .catch(error => {
            console.error('Error fetching locations:', error);
        });

    // Fetch all buses
    axios.get(configs.getBackendUrl('/get-buses'))
        .then(response => {
            setBuses(response.data.buses);
        })
        .catch(error => {
            console.error('Error fetching buses:', error);
        });
}, []);

  return (
    <>
      <ToastContainer />
      <NavBar userDetails={user} />
      <main>
        <Routes>
          <Route path={configs.homePage} element={<Home locations={locations} buses={buses} />} />
          <Route path={configs.registerPage} element={<Register setUser={setUser} />} />
          <Route path={configs.loginPage} element={<Login setUser={setUser} />} />
          <Route path={configs.dashboardPage} element={<Dashboard user={setUser} setUser={setUser} />} />
          <Route path={configs.bookingPage} Component={Booking} />
          <Route path={configs.adminDashboardPage} element={<AdminDashboard user={setUser} setUser={setUser} />} />
        </Routes>
      </main>
    </>
  )
}

export default App
