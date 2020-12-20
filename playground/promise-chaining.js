// in this file, you test promise chaining on a MongoDB database using Mongoose

const mongoose = require('mongoose')
const { update } = require('../src/models/user')
const User = require('../src/models/user')

// // first async operation that returns a promise to get a specific ID + update the age to 1
// User.findByIdAndUpdate("5f8e410668311f608064a47a", { age: 1 }).then((user) => {
//     console.log(user)
//     // second async operation that returns a promise to count all documents with age = 1 in DB
//     return User.countDocuments({ age: 1}) 
// }).then((count) => { 
//     console.log(count)
// }).catch((e) => {
//     console.log(e)
// })

// parent function 
const updateAgeAndCount = async (id, age) => {
    // child functions are built in Mongoose helper methods
    const user = await User.findByIdAndUpdate(id, { age })
    const count = await User.countDocuments({ age })
    return count
}
// call the function
updateAgeAndCount("5f8e410668311f608064a47a", 2).then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})