import { Schema, model } from "mongoose";

const seatSchema = new Schema({
    seat_number: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    bus: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    }
})

export const Seat = model("Seat", seatSchema);