const express = require('express')
const methodOverride = require('method-override')
const Birthday = require('../models/birthday')
const router = new express.Router()

router.use(methodOverride('_method'))

router.post('/birthdays', (req, res) => {
    console.log(req.body)
    const birthday = new Birthday(req.body)

    birthday.save().then(() => {
        res.redirect('/birthdays')
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get('/birthdays', async (req, res) => {

    const birthdays = await Birthday.find()
    if(!birthdays)
        console.log("No bday")
    res.render("birthday", {birthdays: birthdays})
})

router.get('/birthdays/new', (req, res) => {
    res.render("newbirthday")
})

router.get('/birthdays/:id', async (req, res) => {
    try {
        const birthday = await Birthday.findOne({ _id: req.params.id})

        if (!birthday)
            console.log("No bday")
        res.render("showbirthday", {birthday: birthday})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/birthdays/:id/edit', async (req, res) => {
    try {
        const birthday = await Birthday.findOne({ _id: req.params.id })

        if (!birthday)
            console.log("No bday")
        res.render("editbirthday", { birthday: birthday })
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch('/birthdays/:id', async (req, res) => {
    try {
        const birthday = await Birthday.findOneAndUpdate({ _id: req.params.id}, req.body)
        if (!birthday)
            console.log("No bday")
        res.redirect("/birthdays")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/birthdays/:id', async (req, res) => {
    try {
        const birthday = await Birthday.findOneAndDelete({ _id: req.params.id})

        if (!birthday) 
            console.log("No bday")
        res.redirect("/birthdays")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router