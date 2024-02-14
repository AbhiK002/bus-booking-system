import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configs from '../../config';
import Dashboard from './Dashboard';

function AdminDashboard({ user, setUser }) {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);

    useEffect(() => {
        axios.get(configs.getBackendUrl("/get-buses"))
            .then(response => {
                if (response.data.valid) {
                    setBuses(response.data.buses);
                } else {
                    // Handle error
                    console.error("Failed to fetch buses");
                }
            })
            .catch(error => {
                // Handle error
                console.error("Failed to fetch buses", error);
            });
    }, []);

    return (
        <div className="admin-dashboard">
            <Dashboard user={user} setUser={setUser} />
            <h1>Buses</h1>
            <div className="buses-column">
                {buses.map(bus => (
                    <div key={bus._id} className="bus-card" onClick={() => handleBusClick(bus)}>
                        <h3>{bus.name}</h3>
                        <p>{bus.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;
