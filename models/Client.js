const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Client = new Schema ({
    userSource: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    typeUser: {
        type: Schema.Types.ObjectId,
        ref: "typeuser",
        required: true
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
    password: {
        type: String,
        required: true
    }
})

mongoose.model("client", Client) 