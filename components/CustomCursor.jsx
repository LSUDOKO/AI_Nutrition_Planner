"use client";

import { useState, useEffect, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  // Add a mounted state to track client-side rendering
  const [isMounted, setIsMounted] = useState(false);
  // Track cursor trails
  const [trails, setTrails] = useState([]);
  const trailTimeoutRef = useRef(null);

  useEffect(() => {
    // Mark component as mounted on client-side
    setIsMounted(true);
    
    // Only enable custom cursor on non-touch devices
    const isHoverDevice = window.matchMedia('(hover: hover)').matches;
    
    if (isHoverDevice) {
      const updatePosition = (e) => {
        const newPosition = { x: e.clientX, y: e.clientY };
        setPosition(newPosition);
        
        // Update trails (with throttling)
        if (trailTimeoutRef.current) clearTimeout(trailTimeoutRef.current);
        trailTimeoutRef.current = setTimeout(() => {
          setTrails(prevTrails => {
            const newTrails = [...prevTrails, { ...newPosition, id: Date.now() }];
            if (newTrails.length > 5) newTrails.shift();
            return newTrails;
          });
        }, 50);
        
        if (!visible) {
          setVisible(true);
        }
      };
      
      const handleMouseEnter = () => {
        setVisible(true);
      };
      
      const handleMouseLeave = () => {
        setVisible(false);
        setTrails([]);
      };
      
      const handleLinkHover = (e) => {
        const target = e.target.closest('a, button, [role="button"], input, select, textarea');
        if (target) {
          setIsHovering(true);
        } else {
          setIsHovering(false);
        }
      };
      
      const handleMouseDown = () => {
        setIsClicking(true);
      };
      
      const handleMouseUp = () => {
        setIsClicking(false);
      };
      
      window.addEventListener('mousemove', updatePosition);
      window.addEventListener('mouseenter', handleMouseEnter);
      window.addEventListener('mouseleave', handleMouseLeave);
      document.addEventListener('mouseover', handleLinkHover);
      document.addEventListener('mousedown', handleMouseDown);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        window.removeEventListener('mousemove', updatePosition);
        window.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseover', handleLinkHover);
        document.removeEventListener('mousedown', handleMouseDown);
        document.removeEventListener('mouseup', handleMouseUp);
        if (trailTimeoutRef.current) clearTimeout(trailTimeoutRef.current);
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
    <>
      {/* Main cursor */}
      <div 
        className={`custom-cursor ${visible ? 'visible' : ''} ${isHovering ? 'hover' : ''} ${isClicking ? 'clicking' : ''}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div className="cursor-ring"></div>
        <div className="cursor-dot"></div>
      </div>
      
      {/* Cursor trails */}
      {trails.map((trail, index) => (
        <div 
          key={trail.id}
          className="cursor-trail"
          style={{
            left: `${trail.x}px`,
            top: `${trail.y}px`,
            opacity: (index + 1) / trails.length * 0.6,
            transform: `scale(${(index + 1) / trails.length})`,
          }}
        />
      ))}
    </>
  );
}