import nodemailer from "nodemailer";

const sendMail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMPT_HOST,
        port: process.env.SMPT_PORT,
        secure: false,
        auth:{
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
        tls: {
        rejectUnauthorized: false,
      },
    });

    const mailOptions = {
        from: `Novus <${process.env.SMPT_MAIL}>`,
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

