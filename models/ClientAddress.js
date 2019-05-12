const mongoose = require('mongoose')
const Schema   = mongoose.Schema

const ClientAddress = new Schema ({ 
    sourceClient: {
        type: Schema.Types.ObjectId,
        required: true
    },
    street: {
        type: String,
        required: false
    },
    district: {
        type: String,
        required: false
    },
    number: {
        type: String,
        required: false
    },
    complement: {
        type: String,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    estate: {
        type: String,
        required: false
    },
    cep: {
        type: String,
        required: false
    },
    latitude: {
        type: Number,
        required: false
    },
    longiture: {
        type: Number,
        required: false
    }
})

mongoose.model("clientaddress", ClientAddress)