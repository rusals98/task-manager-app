// load in the express app module
const app = require('./app')

// create port variable to start the app on 
const port = process.env.PORT

// configure the application to start on the registered port
app.listen(port, () => {
    console.log('Server is up and running on port: ' + port)
})
