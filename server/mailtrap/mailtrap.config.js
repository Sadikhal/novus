// import nodemailer from "nodemailer";

// const sendMail = async (options) => {
//     const transporter = nodemailer.createTransport({
//         host: process.env.SMPT_HOST,
//         port: process.env.SMPT_PORT,
//         secure: false,
//         auth:{
//             user: process.env.SMPT_MAIL,
//             pass: process.env.SMPT_PASSWORD,
//         },
//         tls: {
//         rejectUnauthorized: false,
//       },
//     });

//     const mailOptions = {
//         from: `Novus <${process.env.SMPT_MAIL}>`,
//         to: options.email,
//         subject: options.subject,
//         text: options.message,
//         html: options.html,
//         template_uuid: options.template_uuid,
//         template_variables: options.template_variables,
//     };

//     await transporter.sendMail(mailOptions);
// };

// export default sendMail;


import nodemailer from "nodemailer";

const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: false, // Use TLS
        auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD,
        },
        tls: {
            rejectUnauthorized: false // Important for production servers
        },
        connectionTimeout: 10000, // 10 seconds
        greetingTimeout: 10000, // 10 seconds
        socketTimeout: 10000 // 10 seconds
    });
};

const sendMail = async (options) => {
    try {
        console.log('Attempting to send email to:', options.email);
        console.log('SMTP Host:', process.env.SMTP_HOST);
        console.log('SMTP Port:', process.env.SMTP_PORT);
        console.log('SMTP User:', process.env.SMTP_MAIL);

        const transporter = createTransporter();
        
        // Verify transporter configuration
        await transporter.verify();
        console.log('SMTP transporter verified successfully');

        const mailOptions = {
            from: `Novus E-commerce <${process.env.SMTP_MAIL}>`,
            to: options.email,
            subject: options.subject,
            text: options.message,
            html: options.html,
        };

        const result = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully:', result.messageId);
        return result;

    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Email sending failed: ${error.message}`);
    }
};

export default sendMail;

