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


const MyContacts = () => {
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
    let [showForm, setShowForm] = useState(false)
    // let [currentContact, setCurrentContact] = useState([]);

    const [center, setCenter] = useState({
        lat: 33.88411310195422,
        lng: 35.517789903298635
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

    const deleteContact = async (contact_id: string) => {
        try {// remove from database
            let response = await fetch('http://localhost:4000/api/contact/deletecontact', {
                method: 'delete',
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': userToken
                }),
                body: JSON.stringify({
                    target_id: contact_id
                })
            })
            let theme = response.status === 200 ? 0 : 1;
            // let result = await response.json();
            if (response.status === 200) {
                setMessage({ message: 'Deleted contact', theme })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                }, 1500);
                populateContacts();
            } else {
                setMessage({ message: 'Could not delete', theme: 1 })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                }, 1500);
            }
        } catch (error) {
            console.log(error);
            setMessage({ message: 'Error occured', theme: 1 })
            setTimeout(() => {
                setMessage({ message: "", theme: 0 })
            }, 1500);
        }
    }
    const editContact = (contact_id: string) => {
        setShowForm(true);
        console.log("editing id:", contact_id);
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
        return displayed_contacts;
    }
    let displayedContacts = filterContacts(contacts, search, category)

    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
        populateContacts()
        // setInterval(() => {
        //     populateContacts()
        // }, 4000)
    }, [])


    return (
        <>
            <MapDisplay passed_contacts={displayedContacts} center={center} setCenter={setCenter} />
            <Message {...message} />
            <div className="contacts-container">
                <form className="add-contact-form" noValidate>

                    <input type="text" name="first-name" id="first-name" placeholder="Please enter your first-name" onChange={(e) => setSearch(e.target.value)} />
                    <div className="search-add">
                        <select name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
                            <option>Any</option>
                            {[...categoryList].map((category: any) => <option>{category}</option>)}
                        </select>
                        <button type="button" onClick={() => setShowForm(true)}> Save Contact</button>
                    </div>

                </form>
                {!showForm &&
                    <>
                        <div className="filters">
                            <div className="search-add">
                                <select name="category" id="category" onChange={(e) => setCategory(e.target.value)}>
                                    <option>Any</option>
                                    {[...categoryList].map((category: any) => <option>{category}</option>)}
                                </select>
                                <button type="button" onClick={() => setShowForm(true)}> Add Contact</button>
                            </div>
                            <input type="text" name="search" id="search" placeholder="Full text search" onChange={(e) => setSearch(e.target.value)} />
                        </div>
                        <div className="gallery">
                            {displayedContacts.map((contact: any) => (
                                <>
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
                    </>}
            </div>
        </>
    )
}

export default MyContacts