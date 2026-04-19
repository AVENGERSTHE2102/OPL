'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/lib/types';
import { X, Check } from 'lucide-react';
import LoadingOverlay from './LoadingOverlay';
import SafeImage from './SafeImage';

interface SoldModalProps {
  player: Player;
  onConfirm: (team: string, price: number) => void;
  onCancel: () => void;
}

const TEAMS = [
  { id: 't1', name: 'Onyx Strikers', color: 'bg-amber-500', logo: '/assets/teams/strikers.jpeg' },
  { id: 't2', name: 'Onyx Rangers', color: 'bg-emerald-500', logo: '/assets/teams/rangers.jpeg' },
  { id: 't3', name: 'Onyx Titans', color: 'bg-blue-600', logo: '/assets/teams/titans.jpeg' },
  { id: 't4', name: 'Onyx Nemeses', color: 'bg-rose-600', logo: '/assets/teams/nemesis.jpeg' },
];

const SoldModal: React.FC<SoldModalProps> = ({ player, onConfirm, onCancel }) => {
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [price, setPrice] = useState<string>(player.basePrice?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleConfirm = async () => {
    if (selectedTeam && price && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onConfirm(selectedTeam, parseInt(price));
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <AnimatePresence>
        {isSubmitting && (
          <LoadingOverlay message={`Recording ${player.name} to Sheets...`} />
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="glass-card w-full max-w-lg p-8 space-y-8 border border-white/10"
      >
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/30 flex-shrink-0">
               <SafeImage 
                 src={player.image} 
                 alt={player.name}
                 className="w-full h-full object-cover object-[center_20%]"
               />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Process Sale</h2>
              <p className="text-muted-foreground">{player.name} • {player.role}</p>
            </div>
          </div>
          <button onClick={onCancel} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X className="w-6 h-6 text-muted-foreground" />
          </button>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Select Team</label>
          <div className="grid grid-cols-2 gap-4">
            {TEAMS.map((team) => (
              <button
                key={team.id}
                onClick={() => setSelectedTeam(team.name)}
                className={`relative p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
                  selectedTeam === team.name
                    ? 'border-primary bg-primary/10 shadow-neon'
                    : 'border-white/5 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden shadow-lg border border-white/10">
                    <SafeImage src={team.logo} alt={team.name} className="w-full h-full object-cover" />
                </div>
                <span className={`font-bold ${selectedTeam === team.name ? 'text-primary' : 'text-white'}`}>
                  {team.name}
                </span>
                {selectedTeam === team.name && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black">
                    <Check className="w-4 h-4" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest">Final Price (Points)</label>
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <span className="text-2xl font-black text-primary">Pts</span>
            </div>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter amount..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-6 pl-14 pr-6 text-3xl font-black text-white focus:outline-none focus:border-primary transition-colors transition-all focus:ring-1 focus:ring-primary/30"
            />
          </div>
        </div>

        <button
          onClick={handleConfirm}
          disabled={!selectedTeam || !price || isSubmitting}
          className="w-full py-6 bg-primary hover:bg-primary-hover disabled:bg-gray-800 disabled:text-gray-500 text-black font-black text-2xl rounded-2xl shadow-neon transition-all hover:scale-[1.02] active:scale-95 uppercase tracking-widest"
        >
          {isSubmitting ? 'PROCESSING...' : 'CONFIRM SALE'}
        </button>
      </motion.div>
    </div>
  );
};

export default SoldModal;
