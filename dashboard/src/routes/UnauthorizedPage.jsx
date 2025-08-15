import React from 'react'

const UnauthorizedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
        <div className="flex justify-center mb-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-red-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Unauthorized Access</h1>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page. Please contact the administrator if you believe this is an error.
        </p>
        <button
          onClick={() => window.history.back()}
          className="w-full bg-cyan-700 hover:bg-cyan-900 text-white font-medium py-2 px-4 rounded-md transition duration-200 cursor-pointer"
        >
          Go Back
        </button>
        <div className="mt-4 text-sm text-gray-500">
          Error code: 403
        </div>
      </div>
    </div>
  )
}

export default UnauthorizedPage