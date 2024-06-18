const express = require('express');
const app = express();
const cors = require('cors');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');

const port = 5000;
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'ankitdubey58825@gmail.com',
    pass: 'hlnf pcoa rdnd agsw'
  }
});

app.post('/send-email', (req, res) => {
  const { email, firstName, lastName, phone, message } = req.body;

  // Email to the admin
  const adminMailOptions = {
    from: 'ankitdubey58825@gmail.com',
    to: 'ankitdubey58825@gmail.com',
    subject: 'New Contact Form Submission',
    text: `New contact form submission:\n\nName: ${firstName} ${lastName}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`
  };

  // Email to the sender
  const senderMailOptions = {
    from: 'ankitdubey58825@gmail.com',
    to: email,
    subject: 'Thank you for contacting us',
    html: `
      <p>Thank you ${firstName} for showing interest. We will contact you shortly.</p>
      <img src="https://example.com/thank-you-image.jpg" alt="Thank You" style="max-width: 100%; height: auto;">
    `
  };

  // Send email to admin
  transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
    if (adminError) {
      console.log('Error occurred:', adminError.message);
      res.status(500).send('Error sending email to admin');
    } else {
      console.log('Admin email sent:', adminInfo.response);

      // Send email to sender
      transporter.sendMail(senderMailOptions, (senderError, senderInfo) => {
        if (senderError) {
          console.log('Error occurred:', senderError.message);
          res.status(500).send('Error sending email to sender');
        } else {
          console.log('Sender email sent:', senderInfo.response);
          res.send('Emails sent successfully');
        }
      });
    }
  });
});

app.post('/receive-message', (req, res) => {
  const { email, name, message } = req.body;

  // Log the message details to the console
  console.log(`Received message from ${name} (${email}): ${message}`);

  // Email to the admin
  const adminMailOptions = {
    from: 'ankitdubey58825@gmail.com',
    to: 'ankitdubey58825@gmail.com',
    subject: 'New message received',
    text: `New message received from ${name} (${email}): ${message}`
  };

  // Email to the sender
  const senderMailOptions = {
    from: 'ankitdubey58825@gmail.com',
    to: email,
    subject: 'We received your message',
    html: `
      <p>Hi ${name},</p>
      <p>Thank you for your message. We will get back to you shortly.</p>
      <img src="https://ibb.co/fNYwKQY" alt="Thank You" style="max-width: 100%; height: auto;">
    `
  };

  // Send email to admin
  transporter.sendMail(adminMailOptions, (adminError, adminInfo) => {
    if (adminError) {
      console.error('Error sending email notification:', adminError);
    } else {
      console.log('Admin email notification sent successfully:', adminInfo.response);

      // Send email to sender
      transporter.sendMail(senderMailOptions, (senderError, senderInfo) => {
        if (senderError) {
          console.error('Error sending email to sender:', senderError);
          res.status(500).send('Error sending email to sender');
        } else {
          console.log('Sender email sent successfully:', senderInfo.response);
          res.status(200).send('Message received successfully');
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
