const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ClientAddress = new Schema ({
    clientSource: {
        type: Schema.Types.ObjectId,
        ref: "client",
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
        type: String,
        required: false
    },
    longiture: {
        type: String,
        required: false
    }
})

mongoose.model("clientaddress", ClientAddress) 