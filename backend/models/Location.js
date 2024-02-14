import { Schema, model } from "mongoose";

const locationSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    distances: {
        type: Array,
        required: true
    }
})

export const LocationModel = model("Location", locationSchema);