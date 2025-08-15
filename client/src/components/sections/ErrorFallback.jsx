export const ErrorFallback = ({ message }) => (
  <div className="text-center md:min-w-[300px] min-w-[250px] max-w-md p-6 bg-white rounded-lg shadow-lg font-helvetica">
    <h2 className="text-2xl font-bold text-red-800 mb-4">Error</h2>
    <p className="text-gray-700 mb-4">
      {message || 'some thing went wrong, please try again'}
    </p>
    <button
      onClick={() => window.location.reload()}
      className="px-6 py-2 bg-[#8f9722] text-white rounded-md cursor-pointer hover:bg-[#7c8500] transition-colors"
    >
      Retry
    </button>
  </div>
);