// how to perform CRUD operations, not actually used in application

// // import your mongodb npm library
// const mongodb = require('mongodb')

// // initialize client which will give us access to the functions necessary to perform the CRUD operations
// const MongoClient = mongodb.MongoClient

// // store object ID in a variable; get this value from the Mongo object
// const ObjectID = mongodb.ObjectID

// destructured version of lines 3 - 10
const { MongoClient, ObjectID } = require('mongodb')

// define connection URL and database that you want to connect on
const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager'

// node consturcture function that stores the mongo object ID in a variable
// const id = new ObjectID
// console.log(id)
// console.log(id.getTimestamp())

// if error, this application will not connect to the MongoDB client
// if no error, this application will connect to the MongoDB client, create a table called 'task-manager',
// create a new collection/table called 'users', and insert a new document (row of data) into that table
MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log("Unable to connect to database")
    }

    const db = client.db(databaseName)

    // // insert a single document into a collection
    // db.collection('users').insertOne({
    //     _id: id,
    //     name: 'Jay',
    //     age: 21
    // }, (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert user")
    //     }

    //     console.log(result.ops)
    // }) 

    // // bulk insert documents into a collection
    // db.collection('users').insertMany([
    //     {
    //         name: 'Jen',
    //         age: 28
    //     }, 
    //     {
    //         name: "Gunther",
    //         age: 45
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert documents")
    //     }
        
    //     //ops is just the array of documents that you are trying to insert
    //     console.log(result.ops)
    // })

    // // challenge for lecture 76
    // db.collection('tasks').insertMany([
    //     {
    //         description: 'Clean the bathroom',
    //         completed: true
    //     }, 
    //     {
    //         description: 'Finish Node.js class',
    //         completed: false
    //     },
    //     {
    //         description: 'Renew license',
    //         completed: false
    //     }
    // ], (error, result) => {
    //     if (error) {
    //         return console.log("Unable to insert documents")
    //     }
        
    //     //ops is just the array of documents that you are trying to insert
    //     console.log(result.ops)
    // })

    // // findOne(): returns a single document from the specified collection
    // db.collection('users').findOne({ _id: new ObjectID('5f87cd5a20b4ea25382944f5')}, (error, user) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(user)
    // })
    
    // // find(): returns many documents from the specified collection
    // db.collection('users').find({ name: 'Gunther'}).toArray((error, users) => {
    //     console.log(users)
    // })

    // // challenge for lecture 78
    // db.collection('tasks').findOne({ _id: new ObjectID('5f864ba3f0e2b703104909e9')}, (error, task) => {
    //     if (error) {
    //         return console.log('Unable to fetch')
    //     }
    //     console.log(task)
    // })
    // db.collection('tasks').find({ completed: false }).toArray((error, users) => {
    //     console.log(tasks)
    // })

    // // update single document in the collection
    // // returns a promise, so use method calls then/catch to return result or error
    // // common promise pattern: collection, updateOne, then, catch
    // const updatePromise = db.collection('users').updateOne({
    //     _id: new ObjectID("5f87cd5a20b4ea25382944f5")
    // }, {
    //     $set: {
    //         name: "Kobe"
    //     }
    // })

    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // // challenge for lecture 80
    // const updatePromise = db.collection('tasks').updateMany({
    //     completed: false
    // }, {
    //     $set: {
    //         completed: true
    //     }
    // })

    // updatePromise.then((result) => {
    //     console.log(result)
    // }).catch((error) => {
    //     console.log(error)
    // })

    // delete multiple documents from the specified collection
    db.collection('users').deleteMany({
        age: 27
    }).then((result) => {
        console.log(result)
    }).catch((error) => {
        console.log(error)
    })

    // challenge for lecture 81
    db.collection('tasks').deleteOne({
        description: "Clean the bathroom"
    }).then((result) => {
        console.log(result)
    }).catch(() => {
        console.log(error)
    })
})

