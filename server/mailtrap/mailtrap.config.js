import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();


sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ email, subject, html, text }) => {
    try {
        const msg = {
            to: email,
            from: `Novus E-commerce <${process.env.SMTP_MAIL}>`,
            subject,
            html,
            text,
        };

        const result = await sgMail.send(msg);
        console.log("Email sent successfully:", result[0].statusCode);
        return result;

    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

export default sendMail;