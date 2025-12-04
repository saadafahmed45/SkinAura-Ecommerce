"use client";
import React from "react";

const ContactSection = () => {
  return (
    <section className="bg-white ">
      <div className="container px-6 py-16 mx-auto">
        <div className="lg:flex lg:items-center lg:-mx-6">
          {/* LEFT SIDE */}
          <div className="lg:w-1/2 lg:mx-6">
            <h1 className="text-2xl font-semibold text-gray-800 capitalize  lg:text-3xl">
              Contact us for <br /> more info
            </h1>

            <div className="mt-6 space-y-8 md:mt-8">
              {/* Address */}
              <p className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>

                <span className="mx-2 text-gray-700 truncate w-72 ">
                  Cecilia Chapman 711-2880 Nulla St. Mankato Mississippi 96522
                </span>
              </p>

              {/* Phone */}
              <p className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>

                <span className="mx-2 text-gray-700 truncate w-72 ">
                  (257) 563-7401
                </span>
              </p>

              {/* Email */}
              <p className="flex items-start -mx-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mx-2 text-blue-500 "
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>

                <span className="mx-2 text-gray-700 truncate w-72 ">
                  acb@example.com
                </span>
              </p>
            </div>

            {/* Social Icons */}
            <div className="mt-6 w-80 md:mt-8">
              <h3 className="text-gray-600 ">Follow us</h3>

              <div className="flex mt-4 -mx-1.5">
                {/* Twitter */}
                <a className="mx-1.5 text-gray-400 hover:text-blue-500  transition-colors">
                  <svg
                    className="w-10 h-10 fill-current"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334..." />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a className="mx-1.5 text-gray-400 hover:text-blue-500  transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15.2 8.80005C16.4731 8.80005 17.694..."
                      fill="currentColor"
                    />
                  </svg>
                </a>

                {/* Facebook */}
                <a className="mx-1.5 text-gray-400 hover:text-blue-500  transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 10.2222V13.7778H9.66667V20H13.2222..."
                      fill="currentColor"
                    />
                  </svg>
                </a>

                {/* Instagram */}
                <a className="mx-1.5 text-gray-400 hover:text-blue-500  transition-colors">
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M11.9294 7.72275C9.65868 7.72275..."
                      fill="currentColor"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE — FORM */}
          <div className="mt-8 lg:w-1/2 lg:mx-6">
            <div className="w-full px-8 py-10 mx-auto overflow-hidden bg-white rounded-lg shadow-md  lg:max-w-xl shadow-gray-300/50 dark:shadow-black/50">
              <h1 className="text-lg font-medium text-gray-700">
                What do you want to ask
              </h1>

              <form className="mt-6">
                {/* Name */}
                <div>
                  <label className="block mb-2 text-sm text-gray-600 d">
                    Full Name
                  </label>
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="block w-full px-5 py-3 mt-2 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-40"
                  />
                </div>

                {/* Email */}
                <div className="mt-6">
                  <label className="block mb-2 text-sm text-gray-600 d">
                    Email address
                  </label>
                  <input
                    type="email"
                    placeholder="johndoe@example.com"
                    className="block w-full px-5 py-3 mt-2 bg-white border border-gray-200 rounded-md    focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-40"
                  />
                </div>

                {/* Message */}
                <div className="w-full mt-6">
                  <label className="block mb-2 text-sm text-gray-600 d">
                    Message
                  </label>
                  <textarea
                    placeholder="Message"
                    className="block w-full h-32 px-5 py-3 mt-2 bg-white border border-gray-200 rounded-md md:h-48    focus:border-blue-400 focus:ring focus:ring-blue-400 focus:ring-opacity-40"
                  ></textarea>
                </div>

                {/* Button */}
                <button className="w-full px-6 py-3 mt-6 text-sm font-medium tracking-wide text-white bg-blue-500 rounded-md hover:bg-blue-400 focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  get in touch
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
