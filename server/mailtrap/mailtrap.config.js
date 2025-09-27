// // import nodemailer from "nodemailer";

// // const sendMail = async (options) => {
// //     const transporter = nodemailer.createTransport({
// //         host: process.env.SMPT_HOST,
// //         port: process.env.SMPT_PORT,
// //         secure: false,
// //         auth:{
// //             user: process.env.SMPT_MAIL,
// //             pass: process.env.SMPT_PASSWORD,
// //         },
// //         tls: {
// //         rejectUnauthorized: false,
// //       },
// //     });

// //     const mailOptions = {
// //         from: `Novus <${process.env.SMPT_MAIL}>`,
// //         to: options.email,
// //         subject: options.subject,
// //         text: options.message,
// //         html: options.html,
// //         template_uuid: options.template_uuid,
// //         template_variables: options.template_variables,
// //     };

// //     await transporter.sendMail(mailOptions);
// // };

// // export default sendMail;


// import nodemailer from "nodemailer";

// const createTransporter = () => {
//     return nodemailer.createTransport({
//         host: process.env.SMTP_HOST,
//         port: parseInt(process.env.SMTP_PORT),
//         secure: true, // Use TLS
//         auth: {
//             user: process.env.SMTP_MAIL,
//             pass: process.env.SMTP_PASSWORD,
//         },
        
//     });
// };

// const sendMail = async (options) => {
//     try {
//         console.log('Attempting to send email to:', options.email);
//         console.log('SMTP Host:', process.env.SMTP_HOST);
//         console.log('SMTP Port:', process.env.SMTP_PORT);
//         console.log('SMTP User:', process.env.SMTP_MAIL);

//         const transporter = createTransporter();
        
//         // Verify transporter configuration
//         await transporter.verify();
//         console.log('SMTP transporter verified successfully');

//         const mailOptions = {
//             from: `Novus E-commerce <${process.env.SMTP_MAIL}>`,
//             to: options.email,
//             subject: options.subject,
//             text: options.message,
//             html: options.html,
//         };

//         const result = await transporter.sendMail(mailOptions);
//         console.log('Email sent successfully:', result.messageId);
//         return result;

//     } catch (error) {
//         console.error('Error sending email:', error);
//         throw new Error(`Email sending failed: ${error.message}`);
//     }
// };

// export default sendMail;


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