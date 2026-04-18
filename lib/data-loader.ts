import playersData from '../data/players.json';
import { ListData } from './types';

export function getPlayersData(): ListData {
  return playersData.lists as ListData;
}
