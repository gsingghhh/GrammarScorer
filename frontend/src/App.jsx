import React from 'react'
import { Routes, Route } from 'react-router-dom'
import UserRegister from './pages/UserRegsiter.jsx'
import UserLogin from './pages/UserLogin.jsx'
import Home from './pages/Home.jsx'

const App = () => {
  return (
    <Routes>
      <Route path = "/" element={<UserLogin/>} />
      <Route path="/register" element={<UserRegister />} />
      <Route path='/home' element={<Home/>} />
    </Routes>
    )
}

export default App