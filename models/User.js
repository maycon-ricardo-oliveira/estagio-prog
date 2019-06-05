const mongoose = require('mongoose')
const Schema = mongoose.Schema

const User = new Schema ({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin: {
        type: Schema.Types.ObjectId,
        ref: "typeuser",
        required: false
    },
    password: {
        type: String,
        required: true
    }
})

mongoose.model("user", User) 