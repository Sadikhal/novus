const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-1 text-gray-500 text-sm">
      <div className="flex space-x-1">
        <div className="w-1 h-1 bg-gray-100 rounded-full animate-bounce"></div>
        <div className="w-1 h-1 bg-gray-100 rounded-full animate-bounce delay-100"></div>
        <div className="w-1 h-1 bg-gray-100 rounded-full animate-bounce delay-200"></div>
      </div>
      <span className="text-[#fff] font-poppins">typing...</span>
    </div>
  );
};

export default TypingIndicator;