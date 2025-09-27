// import {
// 	ORDERSUCCESSTEMPLATE,
// 	PASSWORD_RESET_REQUEST_TEMPLATE,
// 	PASSWORD_RESET_SUCCESS_TEMPLATE,
// 	VERIFICATION_EMAIL_TEMPLATE,
// } from "./emailTemplates.js";
// import sendMail from "./mailtrap.config.js";


// export const sendVerificationEmail = async (email, verificationToken) => {
// 	try {
// 		const response = await sendMail({
// 			email: email,
// 			subject: "Verify your email",
// 			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
// 		});
// 	} catch (error) {
// 		throw new Error(`Error sending verification email: ${error}`);
// 	}
// };

// export const sendWelcomeEmail = async (email, name) => {
// 	try {
// 		const response = await sendMail({
// 			email: email,
// 			subject: "Welcome to Auth Company", 
// 			message: `Hello ${name}, You sucessfully registered to Novus E-commerce.`,
// 		});
// 	} catch (error) {
// 		throw new Error(`Error sending welcome email: ${error}`);
// 	}
// };


// export const sendPasswordResetEmail = async (email, resetURL) => {
//   try {
//       const response = await sendMail({
// 				email: email,
// 				subject: "Reset Your Password",
// 				html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
//       });
//       } catch (error) {
//       console.log(`Error sending password reset email`, error);
//       throw new Error(`Error sending password reset email: ${error}`);
//   }
// };


// export const sendResetSuccessEmail = async (email) => {
// 	try {
// 		const response = await sendMail({
// 			email:email,
// 			subject: "Password Reset Successful",
// 			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
// 		});
// 	} catch (error) {
// 		throw new Error(`Error sending password reset success email: ${error}`);
// 	}
// };


// export const sendOrderSuccessEmail = async (email, orders) => {
//   try {
//     if (!Array.isArray(orders)) {
//       throw new Error('Invalid orders format - expected array');
//     }
//     const response = await sendMail({
//       email: email,
//       subject: `Order${orders.length > 1 ? 's' : ''} Placed Successfully`,
//       html: ORDERSUCCESSTEMPLATE(orders),
//     });
//     return response;
//   } catch (error) {
//     throw new Error(`Error sending order confirmation email: ${error.message}`);
//   }
// };  





import {
    VERIFICATION_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    ORDERSUCCESSTEMPLATE,
} from "./emailTemplates.js";
import sendMail from "./mailtrap.config.js";

export const sendVerificationEmail = async (email, verificationToken) => {
    try {
        console.log(`Sending verification email to: ${email}`);
        
        const response = await sendMail({
            email: email,
            subject: "Verify your email - Novus E-commerce",
            html: VERIFICATION_EMAIL_TEMPLATE(verificationToken),
        });
        
        console.log('Verification email sent successfully');
        return response;
    } catch (error) {
        console.error('Error sending verification email:', error);
        throw new Error(`Error sending verification email: ${error.message}`);
    }
};

export const sendWelcomeEmail = async (email, name) => {
    try {
        const response = await sendMail({
            email: email,
            subject: "Welcome to Novus E-commerce",
            html: `<p>Hello ${name},</p><p>You successfully registered to Novus E-commerce.</p>`,
        });
        return response;
    } catch (error) {
        console.error('Error sending welcome email:', error);
        throw new Error(`Error sending welcome email: ${error.message}`);
    }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
    try {
        const response = await sendMail({
            email: email,
            subject: "Reset Your Password - Novus E-commerce",
            html: PASSWORD_RESET_REQUEST_TEMPLATE(resetURL),
        });
        return response;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw new Error(`Error sending password reset email: ${error.message}`);
    }
};

export const sendResetSuccessEmail = async (email) => {
    try {
        const response = await sendMail({
            email: email,
            subject: "Password Reset Successful - Novus E-commerce",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
        });
        return response;
    } catch (error) {
        console.error('Error sending password reset success email:', error);
        throw new Error(`Error sending password reset success email: ${error.message}`);
    }
};

export const sendOrderSuccessEmail = async (email, orders) => {
    try {
        if (!Array.isArray(orders)) {
            throw new Error('Invalid orders format - expected array');
        }
        
        const response = await sendMail({
            email: email,
            subject: `Order${orders.length > 1 ? 's' : ''} Placed Successfully - Novus E-commerce`,
            html: ORDERSUCCESSTEMPLATE(orders),
        });
        
        return response;
    } catch (error) {
        console.error('Error sending order confirmation email:', error);
        throw new Error(`Error sending order confirmation email: ${error.message}`);
    }
};