'use client';

import { useEffect, useRef } from 'react';
import { Player } from '@/lib/types';

const preloadedUrls = new Set<string>();

export const usePreloadImages = (players: Player[]) => {
  const teamLogosPreloaded = useRef(false);

  useEffect(() => {
    if (!players || players.length === 0) return;

    const preloadImage = (src: string) => {
      if (preloadedUrls.has(src)) return Promise.resolve();
      
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          preloadedUrls.add(src);
          resolve(true);
        };
        img.onerror = reject;
      });
    };

    const preloadAll = async () => {
      // Preload player images
      const playerPromises = players.map(player => {
        if (player.image) {
          return preloadImage(player.image).catch(() => {});
        }
        return Promise.resolve();
      });

      // Preload team logos once
      let teamPromises: Promise<any>[] = [];
      if (!teamLogosPreloaded.current) {
        const teamLogos = [
          '/assets/teams/strikers.jpeg',
          '/assets/teams/rangers.jpeg',
          '/assets/teams/titans.jpeg',
          '/assets/teams/nemesis.jpeg'
        ];
        teamPromises = teamLogos.map(logo => preloadImage(logo).catch(() => {}));
        teamLogosPreloaded.current = true;
      }

      await Promise.all([...playerPromises, ...teamPromises]);
    };

    preloadAll();
  }, [players]);
};
