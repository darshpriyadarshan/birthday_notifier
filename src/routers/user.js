const express = require('express')
const User = require('../models/user')
const methodOverride = require('method-override')
const auth = require('../middleware/auth')
const router = new express.Router()

router.use(methodOverride('_method'))

router.get('/register', (req, res) => {
    res.render('register')
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/register', async (req, res) => {
    try{
        const user = new User(req.body)
        const token = await user.generateAuthToken()
        user.save().then(() => {
            res.cookie('token', token, { sameSite: true});
            res.redirect('birthdays')
        }).catch((e) => {
            res.redirect('register')
        })
    } catch (e) {
        res.render('error', { error: "Email already exists" })
    }
})

router.post('/login', async (req, res) => {
    try {
        console.log("post /login")
        const user = await User.findByCred(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        user.save().then(() => {
            res.cookie('token', token, { sameSite: true });
            res.redirect('birthdays')
        }).catch((e) => {
            res.redirect('register')
        })
    } catch (e) {
        res.render('error', {error: "Email/Password is incorrect"})
    }

})

router.get('/logout', auth, async (req, res) => {
    try {
        //req.user.tokens has all the tokens, each as a separate document with _id and token fields
        req.user.tokens = req.user.tokens.filter((tokenobj) => {
            return tokenobj.token !== req.token //returns false for matching token there by removing it
        })
        await req.user.save()
        res.redirect('/')
    } catch (e) {
        res.redirect('login')
    }
})

router.post('/logoutall', auth, async (req, res) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.redirect('/')
    } catch (e) {
        res.redirect('login')
    }
})
module.exports = router