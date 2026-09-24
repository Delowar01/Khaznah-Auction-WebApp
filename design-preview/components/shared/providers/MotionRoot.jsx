"use client";

import { MotionConfig } from "motion/react";

/** Honour the visitor's reduced-motion preference for every animation. */
export function MotionRoot({ children }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
