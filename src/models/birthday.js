const mongoose = require('mongoose')

const Birthday = mongoose.model('Birthday', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    date: {
        type: Date,
        required: true
    }
})

module.exports = Birthday