import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configs from './config.js';
import './Home.css'

function Home({locations, buses}) {
    let [fromLocation, setFromLocation] = useState('any');
    let [toLocation, setToLocation] = useState('any');
    let [filteredBuses, setFilteredBuses] = useState([]);

    useEffect(() => {
        if (filteredBuses.length === 0) setFilteredBuses(buses);
    }, [buses])

    useEffect(() => {
        if (fromLocation !== 'any' && toLocation !== 'any') {
            let temp = buses.filter(bus => {
                return bus.from === fromLocation && bus.to === toLocation;
            })
            setFilteredBuses([...temp])
        }
        else if (fromLocation !== 'any') {
            let temp = buses.filter(bus => {
                return bus.from === fromLocation;
            })
            setFilteredBuses([...temp])
        }
        else if (toLocation !== 'any') {
            let temp = buses.filter(bus => {
                return bus.to === toLocation;
            })
            setFilteredBuses([...temp])
        }
        else {
            setFilteredBuses([...buses]);
        }
    }, [fromLocation, toLocation])

    let locationsList = Object.keys(locations);

    function getCityName(_id) {
        if (Object.values(locations).length == 0) return "...";
        return locations[_id].name;
    }

    function getDistanceBetweenCities(_id1, _id2) {
        return locations[_id1].distances[_id2];
    }

    function getTime(number) {
        let hours = parseInt(parseInt(number) / 100);
        let minutes = parseInt(number) % 100;
        let mins = minutes < 10 ? "0" + minutes.toString() : minutes.toString();
        return (hours > 12 ? (hours-12) + ":" + mins + " PM" : hours + ":" + mins + " AM")
    }

    return (
    <>
        <div className="bus-filters">
            <label htmlFor="from">From</label>
            <select name="from" defaultValue={fromLocation} onChange={(e) => {
                setFromLocation(e.target.value);
            }} id="from" className="bus-from-select">
                <option value={'any'}>Any</option>
                {
                    locationsList.length > 0 ?
                    locationsList.map(location => {
                        return <option value={location}>{getCityName(location)}</option>
                    }) :
                    null
                }
            </select>
            <label htmlFor="to">To</label>
            <select name="to" defaultValue={toLocation} onChange={(e) => {
                setToLocation(e.target.value);
            }} id="to" className="bus-to-select">
                <option value={'any'}>Any</option>
                {
                    locationsList.length > 0 ?
                    locationsList.map(location => {
                        return <option value={location}>{getCityName(location)}</option>
                    }) :
                    null
                }
            </select>
        </div>
        <div className='buses-results'>
            <h1>Available Buses</h1>
            <div className="home-buses">
                {
                    filteredBuses.length > 0 ?
                    filteredBuses.map(bus => {
                        return <div className="bus-card">
                            <div className="bus-details">
                                <h2>{bus.name}</h2>
                                <p>{bus.description}</p>
                                <span className='distance'>{getDistanceBetweenCities(bus.to, bus.from)}kms</span>
                            </div>
                            <div className="bus-route">
                                <p>From: <span className='city'>{getCityName(bus.from)}</span></p>
                                <p>To: <span className='city'>{getCityName(bus.to)}</span></p>
                                <p>Departure: <span className='time'>{getTime(bus.departure)}</span></p>
                                <p>Arrival: <span className='time'>{getTime(bus.arrival)}</span></p>
                            </div>
                        </div>
                    }) :
                    <h3 className='no-results'>No results found</h3>
                }
            </div>
        </div>
    </>
    );
}

export default Home;
