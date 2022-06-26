import React, { useEffect, useState, FC, ReactElement } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message';

// zustand state store
import useStore from '../Store';



const Register: FC = (): ReactElement => {
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

    const register = async () => {
        try {
            let user = {
                first_name: (document.getElementById('register-first-name') as HTMLInputElement).value,
                last_name: (document.getElementById('register-last-name') as HTMLInputElement).value,
                email: (document.getElementById('register-email') as HTMLInputElement).value,
                password: (document.getElementById('register-password') as HTMLInputElement).value
            }
            let response = await fetch('http://localhost:4000/api/user/register', {
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
                setMessage({ message: 'Could not register', theme: 1 })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                }, 1500);
            }
        } catch (error) {
            setMessage({ message: "Error Occured", theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
                return navigate("/register");
            }, 1500);
            console.log(error);
        }
    }

    return (
        <>
            <div className="container">
                <Message {...message} />
                <form id="register-form" name="register-form" action="" >
                    <label htmlFor="first-name">Enter your first name:</label>
                    <input type="text" id="register-first-name" required />
                    <label htmlFor="last-name">Enter your last name:</label>
                    <input type="text" id="register-last-name" required />
                    <label htmlFor="email">Enter your email:</label>
                    <input type="email" id="register-email" required />
                    <label htmlFor="password">Password</label>
                    <input type="password" id="register-password" name="password" required />
                    <button onClick={() => register()} id="register-submit" className="primary" type="button"> Register</button>
                </form>
            </div>
        </>
    )
}

export default Register