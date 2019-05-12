const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = new Schema ({
    typeClient: {
        type: Schema.Types.ObjectId,
        ref: "typeuser",
        required: false
    },
    address:{
        type: Schema.Types.ObjectId,
        ref: "clientaddress",
        required: false
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true
    },
    telephone: {
        type: String,
        required: true
    }
})

mongoose.model("client", Client) 