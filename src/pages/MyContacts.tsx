import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"
// import components
import Message from '../components/Message'
import ContactCard from '../components/ContactCard';
import AddContactForm from '../components/AddContactForm';
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
    // used to center map when you click on a contact
    const [center, setCenter] = useState({
        lat: 33.88411310195422,
        lng: 35.517789903298635
    })
    // local contacts list and filters state
    let [contacts, setContacts]: [any, Function] = useState([]);
    let [search, setSearch] = useState('');
    let [category, setCategory] = useState('Any');
    let [categoryList, setCategoryList] = useState(new Set());
    let [showForm, setShowForm] = useState(false)

    let [currentContactID, setCurrentContactID] = useState(''); // used in case a contact is being edited
    // current contact and form fields state
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

    const populateContacts = async () => {
        try {
            let response = await fetch('http://localhost:4000/api/contact/listcontacts', {
                method: 'get',
                headers: new Headers({
                    'Content-Type': 'application/json', 'Accept': 'application/json',
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
            displayed_contacts = displayed_contacts.filter((contact: any) => contact.first_name.match(regex)
                || contact.last_name.match(regex)
                || contact.email.match(regex)
                || contact.phone.match(regex));
        }
        return displayed_contacts;
    }

    useEffect(() => {
        if (!userToken) {
            return navigate("/login");
        }
        populateContacts()
    }, [])

    let passToAddContactForm = {
        userToken, setMessage, setShowForm, populateContacts, currentContactID, currentFirstName, setCurrentFirstName, currentLastName, setCurrentLastName, currentEmail, setCurrentEmail, currentPhone, setCurrentPhone, currentRelation, setCurrentRelation, categoryList, customRelation, setCustomRelation, currentLocation, formReady, resetFormFieldsState
    }

    return (
        <>
            <Message {...message} />
            <MapDisplay passed_contacts={showForm ? [] : filterContacts(contacts, search, category)} center={center} setCenter={setCenter} currentLocation={currentLocation} setCurrentLocation={setCurrentLocation} />
            <div className="contacts-container">
                {/* add contact form */}
                {showForm &&
                    <AddContactForm {...passToAddContactForm} />}
                {/* search form with all contacts cards */}
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
                                <ContactCard userToken={userToken} populateContacts={populateContacts} setMessage={setMessage} contact={contact} editContact={editContact} setCenter={setCenter} />
                            ))}
                        </div>
                    </>}
            </div>
        </>
    )
}

export default MyContacts