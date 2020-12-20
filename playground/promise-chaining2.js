const mongoose = require('mongoose')
const Task = require('../src/models/task')

// // first async operation will find record by ID and delete
// Task.findByIdAndDelete("5f8e410668311f608064a47a").then((task) => {
//     console.log(task)
//     // second async operation will count records with "completed = false"
//     return Task.countDocuments({ completed: false })
// }).then((incompleteTasks) => {
//     console.log(incompleteTasks)
// }).catch((e) => {
//     console.log(e)
// })

// parent function 
const deleteTaskAndCount = async (id) => {
    // child functions are built in Mongoose helper methods
    const deletedTask = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments({ completed: false })
    return count
}
// call the function
deleteTaskAndCount("5fa7510d7168612b14332cb6").then((count) => {
    console.log(count)
}).catch((e) => {
    console.log(e)
})