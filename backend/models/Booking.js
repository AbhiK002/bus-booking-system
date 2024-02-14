import { Schema, model } from "mongoose";

const bookingSchema = new Schema({
    booked_by: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    bus: {
        type: String,
        required: true
    },
    seat_number: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

export const Booking = model("Booking", bookingSchema);