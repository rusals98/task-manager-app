// load in NPM packages
const express = require('express')
// instead of adding code to connect to mongoose, just load in the file with this line of code
require('./db/mongoose')
// load in your routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// create the express app and store it in a variable
const app = express()

// parse any incoming JSON and store it in the req.body
app.use(express.json())

// register your routers with your express app
app.use(userRouter)
app.use(taskRouter)

module.exports = app
