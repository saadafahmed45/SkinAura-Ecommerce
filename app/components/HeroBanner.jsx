import React from "react";

const HeroBanner = () => {
  return (
    <div className="  mx-auto">
      <div
        className="w-full bg-center bg-cover h-[48rem]"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/19599222/pexels-photo-19599222.jpeg')",
        }}
      >
        <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
          <div className="text-center">
            <h1 className="text-6xl font-semibold text-white lg:text-4xl">
              Comfort Meets Style{" "}
              <span className="text-blue-400">Explore Now</span>
            </h1>
            <div>
              <button className="w-1/2 px-5 py-2 mt-4 text-sm font-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">
                Shop Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
