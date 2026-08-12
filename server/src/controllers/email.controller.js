const sendEmail = require("../services/email.service");

const sendEmailController = async (req, res) => {
    try {
        const { to, subject, name } = req.body;
        await sendEmail({
            to,
            subject,
            name,
        });
        return res.status(200).json({
            success: true,
            message: "Email sent successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
module.exports = {
    sendEmailController,
};