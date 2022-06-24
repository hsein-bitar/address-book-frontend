import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message'

// zustand state store
import useStore from '../Store';


const AllContacts = () => {
    let navigate = useNavigate();
    let [message, setMessage] = useState({ message: "", theme: 0 });
    let [contacts, setContacts] = useState([]);

    // zustand state store
    const userToken = useStore(state => state.userToken)
    const setUserToken = useStore(state => state.setUserToken)

    const populateContacts = async () => {
        try {
            let response = await fetch('http://localhost:4000/api/contact/listcontacts', {
                method: 'get',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': userToken
                }),
            })
            let theme = response.status === 200 ? 0 : 1;
            let result = await response.json();
            console.log(result);
            if (response.status === 200) {
                setMessage({ message: 'Contacts retrieved', theme })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                }, 1500);
                setContacts(result)
            } else {
                setMessage({ message: 'You need to login', theme: 1 })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                    // if request fails assume token not valid, clear token from zustand
                    setUserToken('')
                    return navigate("/login");
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

    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
        populateContacts()
    }, [])



    return (
        <>
            <div className="contacts-container">
                <div className="gallery">
                    <Message {...message} />
                    {/* TODO display map, grid, and add links on the mapped contacts */}
                    {contacts.map((contact: any) => (<>
                        <div className="item">
                            <h3>
                                {contact.first_name}
                            </h3>
                            {contact.phone}
                            {contact.email}
                            {contact.last_name}
                            {contact.relation}
                        </div>
                        <div className="item">
                            <h3>
                                {contact.first_name}
                            </h3>
                            {contact.phone}
                            {contact.email}
                            {contact.last_name}
                            {contact.relation}
                        </div>
                        <div className="item">
                            <h3>
                                {contact.first_name}
                            </h3>
                            {contact.phone}
                            {contact.email}
                            {contact.last_name}
                            {contact.relation}
                        </div>
                        <div className="item">
                            <h3>
                                {contact.first_name}
                            </h3>
                            {contact.phone}
                            {contact.email}
                            {contact.last_name}
                            {contact.relation}
                        </div>
                        <div className="item">
                            <h3>
                                {contact.first_name}
                            </h3>
                            {contact.phone}
                            {contact.email}
                            {contact.last_name}
                            {contact.relation}
                        </div>
                    </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AllContacts