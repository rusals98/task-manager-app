// import NPM libaries
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
// load in modules
const Task = require('./task')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    }, 
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error("Age must be a positive number.")
            }
        }
    }, 
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
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
                throw new Error("Your password may not contain 'password.'")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
})

// virtual fields: are not actual data stored in the database, just the relationship between models
// 1st arg: name of our virtual field
// 2nd arg: object that establishes relationship with the field of another model
userSchema.virtual('tasks', {
    // name of the model you are connecting with
    ref: 'Task',
    // field on this model (user) that stores the data from the foriegnField
    localField: '_id',
    // field of the other model (task) that we grab
    foreignField: 'owner'
})

// new method to just return the user's data without private info 
userSchema.methods.toJSON = function () {
    // gives us access to the individual user 
    const user = this
    // just saves the user object in another variable
    const userObject = user.toObject()
    // delete private data from that new object replica
    delete userObject.password
    delete userObject.tokens
    // delete avatar from response since it is a large file to return
    delete userObject.avatar
    // returns the object replica to the user
    return userObject
}

// define new method to generate the JWT token for the user
// methods: methods available on the instances of the model
userSchema.methods.generateAuthToken = async function () {
    // gives us access to the individual user 
    const user = this
    // generate a JWT token using the user's ID (convert MongoDB objectID to string) 
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)
    // concats(adds) the token object into the array tokens property on the User model
    user.tokens = user.tokens.concat({ token: token})
    // save the token to the database using the middleware function below
    await user.save()
    // return the token
    return token
}

// set up a method that can be accessed on the model if called
// this method returns a user if the username/password is verified
// static: methods available on the model
userSchema.statics.findByCredentials = async (email, password) => {
    // find user by their email first
    const user = await User.findOne({ email })
    // if that email DNE, throw error
    if (!user) {
        throw new Error('Unable to login')
    }
    // if email is verified, check if the plaintext password === hashed password
    // first argument is the plaintext password the user inputted
    // second argument is the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password)
    // if passwords don't match, throw error
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    // if password is verified
    return user
}

// hash the plain text password before saving
userSchema.pre('save', async function (next) {
    // gives us access to the individual user 
    const user = this // cannot use arrow fucntion with "this" bindings
    
    // only hash the password if the user has modified the password using mongoose
    // will be true if a user is created and if a user is updated with a password change
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    // call next() to signify end of the middleware function
    next()
})

// remove all tasks after a user chooses to delete their profile
userSchema.pre('remove', async function (next) {
    const user = this
    // deletes every single task where the owner property equals the user's ID
    await Task.deleteMany({ owner: user._id })
    next()
})

const User = mongoose.model('User', userSchema)

// allow other files to import/use this file such as index.js
module.exports = User