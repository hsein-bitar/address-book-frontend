import React from 'react'

// please give me your feedback on passing this many props, it does clean the parent component but I feel like this is too much!
function AddContactForm({ userToken, setMessage, setShowForm, populateContacts, currentContactID, currentFirstName, setCurrentFirstName, currentLastName, setCurrentLastName, currentEmail, setCurrentEmail, currentPhone, setCurrentPhone, currentRelation, setCurrentRelation, categoryList, customRelation, setCustomRelation, currentLocation, formReady, resetFormFieldsState }: any) {


    const addContact = async () => {
        try {
            let uri = (currentContactID ? "http://localhost:4000/api/contact/updatecontact" : "http://localhost:4000/api/contact/addcontact");
            let data: any = {
                first_name: currentFirstName,
                last_name: currentLastName,
                phone: currentPhone,
                email: currentEmail,
                relation: (currentRelation !== 'Other') ? currentRelation : customRelation,
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