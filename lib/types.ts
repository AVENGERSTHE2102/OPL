export type Player = {
  id: string;
  name: string;
  image: string;
  role: string;
  basePrice?: number;
  category?: string;
};

export type ListData = {
  [key: string]: Player[];
};

export type SoldRecord = {
  listName: string;
  playerId: string;
  playerName: string;
  role: string;
  team: string;
  price: number;
  timestamp: string;
};

export type AuctionState = {
  activeListName: string | null;
  // Track all lists to persist remaining player counts
  allLists: ListData;
  isSpinning: boolean;
  selectedPlayer: Player | null;
  
  // Actions
  initializeLists: (data: ListData) => void;
  setActiveList: (name: string) => void;
  setSpinning: (status: boolean) => void;
  setSelectedPlayer: (player: Player | null) => void;
  markAsSold: (team: string, price: number) => Promise<boolean>;
  reset: () => void;
};
