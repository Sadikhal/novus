
// src/pages/ForgotPasswordPage.jsx
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import Input from "../components/ui/Input";

const ForgotPasswordPage = () => {
  const { sendResetLink, loading, isSubmitted } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email }) => {
    await sendResetLink(email);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex items-center justify-center min-h-screen px-4 bg-lamaWhite"
    >
      <div className="max-w-md w-full bg-white my-12 md:my-24 rounded-2xl shadow-xl shadow-gray-300 overflow-hidden border border-slate-100">
        <div className="p-8 w-full">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-800 to-emerald-700 text-transparent bg-clip-text mb-2">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
              <img 
                src="/images/novus10.png" 
                className="w-32 h-32 mx-auto object-contain" 
                alt="logo" 
              />
              
              <p className="text-center text-gray-600 -mt-4 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <Input
                label="Email"
                name="email"
                type="email"
                register={register}
                error={errors?.email}
                required
              />

              <Button 
                variant="gradient" 
                size="gradient" 
                loading={loading}
                type="submit"
              >
                Send Reset Link
              </Button>
            </form>
          ) : (
            <div className="text-center py-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-16 h-16 bg-[#fff] rounded-full flex items-center justify-center shadow-xl border-slate-200 mx-auto mb-6"
              >
                <Mail className="h-8 w-8 text-black" />
              </motion.div>
              
              <h3 className="text-xl font-semibold font-poppins text-gray-800 mb-2">
                Check Your Email
              </h3>
              
              <p className="text-gray-600 font-poppins">
                We've sent a password reset link to your email address. 
                Please check your inbox and follow the instructions.
              </p>
            </div>
          )}
        </div>

        <div className="px-8 py-4 w-full bg-gradient-to-r from-[#657805] to-[#cfc07c] flex justify-center text-white">
          <Link 
            to="/login" 
            className="text-sm hover:underline flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> 
            Back to Login
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default ForgotPasswordPage;