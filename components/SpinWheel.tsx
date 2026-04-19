'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Player } from '@/lib/types';

interface SpinWheelProps {
  items: Player[];
  onFinished: (winner: Player) => void;
  isSpinning: boolean;
  setIsSpinning: (val: boolean) => void;
}

const SpinWheel: React.FC<SpinWheelProps> = ({ items, onFinished, isSpinning, setIsSpinning }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [velocity, setVelocity] = useState(0);
  
  const colors = [
    '#0f172a', '#1e293b', '#334155', '#475569',
    '#1e1b4b', '#312e81', '#3730a3', '#4338ca'
  ];

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 20;

    ctx.clearRect(0, 0, width, height);

    if (items.length === 0) {
      ctx.fillStyle = '#444';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = '20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('No players left', centerX, centerY);
      return;
    }

    const angleStep = (2 * Math.PI) / items.length;

    items.forEach((player, i) => {
      const startAngle = i * angleStep + rotation;
      const endAngle = (i + 1) * angleStep + rotation;

      // Draw segment
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i % colors.length];
      ctx.fill();
      
      // Border
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + angleStep / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 16px sans-serif';
      const text = player.name.length > 15 ? player.name.substring(0, 12) + '...' : player.name;
      ctx.fillText(text, radius - 40, 5);
      ctx.restore();
    });

    // Outer glow/ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 8;
    ctx.stroke();

    // Center pin
    ctx.beginPath();
    ctx.arc(centerX, centerY, 30, 0, 2 * Math.PI);
    ctx.fillStyle = '#0a0a0c';
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Pointer
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 10, centerY);
    ctx.lineTo(centerX + radius - 20, centerY - 20);
    ctx.lineTo(centerX + radius - 20, centerY + 20);
    ctx.closePath();
    ctx.fillStyle = '#f59e0b';
    ctx.fill();
  };

  useEffect(() => {
    draw();
  }, [rotation, items]);

  useEffect(() => {
    let animationFrameId: number;
    let lastSegmentIndex = -1;
    
    const animate = () => {
      if (isSpinning) {
        setRotation(prev => {
          const next = prev + velocity;
          
          // Calculate current segment for tick sound
          const angleStep = (2 * Math.PI) / items.length;
          const currentSegmentIndex = Math.floor((2 * Math.PI - (next % (2 * Math.PI))) / angleStep) % items.length;
          
          if (currentSegmentIndex !== lastSegmentIndex) {
            import('@/lib/sounds').then(({ sounds }) => sounds.playTick?.());
            lastSegmentIndex = currentSegmentIndex;
          }
          
          return next;
        });

        setVelocity(prev => {
          // Add a tiny random jitter to friction for uniqueness
          const friction = 0.99 + (Math.random() * 0.005);
          return prev * friction;
        });

        if (velocity < 0.002) {
          setIsSpinning(false);
          setVelocity(0);
          
          const angleStep = (2 * Math.PI) / items.length;
          // Exact calculation for the pointer at the right (0 rad)
          let winningIndex = Math.floor((2 * Math.PI - (rotation % (2 * Math.PI))) / angleStep) % items.length;
          if (winningIndex < 0) winningIndex += items.length;
          
          onFinished(items[winningIndex]);
        }
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    if (isSpinning) {
      animationFrameId = requestAnimationFrame(animate);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isSpinning, velocity, rotation, items]);

  const spin = () => {
    if (isSpinning || items.length === 0) return;
    
    // Wider velocity range for more diverse results
    const initialVelocity = 0.35 + (Math.random() * 0.4);
    
    // Add a random push to rotation to break initial patterns
    setRotation(prev => prev + (Math.random() * Math.PI));
    
    setVelocity(initialVelocity);
    setIsSpinning(true);
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative group">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <canvas
          ref={canvasRef}
          width={600}
          height={600}
          className="max-w-full h-auto cursor-pointer drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          onClick={spin}
        />
      </div>
      
      <button
        onClick={spin}
        disabled={isSpinning || items.length === 0}
        className="px-12 py-4 bg-primary hover:bg-primary-hover disabled:bg-gray-800 disabled:text-gray-500 text-black font-black text-xl rounded-2xl shadow-neon transition-all hover:scale-105 active:scale-95 uppercase tracking-widest"
      >
        {isSpinning ? 'SPINNING...' : 'SPIN WHEEL'}
      </button>
    </div>
  );
};

export default SpinWheel;
