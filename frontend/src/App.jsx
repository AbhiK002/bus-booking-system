import { useState } from 'react'
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

function App() {
  return (
    <>
      <NavBar />
      <main>
        <Routes>
          <Route path={configs.homePage} Component={Home} />
          <Route path={configs.registerPage} Component={Register} />
          <Route path={configs.loginPage} Component={Login} />
          <Route path={configs.dashboardPage} Component={Dashboard} />
          <Route path={configs.bookingPage} Component={Booking} />
          <Route path={configs.adminDashboardPage} Component={AdminDashboard} />
        </Routes>
      </main>
    </>
  )
}

export default App
