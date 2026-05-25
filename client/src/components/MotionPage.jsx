import { motion } from 'framer-motion';

export default function MotionPage({ children, className = '' }) {
  return (
    <motion.main
      className={className}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      {children}
    </motion.main>
  );
}
