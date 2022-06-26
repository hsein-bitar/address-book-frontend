import React from 'react'

// icons
import { RiDeleteBin2Line, RiEditLine } from "react-icons/ri";


// color hash to give each relation its color
import ColorHash from 'color-hash';


function ContactCard({ populateContacts, userToken, setMessage, contact, editContact, setCenter }: any): JSX.Element {

    const deleteContact = async (contact_id: string) => {
        try {
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

    let colorHash = new ColorHash();
    return (
        <div key={contact._id} className="item" style={{ color: colorHash.hex(contact.relation), borderColor: colorHash.hex(contact.relation) }}>
            <div className="icons-wrapper">
                {<RiDeleteBin2Line onClick={() => deleteContact(contact._id)} />}
                {<RiEditLine onClick={() => editContact(contact)} />}
            </div>
            <h3 onClick={() => setCenter({ lat: contact.location.coordinates[0], lng: contact.location.coordinates[1] })} className="contact-name">
                {contact.first_name}
                <br />
                {contact.last_name}

            </h3>
            <div className="contact-details">
                <p>{contact.relation}</p>
                <p>{contact.phone}</p>
                <p>{contact.email}</p>
            </div>
        </div>
    )
}

export default ContactCard