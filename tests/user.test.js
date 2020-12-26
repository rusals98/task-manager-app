// import NPM packages
const request = require('supertest')
// import modules
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')

// use the jest function to wipe your DB + create the test user before running your tests
beforeEach(setupDatabase)

test('should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Rusal',
        email: 'rusalo101@gmail.com',
        password: 'TestPass123!'
    }).expect(201)

    // Find the newly signed up user
    const user = await User.findById(response.body.user._id)
    // Assert that the database contains the newly signed up user
    expect(user).not.toBeNull()

    // Assert that the response body matches up
    expect(response.body).toMatchObject({
        user: {
            name: "Rusal",
            email: "rusalo101@gmail.com"
        },
        token: user.tokens[0].token
    })
    // Assert that the plain text password is NOT stored in DB
    expect(user.password).not.toBe('TestPass123!')
})

test('should login existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)

    // Find the newly signed up user
    const user = await User.findById(userOneId)
    // Assert that response token that was created when the user logs in 
    // matches the 2nd token stored in the DB
    expect(response.body.token).toBe(user.tokens[1].token)
})

test('should not login nonexistent user', async () => {
    await request(app).post('/users/login').send({
        email: userOne.email,
        password: "incorrectpassword"
    }).expect(400)
})

test('should get profile for user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        .send()
        .expect(400)
})

test('should delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
    
    // fetch the user from the database
    const user = await User.findById(userOneId)
    // Assert that the deleted user is now null since they are deleted
    expect(user).toBeNull()
})

test('should not delete account for user', async () => {
    await request(app)
        .delete('/users/me')
        .send()
        .expect(400)
})

test('should upload avatar image', async () => {
    // create a test to check if uploading an image works successfully
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/profile-pic.jpg')
        .expect(200)
    // get the user
    const user = await User.findById(userOneId)
    // check if user avatar property is storing binary data
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "name": "Lupe Fiasco"
        })
        .expect(200)
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Lupe Fiasco")
})

test('should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            "location": "Los Angelos"
        })
        .expect(400)
})