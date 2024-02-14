import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import configs from './config.js';

function Home() {
    let [locations, setLocations] = useState([]);
    let [buses, setBuses] = useState([]);
    let [fromLocation, setFromLocation] = useState('');
    let [toLocation, setToLocation] = useState('');
    let [filteredBuses, setFilteredBuses] = useState([]);

    useEffect(() => {
        // Fetch locations
        axios.get(configs.getBackendUrl('/get-locations'))
            .then(response => {
                setLocations(Object.values(response.data.locations));
            })
            .catch(error => {
                console.error('Error fetching locations:', error);
            });

        // Fetch all buses
        axios.get(configs.getBackendUrl('/get-buses'))
            .then(response => {
                setBuses(response.data.buses);
            })
            .catch(error => {
                console.error('Error fetching buses:', error);
            });
    }, []);

    useEffect(() => {
        // Filter buses based on selected locations
        if (fromLocation && toLocation) {
            const filtered = buses.filter(bus => bus.from === fromLocation && bus.to === toLocation);
            setFilteredBuses(filtered);
        } else if (fromLocation) {
            const filtered = buses.filter(bus => bus.from === fromLocation);
            setFilteredBuses(filtered);
        } else if (toLocation) {
            const filtered = buses.filter(bus => bus.to === toLocation);
            setFilteredBuses(filtered);
        } else {
            setFilteredBuses([]);
        }
    }, [fromLocation, toLocation, buses]);


    return (
        <div>
            <h1>Search Buses</h1>
            <div>
                <label htmlFor="from">From:</label>
                <select id="from" value={fromLocation} onChange={(e) => setFromLocation(e.target.value)}>
                    <option value="">Select From Location</option>
                    {locations ? locations.map(location => (
                        <option key={location._id} value={location._id}>{location.name}</option>
                    )) : null}
                </select>
                <label htmlFor="to">To:</label>
                <select id="to" value={toLocation} onChange={(e) => setToLocation(e.target.value)}>
                    <option value="">Select To Location</option>
                    {locations.map(location => (
                        <option key={location._id} value={location._id}>{location.name}</option>
                    ))}
                </select>
            </div>
            <h2>Available Buses</h2>
            <div>
                {filteredBuses.map(bus => (
                    <div key={bus._id}>
                        <h3>{bus.name}</h3>
                        <p>{bus.description}</p>
                        <p>Seats: {bus.seats}</p>
                        <p>From: {locations.find(loc => loc._id === bus.from).name}</p>
                        <p>To: {locations.find(loc => loc._id === bus.to).name}</p>
                        <p>Departure: {bus.departure}</p>
                        <p>Arrival: {bus.arrival}</p>
                        <Link to={`${configs.bookingPage}/${bus._id}`}>Book</Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
