// load in NPM packages
const jwt = require('jsonwebtoken')
// load in other modules
const User = require('../models/user')

const auth = async (req, res, next) => {
    try {
        // grab the JWT token from the header and store in var
        const token = req.header('Authorization').replace('Bearer ', '')
        // check if the token is valid (created by our server, not expired)
        const decoded  = jwt.verify(token, process.env.JWT_SECRET)
        // looks for the user ID and then checks if the token matches
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })
        // no user found
        if (!user) {
            throw new Error()
        }
        // if a user is found, store the data from the DB onto the request
        req.user = user
        req.token = token
        // signify end of function
        next()
    } catch (error) {
        res.status(400).send({ error: 'Please authenticate.' })
    }
}

module.exports = auth