"use client";

import React, { useState, useEffect } from "react";

const AutoSlider = () => {
  const slides = [
    { id: 1, src: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Shopping" },
    { id: 2, src: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Fashion" },
    { id: 3, src: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1600", alt: "Products" },
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-white/10 bg-[#14111d] shadow-2xl shadow-black/40">
      {/* Slides */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide) => (
          <div key={slide.id} className="w-full flex-shrink-0">
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-64 sm:h-80 md:h-[30rem] object-cover opacity-85"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${
              current === i ? "bg-purple-300 w-8" : "bg-white/40 hover:bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default AutoSlider;
