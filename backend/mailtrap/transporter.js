import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

// export const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: process.env.SMTP_PORT,
//   secure: true, // use TLS
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
// });

export const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  auth: {
    user: "apikey", // literally "apikey"
    pass: process.env.SENDGRID_API_KEY,
  },
});