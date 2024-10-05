import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Login = () => {
  const location = useLocation();
  const isUser = location.pathname.includes('user');

  return (
    <div className="min-h-screen flex flex-col justify-center items-center">
      <h1 className="text-[#B08968] text-4xl font-bold mb-8">Login</h1>
      <div className="bg-[#E6CCB2] p-8 rounded-lg shadow-lg w-80">
        <form>
          {isUser ? (
            <>
              <div className="mb-4">
                <label htmlFor="phoneNo" className="block text-gray-700">Phone Number:</label>
                <input
                  type="tel"
                  id="phoneNo"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="dob" className="block text-gray-700">Date of Birth:</label>
                <input
                  type="date"
                  id="dob"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  required
                />
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <label htmlFor="staffId" className="block text-gray-700">ID:</label>
                <input
                  type="text"
                  id="staffId"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your ID"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="staffPassword" className="block text-gray-700">Password:</label>
                <input
                  type="password"
                  id="staffPassword"
                  className="border rounded w-full py-2 px-3 focus:outline-none focus:ring-2 focus:ring-[#B08968]"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </>
          )}
          <button type="submit" className="bg-[#B08968] text-white py-2 px-4 rounded w-full hover:bg-[#DDB892] transition duration-300">
            Login
          </button>
        </form>
        {isUser && (
          <p className="mt-4 text-center">
            Don't have an account?{' '}
            <Link to="/signup" className="text-[#B08968] hover:underline">
              Sign up here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
