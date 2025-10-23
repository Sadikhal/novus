import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function NotFound() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen flex items-center justify-center bg-gray-50 font-poppins">
      <div className="max-w-3xl w-full bg-white rounded-2xl shadow-md p-8 md:p-12 text-center">
        <div className="flex items-center justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-slate-50 flex items-center justify-center">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" className="text-cyan-600">
              <path d="M11.03 3.668 3.5 7.2v5.6A9.667 9.667 0 0 0 12 22a9.67 9.67 0 0 0 8.5-9.2V7.2l-7.53-3.532a1 1 0 0 0-.94 0Z" fill="currentColor" opacity="0.12"></path>
              <path d="M12 8v6" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
              <path d="M12 16h.01" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
          </div>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">Page not found</h1>

        <p className="text-sm md:text-base text-gray-500 mb-6">
          There’s nothing at <span className="font-mono bg-gray-100 px-2 py-1 rounded text-sm text-gray-700">{location.pathname}</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 cursor-pointer rounded-md border border-gray-200 text-gray-700 hover:bg-gray-50 w-40"
          >
            Go back
          </button>

          <Link
            to="/"
            className="px-4 py-2 rounded-md bg-cyan-600 text-white font-semibold hover:bg-emerald-700 w-40 text-center cursor-pointer"
            aria-label="Go to home"
          >
            Take me home
          </Link>
          
           <Link
            to="/products"
            className="px-4 py-2 rounded-md bg-white text-teal-600 border border-emerald-100 hover:bg-emerald-50 w-40 text-center"
            aria-label="Browse products"
          >
            Browse products
          </Link>
        </div>

       
        <div className="mt-6 text-xs text-gray-400">
          Tip: If you typed the URL manually, double-check for typos.
        </div>
      </div>
   </motion.div>
  );
}
