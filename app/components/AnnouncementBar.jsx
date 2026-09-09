"use client";
import { useState, useEffect } from "react";
import { FiX, FiChevronLeft, FiChevronRight, FiTruck } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

const messages = [
  { text: "Free delivery on orders over Rs. 2,500", highlight: "Rs. 2,500" },
  { text: "New arrivals — Shop the latest serums & moisturizers", highlight: "New arrivals" },
  { text: "Use code SKINCARE15 for 15% off your first order", highlight: "SKINCARE15" },
  { text: "100% clean ingredients — dermatologist tested & approved", highlight: "clean ingredients" },
];

const AnnouncementBar = ({ onOpenTrackOrder }) => {
  const [visible, setVisible] = useState(true);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    if (!visible) return;
    const timer = setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % messages.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [visible]);

  const go = (dir) => {
    setDirection(dir);
    setIndex((i) => (i + dir + messages.length) % messages.length);
  };

  if (!visible) return null;

  const { text, highlight } = messages[index];
  const parts = text.split(highlight);

  return (
    <div className="relative w-full bg-[#242320] text-white overflow-hidden border-b border-white/10 z-50">
      {/* Bottom subtle shimmer accent */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-skin-terracotta/40 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-8 sm:h-[34px] flex items-center justify-between text-[11px] font-sans">
        {/* Left: Message carousel */}
        <div className="flex-1 flex items-center justify-center sm:justify-start gap-2 overflow-hidden">
          {/* Prev button */}
          <button
            onClick={() => go(-1)}
            aria-label="Previous announcement"
            className="shrink-0 text-white/40 hover:text-skin-terracotta transition-colors hidden md:inline-flex"
          >
            <FiChevronLeft size={13} />
          </button>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={index}
              custom={direction}
              initial={{ opacity: 0, y: direction > 0 ? 8 : -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction > 0 ? -8 : 8 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="flex items-center gap-1.5 tracking-[0.14em] uppercase text-[10px] sm:text-[11px] font-medium text-white/80 whitespace-nowrap truncate"
            >
              <HiSparkles size={11} className="text-skin-terracotta shrink-0" />
              <span>
                {parts[0]}
                <span className="text-skin-terracotta font-semibold">{highlight}</span>
                {parts[1]}
              </span>
            </motion.div>
          </AnimatePresence>

          {/* Next button */}
          <button
            onClick={() => go(1)}
            aria-label="Next announcement"
            className="shrink-0 text-white/40 hover:text-skin-terracotta transition-colors hidden md:inline-flex"
          >
            <FiChevronRight size={13} />
          </button>
        </div>

        {/* Right: Track Order & Dismiss */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0 pl-2">
          {onOpenTrackOrder && (
            <button
              onClick={onOpenTrackOrder}
              className="group flex items-center gap-1.5 text-[10.5px] tracking-[0.14em] uppercase text-white/70 hover:text-white transition-colors cursor-pointer py-1"
            >
              <FiTruck
                size={12}
                className="text-skin-terracotta group-hover:scale-110 transition-transform"
              />
              <span className="hidden sm:inline">Track Order</span>
              <span className="sm:hidden">Track</span>
            </button>
          )}

          {/* Close button */}
          <button
            onClick={() => setVisible(false)}
            aria-label="Dismiss utility bar"
            className="text-white/30 hover:text-white transition-colors cursor-pointer"
          >
            <FiX size={12} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
