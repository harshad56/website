import { motion, HTMLMotionProps } from "framer-motion";
import { Button, ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  /**
   * Enable 3D hover effect
   */
  enable3D?: boolean;
  /**
   * Animation variant
   */
  variant?: "default" | "hero" | "outline" | "ghost" | "link" | "destructive" | "secondary";
}

/**
 * AnimatedButton - Button with 3D-style animations
 * Performance-optimized with will-change hints
 */
export const AnimatedButton = ({
  children,
  className,
  enable3D = true,
  ...props
}: AnimatedButtonProps) => {
  const motionProps: HTMLMotionProps<"button"> = enable3D
    ? {
        whileHover: {
          scale: 1.05,
          y: -3,
          rotateY: 5,
          transition: { type: "spring", stiffness: 400, damping: 17 },
        },
        whileTap: { scale: 0.95 },
        style: { transformStyle: "preserve-3d" as const },
      }
    : {
        whileHover: { scale: 1.05, y: -2 },
        whileTap: { scale: 0.95 },
      };

  return (
    <motion.div {...motionProps} className="inline-block">
      <Button
        className={cn("relative overflow-hidden", className)}
        style={{ willChange: "transform" }}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};



