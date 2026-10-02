import React, { useEffect, useState } from "react";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only enable on desktop
    if (window.matchMedia("(max-width: 768px)").matches) return;

    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      
      // Check if hovering over a clickable element
      const target = e.target;
      setIsPointer(
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button'
      );
    };

    window.addEventListener("mousemove", onMouseMove);
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  if (window.matchMedia("(max-width: 768px)").matches) return null;

  return (
    <>
      <div 
        className="fixed top-0 left-0 w-4 h-4 bg-primary-500 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-transform duration-75 ease-out"
        style={{ 
          transform: `translate3d(${position.x - 8}px, ${position.y - 8}px, 0) scale(${isPointer ? 1.5 : 1})`,
        }}
      />
      <div 
        className="fixed top-0 left-0 w-10 h-10 border border-primary-400 rounded-full pointer-events-none z-[9998] transition-transform duration-300 ease-out opacity-50"
        style={{ 
          transform: `translate3d(${position.x - 20}px, ${position.y - 20}px, 0) scale(${isPointer ? 1.2 : 1})`,
        }}
      />
      <style>{`
        @media (min-width: 769px) {
          * { cursor: none !important; }
        }
      `}</style>
    </>
  );
}