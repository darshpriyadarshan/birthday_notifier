const express = require('express')
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
const Birthday = require('../models/birthday')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.use(methodOverride('_method'))
router.use(bodyParser.urlencoded({ extended: false }));
router.use( (req, res, next) => {
    if (req.query._method == 'DELETE') {
        req.method = 'DELETE';
        req.url = req.path;
    }
    next();
});

router.post('/birthdays', auth, (req, res) => {
    console.log("post /birthdays")
    const birthday = new Birthday({
        ...req.body, //ES6 spread operator
        createdBy: req.user._id
    })
    birthday.save().then(() => {
        res.redirect('/birthdays')
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get('/birthdays', auth, async (req, res) => {
    try {
        console.log("get /birthdays")
        const birthdays = await Birthday.find({createdBy: req.user._id})
        const formatter = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' });

        if(!birthdays.length)
            console.log("No bday")
        else
        {
            birthdays.forEach((birthday) => {
                birthday.date2 = formatter.format(birthday.date)
            })
        }

        res.render("birthday", {birthdays: birthdays})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/birthdays/new', auth, (req, res) => {
    console.log("get /birthdays/new")
    res.render("newbirthday")
})

router.get('/birthdays/:id', auth, async (req, res) => {
    try {
        console.log("get /birthdays/:id")
        const birthday = await Birthday.findOne({ _id: req.params.id, createdBy: req.user._id})

        if (!birthday)
            console.log("No bday")
        res.render("showbirthday", {birthday: birthday})
    } catch (e) {
        res.status(400).send(e)
    }
})

router.get('/birthdays/:id/edit', auth, async (req, res) => {
    try {
        console.log("get /birthdays/:id/edit")
        const birthday = await Birthday.findOne({ _id: req.params.id, createdBy: req.user._id})

        if (!birthday)
            console.log("No bday")
        res.render("editbirthday", { birthday: birthday })
    } catch (e) {
        res.status(400).send(e)
    }
})
router.patch('/birthdays/:id', auth, async (req, res) => {
    try {
        console.log("patch /birthdays/:id")
        const birthday = await Birthday.findOneAndUpdate({ _id: req.params.id, 
                                                           createdBy: req.user._id}, 
                                                           req.body)
        if (!birthday)
            console.log("No bday")
        res.redirect("/birthdays")
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/birthdays/:id', auth, async (req, res) => {
    try {
        console.log("delete /birthdays/:id")
        const birthday = await Birthday.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id})

        if (!birthday) 
            console.log("No bday")
        res.redirect("/birthdays")
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router