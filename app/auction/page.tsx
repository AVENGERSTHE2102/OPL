'use client';

import React, { useState, useEffect } from 'react';
import { useAuctionStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import SpinWheel from '@/components/SpinWheel';
import SoldModal from '@/components/SoldModal';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Users, Trophy, Star } from 'lucide-react';
import { sounds } from '@/lib/sounds';
import confetti from 'canvas-confetti';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import SafeImage from '@/components/SafeImage';

export default function AuctionPage() {
  const router = useRouter();
  const {
    activeListName,
    allLists,
    isSpinning,
    setSpinning,
    selectedPlayer,
    setSelectedPlayer,
    markAsSold
  } = useAuctionStore();

  const [showSoldModal, setShowSoldModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const players = (activeListName && allLists && allLists[activeListName]) ? allLists[activeListName] : [];
  
  // Preload all images for current list
  usePreloadImages(players);

  // Handle Zustand hydration
  useEffect(() => {
    setIsHydrated(true);
  }, []);


  // Redirect if no list is active or not hydrated yet
  useEffect(() => {
    if (isHydrated && !activeListName) {
      router.push('/');
    }
  }, [activeListName, router, isHydrated]);

  if (!isHydrated || !activeListName) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const handleWinner = (player: any) => {
    setSelectedPlayer(player);
    sounds.playSuccess();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ffffff', '#1e293b']
    });
  };

  const handleSoldConfirm = async (team: string, price: number) => {
    const success = await markAsSold(team, price);
    if (success) {
      setShowSoldModal(false);
      setSelectedPlayer(null);
    } else {
      alert('Failed to save to Google Sheets. Please check your APPS_SCRIPT_URL in .env.local and restart terminal.');
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen relative">
      {/* Header */}
      <header className="p-6 md:p-8 flex items-center justify-between glass border-b border-white/5 sticky top-0 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.push('/')}
            className="p-3 hover:bg-white/10 rounded-2xl transition-all group"
          >
            <ArrowLeft className="w-6 h-6 text-white group-hover:text-primary transition-colors" />
          </button>
          <div>
            <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">{activeListName}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>{players.length} Players Remaining</span>
            </div>
          </div>
        </div>
        
        <div className="hidden md:flex items-center gap-4">
          <div className="px-4 py-2 rounded-xl glass-card border-primary/20 flex items-center gap-2 text-primary font-bold">
            <Trophy className="w-4 h-4" />
            <span>LIVE AUCTION</span>
          </div>
        </div>
      </header>

      <main className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 max-w-7xl mx-auto w-full items-center">
        {/* Left Side: Wheel */}
        <section className="flex flex-col items-center justify-center space-y-8">
          <div className="relative">
            <SpinWheel 
              items={players} 
              onFinished={handleWinner} 
              isSpinning={isSpinning} 
              setIsSpinning={setSpinning} 
            />
          </div>
        </section>

        {/* Right Side: Details */}
        <section className="relative h-full flex flex-col justify-center min-h-[500px]">
          <AnimatePresence mode="wait">
            {!selectedPlayer ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card p-12 text-center space-y-6 flex flex-col items-center justify-center h-full border-dashed"
              >
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                  <Star className="w-12 h-12 text-white/20" />
                </div>
                <h2 className="text-4xl font-black text-white/20 uppercase tracking-tighter">Ready for Draw</h2>
                <p className="text-muted-foreground max-w-xs mx-auto">
                  Click the spin button to select the next player for the auction.
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="player"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass-card relative overflow-hidden group border-primary/30"
              >
                <div className="absolute top-0 right-0 p-6">
                   <div className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-black uppercase tracking-widest">
                     In Selection
                   </div>
                </div>

                <div className="p-8 space-y-8">
                  <div className="relative aspect-square w-full max-w-[300px] mx-auto group">
                    <div className="absolute inset-0 bg-primary/20 blur-[50px] opacity-50 group-hover:opacity-100 transition-opacity" />
                    <SafeImage 
                      src={selectedPlayer.image} 
                      alt={selectedPlayer.name}
                      className="w-full h-full object-cover object-[center_20%] rounded-3xl border-2 border-white/10 relative z-10"
                    />
                  </div>

                  <div className="text-center space-y-2">
                    <h2 className="text-5xl font-black text-white italic tracking-tighter uppercase">{selectedPlayer.name}</h2>
                    <p className="text-primary text-xl font-bold uppercase tracking-[0.2em]">{selectedPlayer.role}</p>
                    {selectedPlayer.basePrice && (
                       <p className="text-muted-foreground text-lg">Base Price: {selectedPlayer.basePrice} Points</p>
                    )}
                  </div>

                  <div className="pt-8 border-t border-white/5 grid grid-cols-2 gap-4">
                     <button 
                       onClick={() => setSelectedPlayer(null)}
                       disabled={isSpinning}
                       className="py-4 rounded-xl glass border-white/10 text-white font-bold hover:bg-white/5 transition-all"
                     >
                       RE-SPIN
                     </button>
                     <button 
                       onClick={() => setShowSoldModal(true)}
                       disabled={isSpinning}
                       className="py-4 rounded-xl bg-primary text-black font-black uppercase tracking-widest shadow-neon hover:scale-105 active:scale-95 transition-all"
                     >
                       SOLD
                     </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </main>

      <AnimatePresence>
        {showSoldModal && selectedPlayer && (
          <SoldModal 
            player={selectedPlayer} 
            onConfirm={handleSoldConfirm}
            onCancel={() => setShowSoldModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
