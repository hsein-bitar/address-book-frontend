import React, { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';



// brand and user icon imports
import logo from './logo.svg'
import user_icon from './assets/user_icon.svg'

// pages imports
import NotFound from './pages/NotFound';

import Register from './pages/Register';
import Login from './pages/Login';

import Contact from './pages/Contact';
import AllContacts from './pages/AllContacts';


import useStore from './Store';
// App functional component start
function App() {
  let navigate = useNavigate();

  // zustand state store
  const userToken = useStore(state => state.userToken)
  const setUserToken = useStore((state) => state.setUserToken)


  // let location = useLocation().pathname.slice(1);


  // removes token from state and localStorage
  const logout = () => {
    setUserToken('');
    return navigate("/login");
  }

  // useEffect(() => {

  // }, [])


  return (
    <div className="App">
      <header className="App-header">
        <NavLink to={userToken ? "/allcontacts" : "/login"}>
          <div className="App-logo">
            <img src={logo} className="App-logo" alt="logo" />
            <h1>address</h1>
          </div>
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

      <div className="container">
        <Routes>
          {<Route path="/register" element={<Register />} />}
          {<Route path="/login" element={<Login />} />}
          {<Route path="/" element={userToken ? <AllContacts /> : <Login />} />}
          {<Route path="/contact/:id" element={<Contact />} />}
          {<Route path="/allcontacts" element={<AllContacts />} />}
          {<Route path="*" element={<NotFound />} />}
        </Routes>
      </div>
    </div >
  );
}

export default App;
