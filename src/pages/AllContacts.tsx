import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "./pages-styles.css"

import Message from '../components/Message'

// zustand state store
import useStore from '../Store';



// maps api and styles
import mapStyles from '../assets/mapStyles'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100vw',
    height: '100vh'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function MyComponent() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCZ4ItuDplIQWID2EVNY4n_YtY3c5nbua0"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map: any) {
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);
        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map: any) {
        setMap(null)
    }, [])

    return isLoaded ? (
        <div className="maps">
            <GoogleMap
                mapContainerClassName='map'
                // mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
            >
                { /* Child components, such as markers, info windows, etc. */}
                <></>
            </GoogleMap>
        </div>
    ) : <></>
}


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
            <MyComponent />
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