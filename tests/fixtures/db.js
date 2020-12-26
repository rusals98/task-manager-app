// import NPM packages
const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
// import modules
const User = require('../../src/models/user')
const Task = require('../../src/models/task')

// create some test users
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Mike', 
    email: 'mike@example.com',
    password: 'TestPass123!',
    tokens: [{
        token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET)
    }]
}

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Phillip', 
    email: 'phillip@example.com',
    password: 'AlmostThere123!',
    tokens: [{
        token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET)
    }]
}

// create some test tasks
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task',
    completed: false,
    owner: userOne._id
}
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task',
    completed: true,
    owner: userOne._id
}
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task',
    completed: false,
    owner: userTwo._id
}

// function that sets up the DB with the test data
const setupDatabase = async () => {
    // wipe collections
    await User.deleteMany()
    await Task.deleteMany()
    // seed collections
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save()
    await new Task(taskThree).save()
}

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase
}