import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

// zustand state store
import useStore from '../Store';


const AllContacts = () => {
    let navigate = useNavigate();

    // zustand state store
    const userToken = useStore(state => state.userToken)
    const setUserToken = useStore(state => state.setUserToken)


    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
    }, [])

    // if request fails because token not valid, clear token from zustand


    return (
        <div>AllContacts</div>
    )
}

export default AllContacts