"use client";

import { useState, useEffect } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  // Add a mounted state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Mark component as mounted on client-side
    setIsMounted(true);
    
    // Only enable custom cursor on non-touch devices
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    
    if (isHoverDevice) {
      const updatePosition = (e) => {
        setPosition({ x: e.clientX, y: e.clientY });
        
        if (!visible) {
          setVisible(true);
        }
      };
      
      const handleMouseEnter = () => {
        setVisible(true);
      };
      
      const handleMouseLeave = () => {
        setVisible(false);
      };
      
      const handleLinkHover = (e) => {
        const target = e.target.closest('a, button, [role="button"]');
        if (target) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      };
      
      window.addEventListener('mousemove', updatePosition);
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseover', handleLinkHover);
      
      return () => {
        window.removeEventListener('mousemove', updatePosition);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseover', handleLinkHover);
      };
    }
  }, [visible]);
  
  // Don't render anything during SSR or on touch devices
  if (!isMounted) {
    return null;
  }
  
  // Skip rendering on touch-only devices
  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) {
    return null;
  }
  
  return (
    <div 
      className={`custom-cursor ${visible ? 'visible' : ''} ${isHovering ? 'hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className="cursor-content"></div>
    </div>
  );
}