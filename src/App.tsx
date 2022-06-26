
import './App.css';
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom';



// brand and user icon imports
import logo from './logo.svg'
import user_icon from './assets/user_icon.svg'

// pages imports
import Register from './pages/Register';
import Login from './pages/Login';
import AllContacts from './pages/MyContacts';

// zustand state store
import useStore from './Store';

// App functional component start
function App() {
  let navigate = useNavigate();

  // zustand state store
  const userToken = useStore(state => state.userToken)
  const setUserToken = useStore((state) => state.setUserToken)


  // let location = useLocation().pathname.slice(1);
  let first_name;
  try {
    if (userToken) first_name = JSON.parse(window.atob(userToken.split('.')[1])).first_name
  } catch (error) {
    console.log(error);
  }

  // removes token from state and localStorage
  const logout = () => {
    setUserToken('');
    return navigate("/login");
  }


  return (
    <div className="App">

      <header className="App-header">

        {/* brand logo */}
        <NavLink to={userToken ? "/allcontacts" : "/login"}>
          <div className="App-logo">
            <img src={logo} className="App-logo" alt="logo" />
          </div>
        </NavLink>

        {/* right side of header */}
        <div className="App-header-right">
          {!userToken && <NavLink to="/register">Register</NavLink>}
          {!userToken && <NavLink to="/login">Login</NavLink>}
          {/* {userToken && <NavLink to="/allcontacts">My Contacts</NavLink>} */}
          {userToken && <h5>Welcome to your contacts dashboard! <span className="capital">{first_name} </span> </h5>}
          <img src={user_icon} onClick={() => logout()} className={`user-icon ${userToken ? 'user-active' : ''}`} alt="user-icon" />
        </div>

      </header>

      <Routes>
        {<Route path="/register" element={<Register />} />}
        {<Route path="/login" element={<Login />} />}
        {<Route path="/" element={userToken ? <AllContacts /> : <Login />} />}
        {<Route path="/allcontacts" element={<AllContacts />} />}
      </Routes>
    </div >
  );
}

export default App;
