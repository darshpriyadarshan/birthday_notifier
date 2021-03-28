//starting point for the app
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const userRouter = require('./routers/user')
const birthdayRouter = require('./routers/birthday')

require('./db/mongoose')//this ensures mongoose.js runs thereby connecting to db

const User = require('./models/user')//used for creating instances of model inside post
const Birthday = require('./models/birthday')

const app = express()
const port = process.env.PORT || 3000

const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')

app.set('view engine', 'ejs')
app.set('views', viewsPath)

app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(userRouter)
app.use(birthdayRouter)

app.get('/', (req,res) => {
    res.render('home.ejs')
})

app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

module.exports = app