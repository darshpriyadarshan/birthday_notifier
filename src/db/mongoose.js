const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/birthday_app', {
    useNewUrlParser: true, //used as underlying mongodb deprecated
    useCreateIndex: true, //refer https://arunrajeevan.medium.com/understanding-mongoose-connection-options-2b6e73d96de1
    useFindAndModify: false
})
