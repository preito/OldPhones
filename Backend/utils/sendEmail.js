const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,           // smtp.gmail.com
  port: Number(process.env.SMTP_PORT),   // 587
  secure: false,                         // STARTTLS
  auth: {
    user: process.env.SMTP_USER,         // your Gmail
    pass: process.env.SMTP_PASS,         // your app password
  }
})

module.exports = async function sendEmail({ to, subject, html }) {
  const info = await transporter.sendMail({
    from:    process.env.EMAIL_FROM,
    to, subject, html
  })
  console.log('Email sent: %s', info.messageId)
  return info
}