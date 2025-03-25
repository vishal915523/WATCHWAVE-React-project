import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-8 py-12">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between">
        <div className="lg:w-1/9 mb-10 lg:mb-0 mr-4">
          <h2 className="text-2xl font-bold mb-4">WatchWave</h2>
          <p className="text-gray-400 ">
            WatchWave is a video streaming site that offers a wide variety of anime.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;