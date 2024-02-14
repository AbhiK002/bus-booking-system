import { Schema, model } from "mongoose";

const busSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    seats: {
        type: Number,
        required: true
    },
    seats_occupied: {
        type: Number,
        required: true
    },
    days_of_operation: {
        type: String,
        required: true
    },
    from: {
        type: String,
        required: true
    },
    to: {
        type: String,
        required: true
    },
    departure: {
        type: Number,
        required: true
    },
    arrival: {
        type: Number,
        required: true
    },
    seating_plan: {
        type: Array,
        required: true
    }
})

export const Bus = model("Bus", busSchema);