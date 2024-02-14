import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import './Dashboard.css'

function Dashboard({ user, setUser }) {
    const navigate = useNavigate();
    const logOut = () => {
        setUser({});
        localStorage.removeItem(configs.tokenKey);
        navigate(configs.homePage);
    }
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        axios.get(configs.getBackendUrl('/get-user-details'), {
            headers: {
                Authorization: localStorage.getItem(configs.tokenKey)
            }
        })
            .then((res) => {
                if (res.data.valid) {
                    setUserDetails(res.data.user);
                } else {
                    logOut();
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    }, [user]);

    const handleDeleteBooking = (bookingId) => {
        axios.delete(configs.getBackendUrl('/delete-booking'), {
            headers: {
                Authorization: localStorage.getItem(configs.tokenKey)
            },
            data: {
                bookingId: bookingId
            }
        })
            .then((res) => {
                if (res.data.valid) {
                    setUserDetails(prevState => {
                        const updatedBookings = prevState.bookings.filter(booking => booking._id !== bookingId);
                        return {
                            ...prevState,
                            bookings: updatedBookings
                        };
                    });
                } else {
                    toast.error(err.response?.data?.message);
                }
            })
            .catch((err) => {
                toast.error(err.response?.data?.message);
            });
    };

    return (
        <div className='dashboard-div'>
            <div className="profile">
                <h1>My Dashboard</h1>
                {userDetails && (
                    <div className='profile-details'>
                        <h2>{userDetails.name}</h2>
                        <h2>{userDetails.email}</h2>
                        <button className='critical logout' onClick={logOut}>LOG OUT</button>
                    </div>
                )}
            </div>
            <div className="bookings">
                <h1>My Bookings</h1>
                <div className="bookings-column">
                    {userDetails && userDetails.bookings.length > 0 ?
                     userDetails.bookings.map(booking => (
                        <div key={booking._id}>
                            <p>Amount: {booking.amount}</p>
                            <p>Seat Number: {booking.seat_number}</p>
                            <button className='critical' onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
                        </div>
                    )) : <h3 className='no-bookings'>You haven't made any bookings yet</h3>
                }
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
