import { create } from 'zustand';
import { AuctionState, Player, ListData } from './types';

export const useAuctionStore = create<AuctionState>((set, get) => ({
  activeListName: null,
  allLists: {},
  isSpinning: false,
  selectedPlayer: null,

  initializeLists: async (data: ListData) => {
    try {
      // 1. Fetch sold IDs from Sheets (Source of Truth)
      const response = await fetch('/api/sold');
      const { soldIds } = await response.json();
      
      // 2. Filter raw JSON data against Sheet state
      const filteredLists: ListData = {};
      Object.keys(data).forEach(listName => {
        filteredLists[listName] = data[listName].filter(p => !soldIds.includes(p.id.toString()));
      });

      set({ allLists: filteredLists });
    } catch (error) {
      console.error('Master Init Error:', error);
      // Fallback to raw data if sheet fails
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
      const response = await fetch('/api/sold', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(soldRecord),
      });

      const result = await response.json();
      if (result.status === 'error') {
        alert(result.message); // Conflict detected
        return false;
      }

      // Update local state by removing player
      const updatedLists = {
        ...allLists,
        [activeListName]: allLists[activeListName].filter(p => p.id !== selectedPlayer.id)
      };

      set({
        allLists: updatedLists,
        selectedPlayer: null,
      });

      return true;
    } catch (error) {
      console.error('Sync Error:', error);
      return false;
    }
  },

  reset: () => {
    // Note: This only resets local view. 
    // Manual log deletion in Sheets is needed for a full reset.
    set({
      activeListName: null,
      allLists: {},
      isSpinning: false,
      selectedPlayer: null,
    });
  },
}));
