const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true, //used as underlying mongodb deprecated
    useCreateIndex: true, //refer https://arunrajeevan.medium.com/understanding-mongoose-connection-options-2b6e73d96de1
    useFindAndModify: false
})
