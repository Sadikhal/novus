import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { useAuth } from "../../hooks/useAuth";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const navigate = useNavigate();
  const { verifyEmail, loading } = useAuth();

  const handleChange = (index, value) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const verificationCode = code.join("");
    await verifyEmail(verificationCode);
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      handleSubmit(new Event("submit"));
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center h-full bg-lamaWhite px-2">
      <div className="max-w-md w-full bg-bgColor my-24 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden flex justify-center items-center px-2 font-poppins">
        <div className="rounded-2xl shadow-2xl p-8 w-full justify-center items-center flex flex-col max-w-md shadow-slate-300 border border-slate-200">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-cyan-800 to-emerald-700 text-transparent bg-clip-text">
            Verify Your Email
          </h2>
          <img 
            src="/novus10.png" 
            className="w-32 h-32 text-center rounded-full pt-3 bg-transparent object-contain" 
            alt="logo"
          />

          <p className="text-center -mt-2 text-gray-500">
            Enter the 6-digit code sent to your email (check your spam folder if you don’t see it).
          </p>

          <form onSubmit={handleSubmit} className="space-y-6 mt-3">
            <div className="flex justify-between gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="md:w-12 md:h-12 w-9 h-9 border border-gray-300 text-center text-lg text-slate-900 bg-white focus:outline-none focus:border-[#577b1d] rounded-sm transition-colors"
                  disabled={loading}
                />
              ))}
            </div>

            <Button 
              variant="gradient" 
              size="gradient" 
              loading={loading}
              className="w-full font-bold font-poppins rounded-lg capitalize before:rounded-lg border-none"
            >
              Verify Email
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationPage;