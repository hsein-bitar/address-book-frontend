import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';

import useStore from './Store';


// brand and user icon imports
import logo from './logo.svg'
import user_icon from './assets/user_icon.svg'

// pages imports
import NotFound from './pages/NotFound';

import Register from './pages/Register';
import Login from './pages/Login';

import Contact from './pages/Contact';
import AllContacts from './pages/AllContacts';


// App functional component start
function App() {
  const userToken = useStore(state => state.userToken)
  const resetToken = useStore((state) => state.setUserToken(''))

  let navigate = useNavigate();
  let location = useLocation().pathname.slice(1);


  // removes token from state and localStorage
  const logout = () => {
    resetToken();
    localStorage.removeItem('user_token');
    return navigate("/login");
  }


  return (
    <div className="App">
      <header className="App-header">
        <NavLink to="/">
          <img src={logo} className="App-logo" alt="logo" />
        </NavLink>

        <div className="App-header-right">
          {!userToken && <NavLink to="/register">Register</NavLink>}
          {!userToken && <NavLink to="/login">Login</NavLink>}
          {userToken && <NavLink to="/allcontacts">My Contacts</NavLink>}
          {/* {!userToken && <NavLink className={`${location === 'register' ? 'active' : ''}`} to="/register">Register</NavLink>}
          {!userToken && <NavLink className={`${location === 'login' ? 'active' : ''}`} to="/login">Login</NavLink>}
          {userToken && <NavLink className={`${location === 'create' ? 'active' : ''}`} to="/allcontacts">My Contacts</NavLink>} */}
          <img src={user_icon} onClick={() => logout()} className={`user-icon ${userToken ? 'user-active' : ''}`} alt="user-icon" />
        </div>
      </header>

      {/* render all components inside this */}
      <div className="container">
        <Routes>
          {<Route path="/register" element={<Register />} />}
          {<Route path="/login" element={<Login />} />}
          {<Route path="/" element={userToken ? <Login /> : <AllContacts />} />}
          {<Route path="/contact/:id" element={<Contact />} />}
          {<Route path="/allcontacts" element={<AllContacts />} />}
          {<Route path="*" element={<NotFound />} />}
        </Routes>
      </div>
    </div >
  );
}

export default App;
