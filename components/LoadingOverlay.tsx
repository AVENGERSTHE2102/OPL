'use client';

import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  message?: string;
}

export default function LoadingOverlay({ message = "Syncing with OPL Cloud..." }: LoadingOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/60 backdrop-blur-xl"
    >
      <div className="relative">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-24 h-24 rounded-full border-b-2 border-primary border-t-2 opacity-50"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/20 animate-pulse border border-primary/40 flex items-center justify-center">
            <span className="text-primary font-black text-2xl">O</span>
          </div>
        </div>
      </div>
      
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 flex flex-col items-center gap-2"
      >
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <p className="text-white font-black uppercase tracking-[0.3em] text-sm">{message}</p>
        </div>
        <p className="text-muted-foreground text-xs uppercase tracking-widest font-bold">Please wait while we update the roster</p>
      </motion.div>
    </motion.div>
  );
}
