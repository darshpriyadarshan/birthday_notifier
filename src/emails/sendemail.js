const Birthday = require('../models/birthday')
const cron = require('node-cron')
require('../db/mongoose')
const mailgun = require('mailgun-js')({ apiKey: process.env.API_KEY, domain: process.env.DOMAIN })

isTomorrow = (date, formatter) => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tDate = formatter.format(tomorrow)
    if(date==tDate)
        return true
    return false
}

cron.schedule('0 0 9 * * *', async function () {
    const formatter = new Intl.DateTimeFormat('en', { month: 'long', day: 'numeric' })
    const list = []
    const birthdays = await Birthday.find()
    for (const birthday of birthdays) {
        birthday.date2 = formatter.format(birthday.date)
        await birthday.populate('createdBy').execPopulate()
        if (isTomorrow(birthday.date2, formatter))
            list.push({ 'email': birthday.createdBy.email,
                        'senderName': birthday.createdBy.name,
                        'name': birthday.name,
                        'birthday': birthday.date2})
    }
    console.log(list)

    for(const item of list){
        const data = {
            from: 'Excited User <me@samples.mailgun.org>',
            to: item.email,
            subject: 'Reminder: ' + item.name + '\'s birthday is tomorrow',
            text: 'Hey ' + item.senderName + ' you have asked us to remind you of your friend ' + item.name + '\'s birthday.' +
                ' It\'s tomorrow on ' + item.birthday + '. Hope this helped.'
        }

        mailgun.messages().send(data, (error, body) => {
            console.log(body)
            console.log(error)
        })
    }
})



