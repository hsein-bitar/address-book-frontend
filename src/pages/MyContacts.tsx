import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message'
import ContactCard from '../components/ContactCard';

// icons
import { RiDeleteBin2Line, RiEditLine } from "react-icons/ri";

// color hash to give each relation its color
import ColorHash from 'color-hash';

// zustand state store
import useStore from '../Store';


// map component
import { MapDisplay } from '../components/MapDisplay';


const MyContacts = () => {
    let colorHash = new ColorHash();
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

    const [center, setCenter] = useState({
        lat: 33.88411310195422,
        lng: 35.517789903298635
    })

    // current contact and form fields state
    let [currentContactID, setCurrentContactID] = useState(''); // used in case a contact is being edited

    const [currentFirstName, setCurrentFirstName] = useState('');
    const [currentLastName, setCurrentLastName] = useState('');
    const [currentPhone, setCurrentPhone] = useState('');
    const [currentEmail, setCurrentEmail] = useState('');
    const [currentRelation, setCurrentRelation] = useState('Other');
    const [customRelation, setCustomRelation] = useState('');
    const [currentLocation, setCurrentLocation] = useState([]);
    let formReady = (currentFirstName && currentLastName && currentPhone && currentEmail && (currentRelation || customRelation) && currentLocation);


    const resetFormFieldsState = () => {
        setCurrentContactID('')
        setCurrentFirstName('')
        setCurrentLastName('')
        setCurrentPhone('')
        setCurrentEmail('')
        setCurrentRelation('Other')
        setCustomRelation('')
        setCurrentLocation([]);
        setShowForm(false)
    }
    const addContact = async () => {
        try {
            let uri = (currentContactID ? "http://localhost:4000/api/contact/updatecontact" : "http://localhost:4000/api/contact/addcontact");
            let data: any = {
                first_name: currentFirstName,
                last_name: currentLastName,
                phone: currentPhone,
                email: currentEmail,
                relation: (currentRelation !== 'Other') ? currentRelation : customRelation,
                // relation: currentRelation,
                location: {
                    type: "Point",
                    coordinates: currentLocation
                }
            }
            if (currentContactID) { data["target_id"] = String(currentContactID) }
            console.log(data);
            let response = await fetch(uri, {
                method: (currentContactID ? "put" : "post"),
                headers: new Headers({
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'x-auth-token': userToken
                }),
                body: JSON.stringify(data)
            })
            let theme = response.status === 200 ? 0 : 1;
            let result = await response.json();
            console.log(result);
            if (response.status === 200) {
                setMessage({ message: 'Contact saved', theme })
                setTimeout(() => {
                    setMessage({ message: "", theme: 0 })
                    setShowForm(false)
                    resetFormFieldsState()
                    populateContacts()
                }, 1500);
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
            }, 1500);
            console.log(error);
        }
    }

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
    const editContact = (contact: any) => {
        setCurrentContactID(contact._id)
        console.log("editing id:", contact._id);
        setCurrentFirstName(contact.first_name)
        setCurrentLastName(contact.last_name)
        setCurrentPhone(contact.phone)
        setCurrentEmail(contact.email)
        setCurrentRelation(contact.relation)
        setCustomRelation('')
        setCurrentLocation(contact.location.coordinates)
        setShowForm(true);
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
    // let displayedContacts = filterContacts(contacts, search, category)

    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
        populateContacts()
    }, [])


    return (
        <>
            <MapDisplay passed_contacts={showForm ? [] : filterContacts(contacts, search, category)} center={center} setCenter={setCenter} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
            <Message {...message} />
            <div className="contacts-container">
                {showForm &&
                    <form className="add-contact-form" >
                        <label htmlFor="first-name">First Name</label>
                        <input type="text" name="first-name" id="first-name" placeholder="Please enter contact first-name" value={currentFirstName} onChange={(e) => setCurrentFirstName(e.target.value)} />
                        <label htmlFor="last-name">Last Name</label>
                        <input type="text" name="last-name" id="last-name" placeholder="Please enter contact last-name" value={currentLastName} onChange={(e) => setCurrentLastName(e.target.value)} />
                        <input type="email" name="email" id="email" placeholder="Please enter contact email" value={currentEmail} onChange={(e) => setCurrentEmail(e.target.value)} />
                        <div className="horizontal">
                            <input type="tel" name="phone" id="phone" placeholder="Please enter contact phone" value={currentPhone} onChange={(e) => setCurrentPhone(e.target.value)} pattern="[0-9]+" />
                            <select name="category" id="category" defaultValue={currentRelation} onChange={(e) => setCurrentRelation(e.target.value)}>
                                <option>Other</option>
                                {[...categoryList].map((category: any) => <option>{category}</option>)}
                            </select>
                        </div>
                        {(currentRelation === "Other") && <input type="text" name="other-category" id="other-category" placeholder="Please enter your contact's relation" value={customRelation || ''} onChange={(e) => setCustomRelation(e.target.value)} />}

                        <label className={currentLocation[0] ? "active" : ""}>{currentLocation[0] ? "location ready, click on map to change" : "Click on map to choose contact's address"}</label>
                        <label className={formReady ? "active" : ""}>{formReady ? "contact ready to save" : "form still missing some fields"}</label>
                        <div className="horizontal">
                            <button type="button" disabled={!formReady} onClick={() => { addContact() }}> Save Contact</button>
                            <button type="button" onClick={() => resetFormFieldsState()}>Cancel</button>
                        </div>
                    </form>}
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
                            {filterContacts(contacts, search, category).map((contact: any) => (
                                <ContactCard contact={contact} deleteContact={deleteContact} editContact={editContact} setCenter={setCenter} />
                            ))}
                        </div>
                    </>}
            </div>
        </>
    )
}

export default MyContacts