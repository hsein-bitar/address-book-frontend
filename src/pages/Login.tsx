import React from 'react'
import "./pages-styles.css"

// state management
import useStore from '../Store';


const Login = () => {
    const setUserToken = useStore(state => state.setUserToken)

    return (
        <div>Login</div>
    )
}

export default Login