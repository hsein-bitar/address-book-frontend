import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message'

// zustand state store
import useStore from '../Store';



const Login = () => {
    let navigate = useNavigate();
    let [message, setMessage] = useState({ message: "", theme: 0 });


    // zustand state store
    const userToken = useStore(state => state.userToken)
    const setUserToken = useStore(state => state.setUserToken)


    useEffect(() => {
        if (userToken) {
            return navigate("/allcontacts");
        }
    }, [])


    const login = async () => {
        try {
            let user = {
                email: (document.getElementById('login-email') as HTMLInputElement).value,
                password: (document.getElementById('login-password') as HTMLInputElement).value
            }
            let response = await fetch('http://localhost:4000/api/user/login', {
                method: 'post',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                }),
                body: JSON.stringify(user)
            })
            let theme = response.status === 200 ? 0 : 1;
            let result = await response.json();
            console.log(result.status);
            if (response.status === 200) {
                setMessage({ message: 'Logged In', theme })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                    return navigate("/allcontacts");
                }, 1500);
                await setUserToken(result)
            } else {
                setMessage({ message: 'Invalid Credentials', theme: 1 })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                }, 1500);
            }
        } catch (error) {
            setMessage({ message: "Error Occured", theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/login");
            }, 1500);
            console.log(error);
        }
    }


    return (
        <>
            <Message {...message} />
            {!userToken ?
                <form id="login-form" name="login-form" action="" noValidate>
                    <label htmlFor="email">Enter your email:</label>
                    <input type="email" id="login-email" required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="login-password" name="password" required />
                    <div className='button'>
                        <button onClick={() => login()} id="login-submit" className="primary" type="button"> Login</button>
                    </div>
                </form>
                : <></>}
        </>
    )
}

export default Login