import nodemailer from 'nodemailer';

export const sendEmail = async (data:any, req:any, res:any) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD
    }
  })
  let info = await transporter.sendMail({
    from: process.env.EMAIL,
    to: data.email,
    subject: data.subject,
    text: data.text,
    html: data.html
  })
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
} 
