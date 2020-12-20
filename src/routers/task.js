// load in npm packages
const express = require('express')
// load in modules
const Task = require('../models/task')
const auth = require('../middleware/auth')
// create a new express router
const router = new express.Router()

// create an endpoint that clients can hit to create tasks
router.post('/tasks', auth, async (req, res) => {
    // // old way: create a new task with the parsed JSON
    // const task = new Task(req.body)

    // new way: create a new task with the parsed JSON + owner ID property
    const task = new Task({
        // ES6 Spread Operator: copies all the properties from req.body to this object
        ...req.body, 
        owner: req.user._id
    })

    // using async await
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
    
    // // using promise chaining
    // // save the new user to attempt to save the new user
    // task.save().then(() => {
    //     res.status(201).send(task)
    // }).catch((e) => {
    //     // response chaining to send status and then error
    //     res.status(400).send(e)
    // })
})

// create an endpoint that clients can hit to fetch INDIVIDUAL tasks by ID
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    // using async await
    try {
        // // old way to retrieve task
        // const task = await Task.findById(_id)

        // new way to retrieve task
        const task = await Task.findOne({ _id, owner: req.user._id })

        if (!task) {
            return res.status(404).send('No task was found!')
        }
        res.send(task)
    } catch (e) {
        res.status(500).send(e)
    }

    // // using promise chaining
    // Task.findById(_id).then((task) => {
    //     if (!task) {
    //         return res.status(404).send('No task was found!')
    //     }
    //     res.send(task)
    // }).catch((e) => {
    //     res.status(500).send(e)
    // })
})

// create an endpoint that clients can hit to fetch ALL tasks
router.get('/tasks', auth, async (req, res) => {
    // create an object that we can store query string parameters in 
    const match = {}
    const sort = {}
    // check if completed query string param was provided
    if (req.query.completed) {
        // if the completed property is equal to the string value 'true, then
        // match.complete will be equal to the boolean value true
        match.completed = req.query.completed === "true"
    }
    // check if sortBy query string param was provided
    if (req.query.sortBy) {
        // split the 'sortBy=createdAt:asc' or 'sortBy=createdAt:desc' at the colon
        const parts = req.query.sortBy.split(':')
        // ternary operator to add 1 (if its asc) or -1 (if its desc) integer value
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // retreive tasks with query string parameters 
        await req.user.populate({
            path: 'tasks',
            match: match,
            options: {
                // convert the 'string' value limit a 'int' type
                limit: parseInt(req.query.limit), 
                skip: parseInt(req.query.skip), 
                sort: sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch (error) {
        res.status(500).send(e)
    }
})

// create an endpoint that clients can hit to update a SINGLE task by ID
router.patch('/tasks/:id', auth, async (req, res) => {
    // CHECK IF THE FIELD(S) THE CLIENT IS TRYING TO UPDATE EXIST

    // Object.keys() method returns an array of a given object's own enumerable property names
    // Convert all updates from object -> array
    const updates = Object.keys(req.body)

    // Create array of the fields that the client is allowed to update
    const allowedUpdates = ['description', 'completed']

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
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

        // // refactored code that was added so middleware methods would run correctly
        // const task = await Task.findById(req.params.id)

        // refactored code to correctly find the task using the 'owner' property into account
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => {
            task[update] = req.body[update]
        })
        await task.save()

        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

// create an endpoint that clients can hit to delete a SINGLE task by ID
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        // // old way of getting the task
        // const task = await Task.findByIdAndDelete(req.params.id)

        // new way of getting the task
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

        if (!task) {
            return res.status(404).send() 
        }
        res.send(task)
    } catch (e) {
       res.send(500).send()
    }
})

module.exports = router