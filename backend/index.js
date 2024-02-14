import express, { json } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

import { generateToken, verifyToken } from './middleware/authBBS.js';

import { LocationModel } from './models/Location.js';
import { User } from './models/User.js';
import { Bus } from './models/Bus.js';
import { Booking } from './models/Booking.js';
import { Seat } from './models/Seat.js';

dotenv.config();
const app = express();

// Get required environment variables
const PORT = process.env.PORT || 3000;
const DBI_URI_BBS = process.env.DBI_URI_BBS;

// To allow requests from different hosts
app.use(cors());

// Parse the body of an HTTP requests in the form of JSON
app.use(json());

// Connect to the database
mongoose.connect(DBI_URI_BBS).then(db => {
    console.info("Connected to Bus Booking Software")
}).catch(err => {
    console.log(err);
    console.error("Database connection failed: " + err.codeName + " (" + err.code + ")");
})

// ENDPOINTS
// General
app.get("/", (req, res) => {
    return res.status(200).json({
        message: "Bus Booking System API Active"
    })
})

let locationsCache = {};

app.get("/get-locations", (req, res) => {
    if (Object.keys(locationsCache).length !== 0) {
        // If cache is not empty, return locations from cache
        return res.status(200).json({
            locations: locationsCache,
            valid: true
        })
    }

    // If cache is empty, fetch locations from the database
    LocationModel.find().then((locations) => {

        // Fill the cache
        locations.forEach((location) => {
            let currLocationID = location._id.toString();
            locationsCache[currLocationID] = {
                name: location.name,
                distances: {}
            };
            location.distances.forEach(([destinationId, distance]) => {
                locationsCache[currLocationID].distances[destinationId.toString()] = distance;
            });
        });

        console.log("Locations cache populated successfully");
        return res.status(200).json({
            locations: locationsCache,
            valid: true
        });
    }).catch((err) => {
        console.error("Error fetching locations");
        return res.status(500).json({
            message: "Server error",
            valid: false
        });
    });
});

app.get("/get-buses", (req, res) => {
    const { from, to } = req.body;

    let query = {};
    if (from && to) {
        query = { from, to };
    } else if (from) {
        query = { from };
    } else if (to) {
        query = { to };
    }

    Bus.find(query, "name description seats seats_occupied from to departure arrival")
    .then((buses) => {
        res.status(200).json({ buses, valid: true });
    })
    .catch((err) => {
        console.error("Error fetching buses");
        res.status(500).json({ message: "Server error", valid: false });
    });
});

app.get("/get-bus-details", verifyToken, (req, res) => {
    const { busId } = req.body;

    if (!busId) {
        return res.status(409).json({
            message: "missing required fields",
            required: ["busId"],
            valid: false
        })
    }

    const tokenUserId = req.tokenUserId;

    if (tokenUserId) {
        User.findById(tokenUserId)
        .then(user => {
            if (user) {
                Bus.findById(busId)
                .then(bus => {
                    Seat.find({ bus: busId })
                    .then(seats => {
                        let seatMap = {};
                        for (let i=0; i<seats.length; i++) {
                            seatMap[seats[i].seat_number] = { price: seats[i].price, available: seats[i].available }
                        }
                        return res.status(200).json({ message: "Bus details fetched", bus: { ...bus.toObject(), seat_details: seatMap }, valid: true });
                    })
                    .catch(err => {
                        console.error("Error while fetching seats");
                        return res.status(500).json({ message: "Error while fetching seats", valid: false })
                    })
                })
                .catch(err => {
                    console.error("Error while fetching bus");
                    return res.status(500).json({ message: "Error while fetching bus", valid: false })
                })
            }
            else {
                return res.status(404).json({ message: "User not found, Unauthorized access", valid: false })
            }
        })
        .catch(err => {
            console.error("Error finding user");
            return res.status(500).json({ message: "Server error", valid: false})
        })
    }
    else {
        console.error("Unauthorized access");
        return res.status(403).json({ message: "Unauthorized access", valid: false })
    }
})

app.post("/confirm-booking", verifyToken, (req, res) => {

})

app.delete("/delete-booking", verifyToken, (req, res) => {
    
})

// Authentication
app.post("/register", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const location = req.body.location;

    if (!(name && email && password)) {
        return res.status(409).json({
            message: "missing required fields",
            fields_required: ["name", "email", "password"],
            valid: false
        })
    }

    bcrypt.hash(password, 10, (error, hashedPassword) => {
        if (error) {
            return res.status(500).json({
                message: "Register Failed (hash error)",
                valid: false
            })
        }

        User.create({
            name: name,
            email: email,
            admin: false,
            password: hashedPassword,
            location: location ? location : ""
        })
            .then((data) => {
                generateToken(data._id, (err, token) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Server error",
                            valid: false
                        })
                    }
                    if (token) {
                        return res.status(201).json({
                            message: "Registered Successfully",
                            user_created: data,
                            token: token,
                            valid: true
                        })
                    }
                    else {
                        return res.status(201).json({
                            message: "Registered Successfully, Please login",
                            user_created: data,
                            token: false,
                            valid: true
                        })
                    }
                })
            })
            .catch((err) => {
                let message = "";

                switch (String(err.code)) {
                    case "11000": message = "Email already registered"; break;
                    default: message = "Some Error Occurred"; break;
                }

                return res.status(409).json({
                    errcode: err.code,
                    message: message,
                    valid: false
                })
            })
    })
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!(email && password)) {
        return res.status(400).json({
            message: "Missing required fields",
            fields_required: ["email", "password"],
            valid: false
        });
    }

    User.findOne({
        email: email
    })
        .then((user) => {
            if (!user) {
                return res.status(404).json({
                    message: "Invalid Login Credentials",
                    valid: false
                })
            }

            bcrypt.compare(password, user.password)
                .then((isMatch) => {
                    if (isMatch) {
                        generateToken(user._id, (err, token) => {
                            if (err) { // error while token generation
                                return res.status(500).json({
                                    message: "Server Error: Login failed (tkn gen)",
                                    valid: false
                                })
                            }
                            if (token) {  // token generated successfully
                                return res.status(202).json({
                                    message: "Login Successful",
                                    user: {
                                        _id: user._id,
                                        name: user.name,
                                        email: user.email,
                                        location: user.location,
                                        admin: user.admin
                                    },
                                    token: token,
                                    valid: true
                                })
                            }
                            else { // token generation failed -> user login failed
                                return res.status(500).json({
                                    message: "Server Error: Login failed (tkn)",
                                    token: false,
                                    valid: false
                                })
                            }
                        })
                    }
                    else {  // hashes dont match, wrong password
                        return res.status(401).json({
                            message: "Invalid Credentials",
                            valid: false
                        })
                    }
                })
                .catch((err) => { // error while comparing password hashes
                    return res.status(500).json({
                        message: "Server Error: Login failed (psw)",
                        valid: false
                    })
                })
        })
        .catch((err) => {  // error while finding a user with given username
            return res.status(500).json({
                message: "Server Error: Login failed (db)",
                valid: false
            })
        })
});

app.post("/autologin", verifyToken, (req, res) => {
    const tokenUserId = req.tokenUserId;

    if (tokenUserId) {
        User.findById(tokenUserId)
            .then((user) => {
                const [statusCode, message] = user ? [202, "User auto logged in successfully"] : [401, "User auto login failed"];
                console.info(message);
                return res.status(statusCode).json({
                    message: message,
                    user: user ? {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        location: user.location,
                        admin: user.admin
                    } : null,
                    valid: user ? true : false
                })
            })
            .catch((err) => {
                console.error("Auto login failed");
                return res.status(401).json({
                    message: "user auto login failed: invalid user ID",
                    valid: false
                })
            })
    }
    else {
        console.error("Auto login failed");
        res.status(401).json({
            message: "user login failed",
            valid: false
        })
    }
})

// Admin
app.post("/add-bus", verifyToken, (req, res) => {
    const { name, description, seats, days_of_operation, from, to, departure, arrival, seating_plan, seating_prices } = req.body;

    if (!(name && seats && days_of_operation && from && to && departure && arrival && seating_plan)) {
        return res.status(409).json({
            message: "missing required fields",
            fields_required: ["name", "seats", "days_of_operation", "from", "to", "departure", "arrival", "seating_plan"],
            valid: false
        });
    }

    const userIdFromToken = req.tokenUserId;

    // Check if user is an admin
    User.findById(userIdFromToken)
        .then((user) => {
            if (!user || !user.admin) {
                return res.status(403).json({ message: "Unauthorized Access", valid: false });
            }

            // User is an admin, add the bus
            Bus.create({
                name,
                description: description || "",
                seats,
                seats_occupied: 0,
                days_of_operation,
                from,
                to,
                departure,
                arrival,
                seating_plan
            })
            .then((bus) => {
                const busId = bus._id;
                res.status(200).json({ message: "Bus added successfully", bus, valid: true });

                seating_plan.forEach((row, rowIndex) => {
                    row.forEach((seatNumber, columnIndex) => {
                        if (seatNumber != "") {
                            Seat.create({
                                seat_number: seatNumber,
                                price: seating_prices && seating_prices.length >= rowIndex+1 && seating_prices[rowIndex].length >= columnIndex+1 ? seating_prices[rowIndex][columnIndex] : 200,
                                bus: busId,
                                available: true
                            });
                        }
                    });
                });
                
            })
            .catch((err) => {
                console.error("Error adding bus");
                return res.status(500).json({ message: "Server error", valid: false });
            });
        })
        .catch((err) => {
            console.error("Error finding user");
            return res.status(500).json({ message: "Server error", valid: false });
        });
});

app.patch("/edit-bus", verifyToken, (req, res) => {
    const { id, name, description, days_of_operation, from, to, departure, arrival, seating_prices } = req.body;

    if (!(id && name && description && days_of_operation && from && to && departure && arrival)) {
        return res.status(409).json({
            message: "missing required fields",
            fields_required: ["id", "name", "description", "days_of_operation", "from", "to", "departure", "arrival"],
            valid: false
        });
    }

    const userIdFromToken = req.tokenUserId;

    // Check if user is an admin
    User.findById(userIdFromToken)
        .then((user) => {
            if (!user || !user.admin) {
                return res.status(403).json({ message: "Unauthorized Access", valid: false });
            }

            // User is an admin, edit the bus
            Bus.findByIdAndUpdate(id, {
                name,
                description: description,
                days_of_operation,
                from,
                to,
                departure,
                arrival
            }, {new: true})
            .then((bus) => {
                const busId = bus._id;
                
                const originalSeatingPlan = bus.seating_plan;
                if (!seating_prices || originalSeatingPlan.length !== seating_prices.length || originalSeatingPlan[0].length !== seating_prices[0].length) {
                    return res.status(409).json({ message: "You cannot edit the number of seats in a bus. Remaining details updated", bus, valid: true });
                }

                originalSeatingPlan.forEach((row, rowIndex) => {
                    row.forEach((seatNumber, columnIndex) => {
                        if (seatNumber != "") {
                            Seat.findOneAndUpdate({bus: busId, seat_number: seatNumber}, {
                                price: seating_prices[rowIndex][columnIndex]
                            }, {new: true}).then(data => {}).catch(err => console.error("Seat failed to update"));
                        }
                    });
                });
                
                return res.status(200).json({ message: "Bus edited successfully", bus, valid: true });
            })
            .catch((err) => {
                console.error("Error editing bus");
                return res.status(500).json({ message: "Server error", valid: false });
            });
        })
        .catch((err) => {
            console.error("Error finding user");
            return res.status(500).json({ message: "Server error", valid: false });
        });
});

app.delete("/delete-bus", verifyToken, (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(409).json({
            message: "missing required field",
            fields_required: ["id"],
            valid: false
        });
    }

    const userIdFromToken = req.tokenUserId;

    // Check if user is an admin
    User.findById(userIdFromToken)
        .then((user) => {
            if (!user || !user.admin) {
                return res.status(403).json({ message: "Unauthorized Access", valid: false });
            }

            // User is an admin, edit the bus
            Bus.findByIdAndDelete(id)
            .then((bus) => {
                Seat.deleteMany({
                    bus: id
                }).then(() => {
                    Booking.deleteMany({
                        bus: id
                    }).then(() => {
                        return res.status(200).json({ message: "Bus and all its bookings deleted successfully", bus, valid: true });
                    })
                })
            })
            .catch((err) => {
                console.error("Error deleting bus");
                return res.status(500).json({ message: "Server error", valid: false });
            });
        })
        .catch((err) => {
            console.error("Error finding user");
            return res.status(500).json({ message: "Server error", valid: false });
        });
});

app.get("/get-users", verifyToken, (req, res) => {
    const userIdFromToken = req.tokenUserId;

    User.findById(userIdFromToken)
        .then((user) => {
            if (!user || !user.admin) {
                return res.status(403).json({ message: "Unauthorized", valid: false });
            }

            // User is an admin, retrieve all users and their bookings
            User.find({}, "name email")
                .then((users) => {
                    let usersWithBookings = [];
                    for (let i=0; i<users.length; i++) {
                        Booking.find({ booked_by: user._id }, "amount seat_number createdAt").then((bookings) => {
                            usersWithBookings.push(
                                {
                                    name: users[i].name,
                                    email: users[i].email,
                                    bookings
                                }
                            );
                            if (i == users.length-1) {
                                return res.status(200).json({ users: usersWithBookings, valid: true });
                            }
                        });
                    }
                })
                .catch((err) => {
                    console.error("Error fetching users");
                    return res.status(500).json({ message: "Server error", valid: false });
                });
        })
        .catch((err) => {
            console.error("Error finding user");
            return res.status(500).json({ message: "Server error", valid: false });
        });
});

// PORT
app.listen(PORT, "0.0.0.0", () => {
    console.log("Listening to port " + PORT);
})