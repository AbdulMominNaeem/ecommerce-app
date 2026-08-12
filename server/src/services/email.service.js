const transporter = require("../config/smtp.config");
const welcomeTemplate = require("../templates/welcome.template");

const sendEmail = async ({ to, subject, name, html, text }) => {
    const mailOptions = {
        from: process.env.FROM_EMAIL,
        to,
        subject,
        html: html || welcomeTemplate(name),
        text: text || undefined,
    };
    return await transporter.sendMail(mailOptions);
};
module.exports = sendEmail;