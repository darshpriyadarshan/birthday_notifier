const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//creating schema to access middleware
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
})

//virtual data for linked
userSchema.virtual('birthdays', {
    ref: 'Birthday',
    localField: '_id',
    foreignField: 'createdBy'
})

//this is called on instance hence methods
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET)
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

//this is called on Model hence statics
userSchema.statics.findByCred = async (email, password) => {
    const user = await User.findOne({email})
    if(!user)
        throw new Error('Unable to login')
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
        throw new Error('Unable to login')
    return user
}

//middleware for hashing
userSchema.pre('save', async function (next) {
    if(this.isModified('password'))
    {
        this.password = await bcrypt.hash(this.password, 8)
    }

    next()
})


const User = mongoose.model('User', userSchema)

module.exports = User //for other files to use