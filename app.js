"use strict";


const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 3000;

// create a nodemailer transport object
const transporter = nodemailer.createTransport({
    services: 'gmail',
    auth: {
        user: 'your-email@gmail.com', // replace with email
        pass: 'your-email-pass' // replace with your email password or app password
    }
    /*
     Note: Using Gmail's SMTP server requires you to use an app password if you have 2FA enabled or allow less secure apps. 
     For production, consider using a dedicated email service provider like SendGrid, Mailgun, or Amazon SES for better security.
*/
     }) 
    

// middlware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // add this to parse JSON request bodies
app.use(express.static(path.join(__dirname, 'public')));


// /contact route
app.post('/contact', (req, res) => {
    const { fullName, email, message } = req.body;

    // Print the form data to the console
    console.log('Form Submission Received:');
    console.log(`Name: ${fullName}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);

    // setup mail data
    const mailOptions = {
        from: email, // Sender's email
        to: 'name@mail.com', // Your email address
        subject: `Contact Form Submission from ${fullName}`,
        text: `Message from: ${fullName}\nEmail: ${email}\n\nMessage:\n${message}`
    };

     // Send email
     transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        }
        console.log('Email sent:', info.response);
        res.send('Message sent successfully');
    });
});


// /log route to handle click logs
app.post('/log', (req, res) => {
    const { url, timestamp } = req.body;

    // Print the log data to the console
    console.log(`Link Clicked: ${url} at ${timestamp}`);

    // Respond to the client
    res.status(200).send('Log received');
});



// Start the server listening
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:3000');
})