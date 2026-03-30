"use client";

import { useEffect, useState } from 'react';

export default function PubgBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden">
      {/* Background dark gradient layer */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 z-0"></div>
      
      {/* Animated Elements Layer */}
      <div className="absolute inset-0 z-10 opacity-30">
        
        {/* Airdrop */}
        <div className="absolute top-[-150px] left-[15%] w-[80px] h-[100px] animate-airdrop">
          <svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">
            {/* Parachute */}
            <path d="M 0 30 Q 30 -5 60 30 L 50 35 Q 30 15 10 35 Z" fill="#fff" opacity="0.9"/>
            <path d="M 10 35 L 20 60 M 30 25 L 30 60 M 50 35 L 40 60" stroke="#fff" strokeWidth="1.5"/>
            {/* Crate */}
            <rect x="18" y="58" width="24" height="22" fill="#dc2626" rx="2"/> 
            <path d="M 15 58 L 45 58 L 42 66 L 18 66 Z" fill="#3b82f6" opacity="0.95"/> 
          </svg>
        </div>

        {/* Pan */}
        <div className="absolute bottom-[10%] right-[15%] w-[60px] h-[120px] animate-float-slow">
          <svg viewBox="0 0 40 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-spin-slow drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">
            <circle cx="20" cy="20" r="18" fill="#0f172a" stroke="#334155" strokeWidth="2"/>
            <circle cx="20" cy="20" r="14" fill="#1e293b"/>
            <rect x="17" y="38" width="6" height="35" rx="3" fill="#334155"/>
            <circle cx="20" cy="70" r="2" fill="#0f172a"/>
          </svg>
        </div>

        {/* Flying Weapon (M416 Silhouette) */}
        <div className="absolute top-[25%] left-[-200px] w-[200px] h-[60px] animate-fly-across">
          <svg viewBox="0 0 150 50" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            {/* Rifle body */}
            <path d="M 5 25 L 25 25 L 30 35 L 45 35 L 50 25 L 90 25 L 90 20 L 125 20 L 125 22 L 145 22 L 145 26 L 125 26 L 125 30 L 80 30 L 75 42 L 60 42 L 55 30 L 25 30 Z" fill="#64748b" opacity="0.7"/>
            {/* Magazine */}
            <path d="M 62 30 L 72 30 L 70 45 L 60 45 Z" fill="#475569" opacity="0.8"/>
            <rect x="95" y="16" width="10" height="4" fill="#64748b" opacity="0.8"/>
          </svg>
        </div>

        {/* Floating Bullets */}
        <div className="absolute top-[60%] left-[80%] w-[15px] h-[45px] animate-float-delayed">
          <svg viewBox="0 0 10 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-45 drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
            <path d="M 0 10 Q 5 -2 10 10 L 9 30 L 1 30 Z" fill="#eab308" opacity="0.8"/>
            <path d="M 0 25 L 10 25" stroke="#ca8a04" strokeWidth="1"/>
          </svg>
        </div>
        
        <div className="absolute top-[40%] left-[25%] w-[12px] h-[36px] animate-float-fast">
          <svg viewBox="0 0 10 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full -rotate-[60deg] drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
             <path d="M 0 10 Q 5 -2 10 10 L 9 30 L 1 30 Z" fill="#eab308" opacity="0.8"/>
             <path d="M 0 25 L 10 25" stroke="#ca8a04" strokeWidth="1"/>
          </svg>
        </div>

        <div className="absolute top-[75%] left-[50%] w-[12px] h-[36px] animate-float-slow">
          <svg viewBox="0 0 10 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full rotate-[120deg] drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">
             <path d="M 0 10 Q 5 -2 10 10 L 9 30 L 1 30 Z" fill="#eab308" opacity="0.5"/>
             <path d="M 0 25 L 10 25" stroke="#ca8a04" strokeWidth="1"/>
          </svg>
        </div>

        {/* Helmet Level 3 */}
        <div className="absolute top-[65%] left-[5%] w-[70px] h-[70px] animate-float-delayed">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,0,0,0.6)] animate-spin-slow-reverse">
             <path d="M 10 35 C 10 10 50 10 50 35 L 50 45 C 50 50 10 50 10 45 Z" fill="#334155"/>
             <rect x="5" y="25" width="50" height="15" rx="2" fill="#0f172a"/>
             <rect x="25" y="28" width="10" height="5" fill="#ef4444" opacity="0.8"/> 
          </svg>
        </div>

        {/* Crosshair (Static pulsing) */}
        <div className="absolute top-[15%] right-[25%] w-[80px] h-[80px] animate-pulse-slow">
          <svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" opacity="0.4">
            <circle cx="30" cy="30" r="26" stroke="#ef4444" strokeWidth="2" strokeDasharray="6 4"/>
            <circle cx="30" cy="30" r="2" fill="#ef4444"/>
            <line x1="30" y1="0" x2="30" y2="12" stroke="#ef4444" strokeWidth="2"/>
            <line x1="30" y1="60" x2="30" y2="48" stroke="#ef4444" strokeWidth="2"/>
            <line x1="0" y1="30" x2="12" y2="30" stroke="#ef4444" strokeWidth="2"/>
            <line x1="60" y1="30" x2="48" y2="30" stroke="#ef4444" strokeWidth="2"/>
          </svg>
        </div>

      </div>
    </div>
  );
}
