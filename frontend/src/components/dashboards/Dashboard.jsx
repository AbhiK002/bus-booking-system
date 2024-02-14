import React, { useEffect, useState } from 'react';
import axios from 'axios';
import configs from '../../config';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

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
        <div>
            <h1>My Dashboard</h1>
            {userDetails && (
                <div>
                    <h2>{userDetails.name}</h2>
                    <h3>{userDetails.email}</h3>
                    <button onClick={logOut}>LOG OUT</button>
                </div>
            )}
            <h1>My Bookings</h1>
            {userDetails && userDetails.bookings.map(booking => (
                <div key={booking._id}>
                    <p>Amount: {booking.amount}</p>
                    <p>Seat Number: {booking.seat_number}</p>
                    <button onClick={() => handleDeleteBooking(booking._id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}

export default Dashboard;
