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
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

})

module.exports = Birthday