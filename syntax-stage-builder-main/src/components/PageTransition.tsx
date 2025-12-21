import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageTransition - Smooth page transition wrapper
 * Adds fade and slide animations when pages change
 * Performance-optimized with will-change hints
 */
export const PageTransition = ({ children, className = "" }: PageTransitionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1], // Custom easing for smooth animation
      }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
};



