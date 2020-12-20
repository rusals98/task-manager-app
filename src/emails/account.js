// import NPM packages
const sgMail = require('@sendgrid/mail')
const { getMaxListeners } = require('../models/task')
// associate your API key with your sendgrid variable
sgMail.setApiKey(process.env.SENDGRID_API_KEY)
// send a welcome email using the sendgrid method
const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rusalo101@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    })
}
// send a cancellation email using the sendgrid method
const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'rusalo101@gmail.com',
        subject: 'We are sorry to see you go!',
        text: `Thanks for staying with us ${name}. We are sad to see you go!`
    })
}
module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}