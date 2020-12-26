// load in npm packages
const express = require('express')
const { JsonWebTokenError } = require('jsonwebtoken')
const { Mongoose } = require('mongoose')
const multer = require('multer')
const sharp = require('sharp')
// load in modules
const User = require('../models/user')
const auth = require('../middleware/auth')
const { request } = require('express')
const { sendWelcomeEmail, sendCancellationEmail } = require('../emails/account')
// create a new express router
const router = new express.Router()

// create an endpoint that clients can hit to create a user
router.post('/users', async (req, res) => {
    // create a new user with the parsed JSON
    const user = new User(req.body)

    // using async await
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }

    // // using promise chaining
    // user.save().then(() => {
    //     res.status(201).send(user)
    // }).catch((e) => {
    //     res.status(400).send(e)
    // })
})

// create a route that allows users to login
router.post('/users/login', async (req, res) => {
    try {
        // create our own custom method 'findByCredentials that will take the username/password
        // and try to return a user with those credentials if it exists in the database
        // this function is defind in src/models/user
        const user = await User.findByCredentials(req.body.email, req.body.password)

        // create another custom method to generate a JWT token on the instance of 'user' that 
        // was retrieved by the "findByCredentials" method
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

// create an endpoint that allows users to fetch their profile
router.get('/users/me', auth, async (req, res) => {
    // send back the user that sent the request
    res.send(req.user)
    // // using async await
    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // } catch (e) {
    //     res.status(500).send(e)
    // }
    
    // // using promise chaining
    // User.find({}).then((users) => {
    //     res.status(200).send(users)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

// // create an endpoint that clients can hit to fetch INDIVIDUAL users by ID
// router.get('/users/:id', async (req, res) => {
//     const _id = req.params.id

//     // using async await
//     try {
//         const user = await User.findById(_id)
//         if (!user) {
//             return res.status(404).send("No user was found!")
//         }
//         res.send(user)
//     } catch (e) {
//         res.status(500).send(e)
//     }

//     // // using promise chaining
//     // User.findById(_id).then((user) => {
//     //     // conditional logic if no user is found
//     //     if (!user) {
//     //         return res.status(404).send("No user was found!")
//     //     }
//     //     // if user is found
//     //     res.send(user)
//     // }).catch((e) => {
//     //     res.status(500).send(e)
//     // })
// })

// create an endpoint that clients can hit to update their account
router.patch('/users/me', auth, async (req, res) => {
    // CHECK IF THE FIELD(S) THE CLIENT IS TRYING TO UPDATE EXIST

    // Object.keys() method returns an array of a given object's own enumerable property names
    // Convert all updates from object -> array
    const updates = Object.keys(req.body)

    // Create array of the fields that the client is allowed to update
    const allowedUpdates = ['name', 'email', 'password', 'age']

    // The every() method tests whether all elements in the array pass the test implemented 
    // by the provided function and it returns a Boolean value.
    // Check if each field that the client is trying to update exists in allowedUpdates
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    })

    // if even one field the client is trying to update does not exist in allowedUpdates
    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" })
    }

    // if all the fields the client is trying to update exists in allowedUpdates
    try {
        // // new: makes sure that the returned record is the updated one
        // // runValidators: make sure that the updates meet validation requirements
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // // no longer need this since we aren't fetching user by id in the URL, but rather through the req obj
        // // that the auth middleware function generates
        // // refactored code that was added so middleware methods would run correctly
        // const user = await User.findById(req.params.id)

        updates.forEach((update) => {
            req.user[update] = req.body[update]
        })
        await req.user.save()

        // // removed because the user is garunteed to exist after implementing the JWT token which is used to login
        // if (!user) {
        //     return res.status(404).send()
        // }

        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

// create an endpoint that clients can hit to delete their account
router.delete('/users/me', auth, async (req, res) => {
    try {
        // // req.params.id: grabbed the ID from the URL of the request
        // // req.user._id: grabs the ID from the user object that we added to the request in the auth middleware function
        // const user = await User.findByIdAndDelete(req.user._id)
        // if (!user) {
        //     return res.status(404).send() 
        // }

        // replaces lines 150-153; uses the remove() method on the Mongoose document 
        await req.user.remove()
        sendCancellationEmail(req.user.email, req.user.name)
        // use 'req.user' instead of just 'user'
        res.send(req.user)
    } catch (e) {
       res.status(500).send()
    }
})

// create an endpoint that allows users to logout from just one session/device
router.post('/users/logout', auth, async(req, res) => {
    try {
        // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
        // set the tokens array equal to a filtered version of itself
        req.user.tokens = req.user.tokens.filter((token) => {
            // if not equal, return true (keep it in the tokens array)
            // if equal, return false (filter/remove that token)
            return token.token !== req.token
        })
        // save that user in the DB after removing the token from the tokens array
        await req.user.save()
        // send back 200 status code
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

// create an endpoint that allows users to logout from just one session/device
router.post('/users/logoutAll', auth, async(req, res) => {
    try {
        // The filter() method creates a new array with all elements that pass the test implemented by the provided function.
        // set the tokens array equal to an empty array (which deletes all the tokens for that user)
        req.user.tokens = []
        // save that user in the DB after removing the token from the tokens array
        await req.user.save()
        // send back 200 status code
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.endsWith('.jpg' || '.jpeg' || '.png')) {
            return cb(new Error('File type must be jpg, jpeg, or png!'))
        }
        cb(undefined, true)
    }
})

// endpoint that users can hit to CREATE/UPDATE the profile picture of their account
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    // reformat the image (size, file type) using the sharp NPM library
    const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
    // // store the file that the user uploads in the avatar field of the user DB
    req.user.avatar = buffer
    // save the function
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

// endpoint that users can hit to DELETE a profile picture for their account
router.delete('/users/me/avatar', auth, async (req, res) => {
    // deletes the avatar saved for the user by setting it to undefined
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

// endpoint that users can hit to FETCH a profile picture for their account
router.get('/users/:id/avatar', async (req, res) => {
    try {
        // find the user
        const user = await User.findById(req.params.id)
        // if the user or the user's avatar cannot be found
        if (!user || !user.avatar) {
            throw new Error()
        }
        // set response headers to tell the requestor what type of data they receive back
        res.set('Content-Type', 'image/png')
        // send the avatar image back to the user
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router