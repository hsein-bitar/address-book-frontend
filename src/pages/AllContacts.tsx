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
    // zustand state store
    const userToken = useStore(state => state.userToken)
    const setUserToken = useStore(state => state.setUserToken)

    // local contacts state
    let [contacts, setContacts]: [any, Function] = useState([]);
    let [search, setSearch] = useState('');
    let [category, setCategory] = useState('Any');
    let [categoryList, setCategoryList] = useState(new Set());
    let [currentContact, setCurrentContact] = useState([]);

    const [center, setCenter] = useState({
        lat: 33.90153392218487,
        lng: 35.44648839948142
    })




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
                setContacts(result);
                result.forEach((element: any) => {
                    setCategoryList(list => new Set([...list, element.relation]))
                });
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

    // render filtered contacts to DOM function
    let filterContacts = (contacts: [], search: string, category: string) => {
        let displayed_contacts: any = contacts;
        if (category && category !== 'Any') {
            displayed_contacts = displayed_contacts.filter((contact: any) => contact.relation === category);
        }
        if (search) {
            const regex = new RegExp(search, 'gi');
            displayed_contacts = displayed_contacts.filter((contact: any) => contact.first_name.match(regex) || contact.last_name.match(regex) || contact.email.match(regex) || contact.phone.match(regex));
        }
        setTimeout(() => {
            setCenter({ lat: displayedContacts[0].location.coordinates[0], lng: displayedContacts[0].location.coordinates[1] })
        }, 400)
        return displayed_contacts;
    }

    let displayedContacts = filterContacts(contacts, search, category)
    // let defaultCenter = { lat: displayedContacts[0].location.coordinates[0], lng: displayedContacts[0].location.coordinates[1] }

    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
        populateContacts()
    }, [])



    return (
        <>
            <MapDisplay passed_contacts={displayedContacts} center={center} setCenter={setCenter} />
            <Message {...message} />
            <div className="contacts-container">
                <input type="text" name="search" id="search" onChange={(e) => setSearch(e.target.value)} />
                <select name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
                    <option>Any</option>
                    {[...categoryList].map((category: any) => <option>{category}</option>)}
                </select>
                <div className="gallery">
                    {/* TODO display map, grid, and add links on the mapped contacts */}
                    {displayedContacts.map((contact: any) => (<>
                        <div key={contact._id} className="item">
                            <div className="icons-wrapper">
                                {<RiDeleteBin2Line onClick={() => deleteContact(contact._id)} />}
                                {<RiEditLine onClick={() => editContact(contact._id)} />}
                            </div>
                            <h3 onClick={() => setCenter({ lat: contact.location.coordinates[0], lng: contact.location.coordinates[1] })} className="contact-name">
                                {contact.first_name}
                            </h3>
                            <div className="contact-details">
                                <p>{contact.relation}</p>
                                <p>{contact.phone}</p>
                                <p>{contact.email}</p>
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