import { createTransport } from "nodemailer";

const SendEmail = async (options) => {
  const transporter = createTransport({
    host: process.env.SMPT_HOST,
    port: process.env.SMPT_PORT,
    service: process.env.SMPT_SERVICE,
    auth: {
      user: process.env.SMPT_MAIL,
      pass: process.env.SMPT_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMPT_MAIL,
    to: options.email,
    subject: options.subject,
    html: options.isHtml ? options.message : undefined, 
    text: !options.isHtml ? options.message : undefined, 
  };

  await transporter.sendMail(mailOptions);
};

export default SendEmail;
