import React, { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: 'purple' | 'blue' | 'pink' | 'emerald' | 'none';
}

export const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', glowColor = 'none' }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Motion values to track normalize mouse position (0 to 1)
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Smooth springs to damp rotation speeds and prevent sudden jumps
  const springConfig = { damping: 25, stiffness: 220, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [0, 1], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-12, 12]), springConfig);

  // Glare highlight tracking
  const shineX = useSpring(useTransform(x, [0, 1], ['0%', '100%']), springConfig);
  const shineY = useSpring(useTransform(y, [0, 1], ['0%', '100%']), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Normalize coordinates relative to card top-left corner
    const relativeX = (e.clientX - rect.left) / width;
    const relativeY = (e.clientY - rect.top) / height;
    
    x.set(relativeX);
    y.set(relativeY);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Shadow/border style helper
  const getGlowStyles = () => {
    switch (glowColor) {
      case 'purple':
        return 'hover:border-purple-500/30 hover:shadow-[0_0_30px_-5px_rgba(168,85,247,0.25)]';
      case 'blue':
        return 'hover:border-blue-500/30 hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.25)]';
      case 'pink':
        return 'hover:border-pink-500/30 hover:shadow-[0_0_30px_-5px_rgba(236,72,153,0.25)]';
      case 'emerald':
        return 'hover:border-emerald-500/30 hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)]';
      default:
        return 'hover:border-white/10';
    }
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.995 }}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        perspective: 1000,
      }}
      className={`glass relative overflow-hidden rounded-2xl border border-white/5 transition-all duration-350 ${getGlowStyles()} ${className}`}
    >
      {/* Glare/Shine Effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-20 mix-blend-overlay"
        style={{
          background: `radial-gradient(circle at var(--shine-x, 50%) var(--shine-y, 50%), rgba(255,255,255,0.12) 0%, transparent 55%)`,
          // Pass coordinate spring values using typescript-safe CSS properties
          // @ts-ignore
          '--shine-x': useTransform(shineX, (val) => val),
          // @ts-ignore
          '--shine-y': useTransform(shineY, (val) => val),
        }}
      />
      {/* Content wrapper with translateZ to separate it from the background card plane */}
      <div 
        className="relative z-10 w-full h-full"
        style={{ 
          transform: 'translateZ(20px)', 
          transformStyle: 'preserve-3d' 
        }}
      >
        {children}
      </div>
    </motion.div>
  );
};
