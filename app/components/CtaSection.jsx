import React from "react";

const CtaSection = () => {
  return (
    <div>
      <div
        className="w-full text-white"
        style={{
          backgroundImage: "url('https://source.unsplash.com/random/640x480')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundBlendMode: "multiply",
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <div className="container flex flex-col content-center justify-center p-4 py-20 mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center">
            Get Our Updates
          </h1>
          <p className="pt-2 pb-6 text-lg md:text-xl text-center">
            Find out about events and latest news
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full sm:w-2/3 p-3 rounded-lg text-black"
            />
            <button
              type="button"
              className="w-full sm:w-1/3 p-3 font-semibold bg-white text-black rounded-lg hover:bg-gray-200 transition"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtaSection;
