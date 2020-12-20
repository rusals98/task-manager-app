// import mongoose
const mongoose = require('mongoose')
const validator = require('validator')

// connect mongoose to your mongodb database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

// // define the model that you are working with
// // 1ST ARGUMENT: string name of your model
// // 2ND ARGUMENT: define all the fields for the model where you can set things
// // LIKE data type, validation, etc. using mongoose
// const User = mongoose.model('User', {
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     }, 
//     age: {
//         type: Number,
//         default: 0,
//         validate(value) {
//             if (value < 0) {
//                 throw new Error("Age must be a positive number.")
//             }
//         }
//     }, 
//     email: {
//         type: String,
//         required: true,
//         trim: true,
//         lowercase: true,
//         validate(value) {
//             if (!validator.isEmail(value)) {
//                 throw new Error("Email is invalid")
//             }
//         } 
//     },
//     password: {
//         type: String,
//         required: true,
//         minlength: 7,
//         trim: true,
//         validate(value) {
//             if (value.toLowerCase().includes('password')) {
//                 throw new Error("Your password may not contain 'password.'")
//             }
//         }
//     }
// })

// // After you have your model defined, you can create instances of it
// const me = new User({
//     name: "Biden",  
//     age: 4,
//     email: "  biden@gmail.com  ",
//     password: "123HELLO"
// })

// // save the instance to your database using promises
// me.save().then(() => {
//     console.log(me)
// }).catch((error) => {
//     console.log("Error:", error)
// })


// // CHALLENGE FOR LECTURE 84: Task Creation
// const Task = mongoose.model('Task', {
//     description: {
//         type: String,
//         trim: true,
//         required: true
//     }, 
//     completed: {
//         type: Boolean,
//         default: false
//     }
// })

// const newTask = new Task({
//     description: "  Knock out Node.js course  ",
//     completed: true
// })

// newTask.save().then(() => {
//     console.log(newTask)
// }).catch((error) => {
//     console.log("Error:", error)
// })