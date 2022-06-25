import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message'

// icons
import { RiDeleteBin2Line, RiEditLine } from "react-icons/ri";

// zustand state store
import useStore from '../Store';


// map component
import { MapDisplay } from '../components/MapDisplay';


import Contact from './Contact';


// const center = {
//     lat: 33.8938,
//     lng: 35.5018
// }


const deleteContact = (contact_id: string) => {
    console.log("deleted id:", contact_id);
}
const editContact = (contact_id: string) => {
    console.log("editing id:", contact_id);
}

const AllContacts = () => {
    let navigate = useNavigate();
    let [message, setMessage] = useState({ message: "", theme: 0 });

    // local contacts state
    let [contacts, setContacts] = useState([]);
    let [currentContact, setCurrentContact] = useState([]);
    const [center, setCenter] = useState({
        lat: 33.8938,
        lng: 35.5018
    })

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
            <MapDisplay passed_contacts={contacts} center={center} setCenter={setCenter} />
            <Message {...message} />
            <div className="contacts-container">
                <div className="gallery">
                    {/* TODO display map, grid, and add links on the mapped contacts */}
                    {contacts.map((contact: any) => (<>
                        <div key={contact._id} onClick={() => setCenter({ lat: contact.location.coordinates[0], lng: contact.location.coordinates[1] })} className="item">
                            <div className="icons-wrapper">
                                {<RiDeleteBin2Line onClick={() => deleteContact(contact._id)} />}
                                {<RiEditLine onClick={() => editContact(contact._id)} />}
                            </div>
                            <h3 className="contact-name">
                                {contact.first_name}
                            </h3>
                            <div className="contact-details">
                                <p>
                                    {contact.relation}
                                </p>
                                <p>
                                    {contact.phone}
                                </p>
                                <p>
                                    {contact.email}
                                </p>
                            </div>
                        </div>
                    </>
                    ))}
                </div>
            </div>
        </>
    )
}

export default AllContacts