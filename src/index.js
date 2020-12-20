// load in NPM packages
const express = require('express')
// instead of adding code to connect to mongoose, just load in the file with this line of code
require('./db/mongoose')
// load in your routers
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')

// create the express app and store it in a variable
const app = express()

// create port variable to start the app on 
const port = process.env.PORT

// // register express middleware function to "do something" before running a route 
// app.use((req, res, next) => {
//     if (req.method === 'GET') {
//         res.send('GET request are disabled!')
//     } else {
//         next()
//     }
// })

// // CHALLENGE: set up middleware function that will send "maintainence mode" message for all requests
// app.use((req, res, next) => {
//     res.status(503).send("Site is currently down. Please check back later!")
// })

// // USING THE MULTER NPM LIBRARY EXAMPLE
// const multer = require('multer')
// const upload = multer({
//     dest: 'images',
//     limits: {
//         fileSize: 1000000
//     },
//     fileFilter(req, file, cb) {
//         if (!file.originalname.endsWith('.pdf')) {
//             return cb(new Error('Please upload a PDF'))
//         }
//         cb(undefined, true)
//     }
// })
// app.post('/upload', upload.single('upload'), (req, res) => {
//     res.send()
// }, (error, req, res, next) => {
//     res.status(400).send({ error: error.message })
// })

// parse any incoming JSON and store it in the req.body
app.use(express.json())

// register your routers with your express app
app.use(userRouter)
app.use(taskRouter)

// configure the application to start on the registered port
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port)
})

// USE THE BCRYPT NPM LIBRARY 
// const bcrypt = require('bcryptjs')
// const myFunction = async () => {
//     const password = 'Red12345!'
//     // returns a promise
//     // first arg is password
//     // second arg is the number of rounds you want to hash the password
//     const hashedPassword = await bcrypt.hash(password, 8)
    
//     console.log(password)
//     console.log(hashedPassword)

//     // will be true if the user inputted password matches the hash
//     // will be false if the user inputted password doesn't match the hash
//     // const isMatch = await bcrypt.compare('Red12345!', hashedPassword)
//     // console.log(isMatch)
// }
// myFunction()

// USE THE JWTWEBTOKEN LIBRARY 
// const jwt = require('jsonwebtoken')
// const myFunction = async () => {
//     // create and store the authentication token using the sign method on JWT
//     // 1st arg: object that contains the data that is embedded in your token,
//     // usually some unique identification to identify the user
//     // 2nd arg: secret that is used to sign the token; any random series of chars
//     // 3rd arg: the expiration time of the JWT token
//     const token = jwt.sign({ _id: 'abc123' }, 'thisismynewcourse', { expiresIn: '7 days'})
//     console.log(token)

//     // verify that the JWT token using the same signature
//     // 1st arg: the token you are trying to verify
//     // 2nd arg: the secret that was used to create the token
//     const data = jwt.verify(token, 'thisismynewcourse')
//     console.log(data)
// }
// myFunction()

// // RETURN THE USER ASSOCIATED WITH A TASK
// const Task = require('./models/task')
// const main = async () => {
//     // find a task using the Task ID
//     const task = await Task.findById('5fcc74b9af3d4d20fc055740')
//     // populate allows us to retrieve the owner of the task using the "owner" property that exists on the Task model
//     await task.populate('owner').execPopulate()
//     // print the user
//     console.log(task.owner)
// }
// main() 

// // RETURN THE TASK(S) ASSOCIATED WITH A USER
// const User = require('./models/user')
// const main = async () => {
//     // find a user using the User ID
//     const user = await User.findById('5fcc72b9f064442850d8ffcb')
//     // populate allows us to retrieve all tasks from the virtual 'tasks' property on the User model 
//     await user.populate('tasks').execPopulate()
//     // print all task(s) 
//     console.log(user.tasks)
// }
// main() 