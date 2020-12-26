// import NPM packages
const request = require('supertest')
// import modules
const app = require('../src/app')
const Task = require('../src/models/task')
const { 
    userOneId, 
    userOne, 
    userTwoId, 
    userTwo, 
    taskOne, 
    taskTwo, 
    taskThree, 
    setupDatabase } = require('./fixtures/db')

// use the jest function to wipe your DB + create the test user before running your tests
beforeEach(setupDatabase)

test('should create task for user', async () => {
    const response = await request(app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'From my test'
        })
        .expect(201)
    // fetch the task just created by ID
    const task = await Task.findById(response.body._id)
    // assert that the task just created has been added to the DB
    expect(task).not.toBeNull()
    // assert that the 'completed' field is false if not provided
    expect(task.completed).toBe(false)
})

test('should retrieve all tasks for user one', async () => {
    // assert that we are getting back 200 HTTPS status code
    const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    // the body is what contains all the tasks for your user
    // console.log(response.body)

    // assert that we are getting back 2 tasks for the userOne
    expect(response.body.length).toEqual(2)
})

test('should not delete another users task', async () => {
    // assert that we get back a 404 HTTPS status code
    const response = await request(app)
        // delete task that belongs to user one
        .delete('/tasks/' + taskOne._id)
        // using user two authentication token
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        // expect 404 not found becuase user two doesn't have access to this task
        .expect(404)
    // assert that taskOne still exists in the DB
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})
