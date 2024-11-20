"use client";

import React, { useCallback, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

export interface MagicCardProps extends React.HTMLAttributes<HTMLDivElement> {
  gradientSize?: number;
  gradientColor?: string;
  gradientOpacity?: number;
  onClick?: () => void;
}

export function MagicCard({
  children,
  className,
  gradientSize = 200,
  gradientColor = "#262626",
  gradientOpacity = 0.8,
  onClick,
}: MagicCardProps) {
  const [mounted, setMounted] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(gradientSize / 2);
  const mouseY = useMotionValue(gradientSize / 2);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!mounted) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY, mounted]
  );

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    mouseX.set(gradientSize / 2);
    mouseY.set(gradientSize / 2);
  }, [mouseX, mouseY, gradientSize]);

  const background = useMotionTemplate`
    radial-gradient(
      ${gradientSize}px circle at ${mouseX}px ${mouseY}px,
      ${gradientColor},
      transparent 80%
    )
  `;

  return (
    <div
      onClick={onClick}
      role="button"
      tabIndex={0}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "group relative flex size-full overflow-hidden rounded-xl bg-neutral-100 dark:bg-neutral-900 border text-black dark:text-white",
        className
      )}
    >
      <div className="relative z-10 w-full">{children}</div>
      {mounted && isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: gradientOpacity }}
          exit={{ opacity: 0 }}
          className="pointer-events-none absolute -inset-px rounded-xl"
          style={{
            background,
          }}
        />
      )}
    </div>
  );
}
