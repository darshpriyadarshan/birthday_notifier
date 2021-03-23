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

//this is called in both signup and login
userSchema.methods.generateAuthToken = async function () {
    const token = jwt.sign({ _id: this._id.toString() }, 'thisismynewcourse')
    this.tokens = this.tokens.concat({ token })
    await this.save()
    return token
}

//verify email password while logging in
userSchema.statics.findByCred = async (email, password) => {
    const user = await User.findOne({email})
    if(!user)
    {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch)
    {
        throw new Error('Unable to login')
    }
    return user
    console.log('success')
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