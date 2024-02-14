import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configs from './config.js';
import './Home.css'

function Home({locations, buses}) {
    let [fromLocation, setFromLocation] = useState('');
    let [toLocation, setToLocation] = useState('');
    let [filteredBuses, setFilteredBuses] = useState([]);

    function getCityName(_id) {
        if (Object.values(locations).length == 0) return "...";
        return locations[_id].name;
    }

    function getTime(number) {
        let hours = parseInt(parseInt(number) / 100);
        let minutes = parseInt(number) % 100;
        let mins = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        return (hours > 12 ? (hours-12) + ":" + mins + " PM" : hours + ":" + mins + " AM")
    }

    return (
    <>
        <div className='buses-results'>
            <h1>Available Buses</h1>
            <div className="home-buses">
                {
                    buses.map(bus => {
                        return <div className="bus-card">
                            <div className="bus-details">
                                <h2>{bus.name}</h2>
                                <h3>{bus.description}</h3>
                            </div>
                            <div className="bus-route">
                                <p>From: <span className='city'>{getCityName(bus.from)}</span></p>
                                <p>To: <span className='city'>{getCityName(bus.to)}</span></p>
                                <p>Departure: <span className='time'>{getTime(bus.departure)}</span></p>
                                <p>Arrival: <span className='time'>{getTime(bus.arrival)}</span></p>
                            </div>
                        </div>
                    })
                }
            </div>
        </div>
    </>
    );
}

export default Home;
