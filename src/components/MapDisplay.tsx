import React, { useEffect, useState, useCallback } from 'react'

// maps api and styles
import mapStyles from '../assets/mapStyles'
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';


export const MapDisplay = ({ passed_contacts, center, setCenter }: any) => {


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
                onLoad={onLoad}
                onUnmount={onUnmount}
                options={{ styles: mapStyles, disableDefaultUI: true, mapTypeControl: false, zoomControl: true, zoom: 12 }}
                onClick={(e) => {
                    console.log(e.latLng?.lat(), e.latLng?.lng())
                }}
            >
                <>
                    {passed_contacts.map((contact: any) => {
                        console.log(contact);
                        return (<Marker
                            onClick={() => setCenter({ lat: contact.location.coordinates[0], lng: contact.location.coordinates[1] })}
                            label={contact.first_name}
                            title={contact.first_name}
                            key={`marker${contact._id}`}
                            position={{ lat: contact.location.coordinates[0], lng: contact.location.coordinates[1] }}
                        // icon={{
                        //     url: `/skateboarding.svg`,
                        //     scaledSize: new window.google.maps.Size(25, 25)
                        // }}
                        />)
                    })}
                </>
            </GoogleMap>
        </div>
    ) : <></>
}
