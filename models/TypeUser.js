const mongoose = require('mongoose')
const Schema = mongoose.Schema  

const TypeUser = new Schema ({
    name: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true
    },
    active: {
        type: Boolean,
        required: true
    }
})

mongoose.model("typeuser", TypeUser) 