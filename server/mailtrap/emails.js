import {
	ORDERSUCCESSTEMPLATE,
	PASSWORD_RESET_REQUEST_TEMPLATE,
	PASSWORD_RESET_SUCCESS_TEMPLATE,
	VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";
import sendMail from "./mailtrap.config.js";


export const sendVerificationEmail = async (email, verificationToken) => {
	try {
		const response = await sendMail({
			email: email,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
		});
	} catch (error) {
		console.error(`Error sending verification`, error);

		throw new Error(`Error sending verification email: ${error}`);
	}
};

export const sendWelcomeEmail = async (email, name) => {
	try {
		const response = await sendMail({
			email: email,
			subject: "Welcome to Auth Company", 
			message: `Hello ${name}, please click on the link to activate your account: $
			company_info_name: "Auth Company`,
		});
	} catch (error) {
		throw new Error(`Error sending welcome email: ${error}`);
	}
};


export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
      const response = await sendMail({
          email: email,
          subject: "Reset Your Password",
          html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      });

      console.log("Password reset email sent successfully", response);
  } catch (error) {
      console.error(`Error sending password reset email`, error);
      throw new Error(`Error sending password reset email: ${error}`);
  }
};


export const sendResetSuccessEmail = async (email) => {
	try {
		const response = await sendMail({
				email:email,
			subject: "Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			
		});
	} catch (error) {
		throw new Error(`Error sending password reset success email: ${error}`);
	}
};


export const sendOrderSuccessEmail = async (email, orders) => {
  try {
    if (!Array.isArray(orders)) {
      throw new Error('Invalid orders format - expected array');
    }
    const response = await sendMail({
      email: email,
      subject: `Order${orders.length > 1 ? 's' : ''} Placed Successfully`,
      html: ORDERSUCCESSTEMPLATE(orders),
    });
    return response;
  } catch (error) {
    throw new Error(`Error sending order confirmation email: ${error.message}`);
  }
};  


