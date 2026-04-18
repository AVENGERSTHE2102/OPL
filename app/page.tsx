'use client';

import { useAuctionStore } from '@/lib/store';
import { getPlayersData } from '@/lib/data-loader';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, Users, ChevronRight } from 'lucide-react';
import { useEffect } from 'react';

const LIST_KEYS = ['List 1', 'List 2', 'List 3', 'List 4', 'List 5', 'List 6', 'List 7', 'List 8'];

export default function LandingPage() {
  const router = useRouter();
  const { allLists, initializeLists, setActiveList } = useAuctionStore();
  
  // Initialize from JSON on first mount
  useEffect(() => {
    const rawData = getPlayersData();
    initializeLists(rawData);
  }, [initializeLists]);

  const handleListSelect = (listName: string) => {
    setActiveList(listName);
    router.push('/auction');
  };

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-secondary/10 rounded-full blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12 relative z-10"
      >
        <div className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-primary/10 border border-primary/20 backdrop-blur-sm shadow-neon">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-4 bg-gradient-to-b from-white to-gray-400 bg-clip-text text-transparent">
          Onyx Auction
        </h1>
        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
          Premium player auction management system. Select a list to begin the draw.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-full max-w-6xl relative z-10">
        {LIST_KEYS.map((listName, index) => {
          // READ FROM STORE INSTEAD OF RAW DATA
          const playerCount = allLists[listName]?.length || 0;
          return (
            <motion.button
              key={listName}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              onClick={() => handleListSelect(listName)}
              className="group relative flex flex-col items-start p-6 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 text-left border border-white/5 hover:border-primary/30"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all">
                <ChevronRight className="w-5 h-5 text-primary" />
              </div>
              
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-primary transition-colors">
                {listName}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Users className="w-4 h-4" />
                <span>{playerCount} Players available</span>
              </div>
              
              <div className="mt-4 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: playerCount > 0 ? '100%' : '0%' }}
                  transition={{ delay: 0.5 + index * 0.05, duration: 1 }}
                  className={`h-full ${playerCount > 0 ? 'bg-primary' : 'bg-gray-600'}`}
                />
              </div>
            </motion.button>
          );
        })}
      </div>

      <footer className="mt-20 text-muted-foreground flex items-center gap-6 text-sm">
        <button 
          onClick={() => {
            if(confirm("Permanently reset all local data?")) useAuctionStore.getState().reset();
          }}
          className="hover:text-red-400 transition-colors"
        >
          Reset All Lists
        </button>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Live Management System
        </div>
      </footer>
    </main>
  );
}
