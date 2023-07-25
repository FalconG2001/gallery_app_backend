const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //Create transporter
  let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  //   var transporter = nodemailer.createTransport({
  //     host: 'sandbox.smtp.mailtrap.io',
  //     port: 2525,
  //     auth: {
  //       user: '58e548f36de248',
  //       pass: '75eac3c770c88e',
  //     },
  //   });
  //Define email options
  const mailOptions = {
    from: 'Guru Krish <krish@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  //Actually send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
