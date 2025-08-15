
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../hooks/useAuth";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";


const ChangePassword = () => {
  const { token } = useParams();
  const { resetPassword, loading, error } = useAuth();
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    watch,
    setError 
  } = useForm();
  const passwordValue = watch("password", "");
  const navigate = useNavigate();

   const [showPassword, setShowPassword] = useState(false);
  
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", {
        type: "manual",
        message: "Passwords don't match"
      });
      return;
    }

    const success = await resetPassword(token, data.password);
    if (success) {
      navigate("/login");
    }
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
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-800 to-emerald-700 text-transparent bg-clip-text mb-2 font-poppins">
            Reset Password
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 mt-6">
            <img 
              src="/images/novus10.png" 
              className="w-32 h-32 mx-auto object-contain" 
              alt="logo" 
            />
            
            <p className="text-center text-gray-600 -mt-4 mb-4  font-poppins">
              Enter your new password below to reset your account credentials.
            </p>

            {error && (
              <div className="text-red-500 text-sm text-center">
                {error}
              </div>
            )}
            <div className="relative w-full">
                    <Input
                      label="Password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      register={register}
                      error={errors?.password}
                      validation={{
                        required: "Password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters"
                        },
                      }}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>

                  <div className="relative w-full">
                    <Input
                      label="Confirm New Password"
                      name="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      register={register}
                      validation={{
                        required: "Please confirm your password",
                      }}
                      error={errors?.confirmPassword}
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-3 text-gray-500"
                      onClick={togglePasswordVisibility}
                    >
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>

            <PasswordStrengthMeter password={passwordValue} />
            <Button 
              variant="gradient" 
              size="gradient" 
              loading={loading}
              type="submit"
              disabled={loading}
            >
              Reset Password
            </Button>
          </form>
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

export default ChangePassword;