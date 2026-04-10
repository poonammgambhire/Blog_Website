import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, text }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
     secure: false,
    auth: {
      user: process.env.EMAIL,           // ✅ fix
      pass: process.env.EMAIL_PASSWORD,  // ✅ fix
    },
  });

  await transporter.sendMail({
    from: `"Blog App" <${process.env.EMAIL}>`, // ✅ fix
    to,
    subject,
    text,
  });
};

export default sendEmail;