import React from 'react'

// please give me your feedback on passing this many props, it does clean the parent component but I feel like this is too much!
function AddContactForm({ currentFirstName, setCurrentFirstName, currentLastName, setCurrentLastName, currentEmail, setCurrentEmail, currentPhone, setCurrentPhone, currentRelation, setCurrentRelation, categoryList, customRelation, setCustomRelation, currentLocation, formReady, addContact, resetFormFieldsState }: any) {
    return (
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
        </form>
    )
}

export default AddContactForm