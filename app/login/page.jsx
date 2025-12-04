import React from "react";
import { FcGoogle } from "react-icons/fc";
const login = () => {
  return (
    <div className="px-12 py-24 flex mt-10">
      <div className="flex w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-lg lg:max-w-4xl">
        {/* Left-side image */}
        <div
          className="hidden bg-cover lg:block lg:w-1/2"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/3736397/pexels-photo-3736397.jpeg')",
          }}
        ></div>

        {/* Right-side form */}
        <div className="w-full px-6 py-8 md:px-8 lg:w-1/2">
          {/* Logo */}
          <div className="flex justify-center mx-auto">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt="Logo"
            />
          </div>

          <p className="mt-3 text-xl text-center text-gray-600">
            Welcome back!
          </p>

          {/* Google Sign-in with React Icon */}
          <a
            href="#"
            className="flex items-center justify-center mt-4 text-gray-600 transition-colors duration-300 transform border rounded-lg hover:bg-gray-50"
          >
            <div className="px-4 py-2">
              <FcGoogle className="w-6 h-6" />
            </div>
            <span className="w-5/6 px-4 py-3 font-bold text-center">
              Sign in with Google
            </span>
          </a>

          {/* Divider */}
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b lg:w-1/4"></span>
            <a
              href="#"
              className="text-xs text-center text-gray-500 uppercase hover:underline"
            >
              or login with email
            </a>
            <span className="w-1/5 border-b lg:w-1/4"></span>
          </div>

          {/* Email Input */}
          <div className="mt-4">
            <label
              htmlFor="LoggingEmailAddress"
              className="block mb-2 text-sm font-medium text-gray-600"
            >
              Email Address
            </label>
            <input
              id="LoggingEmailAddress"
              type="email"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
            />
          </div>

          {/* Password Input */}
          <div className="mt-4">
            <div className="flex justify-between">
              <label
                htmlFor="loggingPassword"
                className="block mb-2 text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <a href="#" className="text-xs text-gray-500 hover:underline">
                Forget Password?
              </a>
            </div>
            <input
              id="loggingPassword"
              type="password"
              className="block w-full px-4 py-2 text-gray-700 bg-white border rounded-lg focus:border-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none"
            />
          </div>

          {/* Sign-in Button */}
          <div className="mt-6">
            <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring focus:ring-gray-300 focus:ring-opacity-50">
              Sign In
            </button>
          </div>

          {/* Sign-up Link */}
          <div className="flex items-center justify-between mt-4">
            <span className="w-1/5 border-b md:w-1/4"></span>
            <a
              href="#"
              className="text-xs text-gray-500 uppercase hover:underline"
            >
              or sign up
            </a>
            <span className="w-1/5 border-b md:w-1/4"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default login;
