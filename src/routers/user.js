const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.get('/users', (req, res) => {
    res.render('signup.ejs')
})

router.get('/users/login', (req, res) => {
    res.render('login.ejs')
})

router.post('/users', async (req, res) => {
    console.log(req.body)
    const user = new User(req.body)
    const token = await user.generateAuthToken()
    user.save().then(() => {
        res.status(201).send({ user, token })
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.post('/users/login', async (req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCred(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }

})

module.exports = router