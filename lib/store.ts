import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuctionState, Player, ListData } from './types';

export const useAuctionStore = create<AuctionState>()(
  persist(
    (set, get) => ({
      activeListName: null,
      allLists: {},
      isSpinning: false,
      selectedPlayer: null,

      initializeLists: (data: ListData) => {
        // Only initialize if we haven't loaded any data yet
        if (Object.keys(get().allLists).length === 0) {
          set({ allLists: data });
        }
      },

      setActiveList: (name: string) => {
        set({
          activeListName: name,
          selectedPlayer: null,
          isSpinning: false,
        });
      },

      setSpinning: (status: boolean) => set({ isSpinning: status }),

      setSelectedPlayer: (player: Player | null) => set({ selectedPlayer: player }),

      markAsSold: async (team: string, price: number) => {
        const { selectedPlayer, activeListName, allLists } = get();
        if (!selectedPlayer || !activeListName) return false;

        const soldRecord = {
          listName: activeListName,
          playerId: selectedPlayer.id,
          playerName: selectedPlayer.name,
          role: selectedPlayer.role,
          team,
          price,
          timestamp: new Date().toISOString(),
        };

        try {
          // Send to API
          const response = await fetch('/api/sold', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(soldRecord),
          });

          if (!response.ok) throw new Error('Failed to save to GS');

          // Update specifically the current active list
          const currentListPlayers = allLists[activeListName] || [];
          const updatedLists = {
            ...allLists,
            [activeListName]: currentListPlayers.filter(p => p.id !== selectedPlayer.id)
          };

          set({
            allLists: updatedLists,
            selectedPlayer: null,
          });

          return true;
        } catch (error) {
          console.error('Error recording sale:', error);
          return false;
        }
      },

      reset: () => {
        set({
          activeListName: null,
          allLists: {},
          isSpinning: false,
          selectedPlayer: null,
        });
      },
    }),
    {
      name: 'auction-storage-v2', // Updated key for new structure
    }
  )
);
