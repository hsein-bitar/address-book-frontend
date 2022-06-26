import React from 'react'

// icons
import { RiDeleteBin2Line, RiEditLine } from "react-icons/ri";

// color hash to give each relation its color
import ColorHash from 'color-hash';


function ContactCard({ contact, deleteContact, editContact, setCenter }: any) {
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