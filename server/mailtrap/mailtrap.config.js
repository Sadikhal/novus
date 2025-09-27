import nodemailer from "nodemailer";

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: false,
        auth:{
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions = {
        from: `Novus <${process.env.SMTP_MAIL}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html,
        template_uuid: options.template_uuid,
        template_variables: options.template_variables,
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;




// import sgMail from "@sendgrid/mail";
// import dotenv from "dotenv";

// dotenv.config();


// sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const sendMail = async ({ email, subject, html, text }) => {
//     try {
//         const msg = {
//             to: email,
//             from: `Novus E-commerce <${process.env.SMTP_MAIL}>`,
//             subject,
//             html,
//             text,
//         };

//         const result = await sgMail.send(msg);
//         console.log("Email sent successfully:", result[0].statusCode);
//         return result;

//     } catch (error) {
//         console.error("Error sending email:", error);
//         throw new Error(`Email sending failed: ${error.message}`);
//     }
// };

// export default sendMail;