"use client";
import { motion, useReducedMotion } from "framer-motion";
export function Reveal({ children, className = "" }) {
    const reduceMotion = useReducedMotion();
    return (<motion.div className={className} initial={reduceMotion ? false : { opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}>
      {children}
    </motion.div>);
}
