import React, { useEffect, useState, useRef } from 'react';
import TotalToken from '../components/TotalToken';
import Boosters from '../components/booster-page-features/Boosters';
import { useGameStore } from '../lib/store/game-store';

const FIXED_VOLUME = 0.3;

export default function Boost() {
  const { boostEnergy, getBoostStatus, resetBoostsIfNeeded, boostTurboTaps, getTurboBoostStatus, activateTurboTaps, isEnergyBoostAllowed, getTurboActiveStatus } = useGameStore();
  const [boostStatus, setBoostStatus] = useState(getBoostStatus());
  const [turboBoostStatus, setTurboBoostStatus] = useState(getTurboBoostStatus());
  const [energyBoostAllowed, setEnergyBoostAllowed] = useState(isEnergyBoostAllowed());
  const [turboActiveStatus, setTurboActiveStatus] = useState(getTurboActiveStatus());
  const turboBoosterAudioRef = useRef(null);
  const energyBoosterAudioRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setBoostStatus(getBoostStatus());
      setTurboBoostStatus(getTurboBoostStatus());
      setEnergyBoostAllowed(isEnergyBoostAllowed());
      setTurboActiveStatus(getTurboActiveStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [getBoostStatus, getTurboBoostStatus, isEnergyBoostAllowed, getTurboActiveStatus]);

  function hapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tele = window.Telegram.WebApp;
      tele.HapticFeedback.impactOccurred("light");
    }
    return;
  }

  function hardHapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tele = window.Telegram.WebApp;
      tele.HapticFeedback.impactOccurred("heavy");
    }
    return;
  }

  const playTurboBoostSound = () => {
    if (turboBoosterAudioRef.current) {
      turboBoosterAudioRef.current.currentTime = 0; // Reset audio to start
      turboBoosterAudioRef.current.volume = FIXED_VOLUME;
      turboBoosterAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  };

  const playEnergyBoostSound = () => {
    if (energyBoosterAudioRef.current) {
      energyBoosterAudioRef.current.currentTime = 0; // Reset audio to start
      energyBoosterAudioRef.current.volume = FIXED_VOLUME;
      energyBoosterAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  };

  const handleFullEnergyBoost = () => {
    if (!energyBoostAllowed) {
      console.log('Energy boost not allowed: energy is above 70%');
      hardHapticFeedback();
      return;
    }

    const boosted = boostEnergy();
    if (boosted) {
      console.log('Energy boosted to maximum!');
      playEnergyBoostSound();
      hapticFeedback();
    } else {
      console.log('Boost not available');
      hardHapticFeedback();
    }
    setBoostStatus(getBoostStatus());
    setEnergyBoostAllowed(isEnergyBoostAllowed());
  }

  const handleTurboBoost = () => {
    if (turboActiveStatus.active) {
      console.log('Turbo Taps already active');
      hardHapticFeedback();
      return;
    }

    const boosted = boostTurboTaps();
    if (boosted) {
      activateTurboTaps();
      playTurboBoostSound();
      hapticFeedback(); 
      console.log('Turbo Taps activated!');
    } else {
      console.log('Turbo Taps not available');
      hardHapticFeedback();
    }
    setTurboBoostStatus(getTurboBoostStatus());
    setTurboActiveStatus(getTurboActiveStatus());
  }

  const formatTime = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }


  return (
    <main className='h-[90vh] overflow-auto pt-10 pb-7 px-5'>
      <span className='text-center block text-sm text-[#5CB75F]'>Your balance</span>
      <TotalToken />

      <h2 className='text-white font-bold text-xl mt-10 mb-[14px]'>Free Boost</h2>

      <button 
        className={`flex w-full justify-between items-center text-white rounded-[15px] active:border-2 border-[#535353] bg-[#484848]/50 h-16 pl-4 pr-8 mb-[6px] ${(!boostStatus.available || !energyBoostAllowed) ? 'opacity-50' : ''}`}
        onClick={handleFullEnergyBoost}
        disabled={!boostStatus.available || !energyBoostAllowed}
      >
        <div className='flex gap-3 items-center justify-center'>
          <img src="thunder-bolt.png" alt="icon" width={42} height={42}/>
          <div className='flex flex-col'>
            <span className='font-bold text-[16px]'>Full Energy</span>
            <span className='font-thin text-sm'>
              {boostStatus.availableBoosts}/{boostStatus.maxBoosts} available
            </span>
          </div>
        </div>
        <span className='text-[14px]'>
          {boostStatus.available && energyBoostAllowed ? 'Free' : 
           !energyBoostAllowed && !boostStatus.available ?  formatTime(boostStatus.remainingTime) :
           !energyBoostAllowed ? 'Energy > 70%' :
           formatTime(boostStatus.remainingTime)}
        </span>
      </button>
        
      <button 
        className={`flex w-full justify-between items-center text-white rounded-[15px] active:border-2 border-[#535353] bg-[#484848]/50 h-16 pl-4 pr-8 mb-[6px] ${(!turboBoostStatus.available || turboActiveStatus.active) ? 'opacity-50' : ''}`}
        onClick={handleTurboBoost}
        disabled={!turboBoostStatus.available || turboActiveStatus.active}
      >
        <div className='flex gap-3 items-center justify-center'>
          <img src="rocket.png" alt="icon" width={42} height={42}/>
          <div className='flex flex-col'>
            <span className='font-bold text-[16px]'>Turbo Taps</span>
            <span className='font-thin text-sm'>
              {turboBoostStatus.availableBoosts}/{turboBoostStatus.maxBoosts} available
            </span>
          </div>
        </div>
        <span className='text-[14px] text-[#F33439]'>
          {turboActiveStatus.active ? `Active: ${formatTime(turboActiveStatus.remainingTime)}` :
           turboBoostStatus.available ? 'Free' : 
           formatTime(turboBoostStatus.remainingTime)}
        </span>
      </button>

        <h2 className='text-white font-bold text-xl mt-10 mb-[20px]'>Buy Boosters</h2>
        <Boosters />
        <audio ref={energyBoosterAudioRef} src="/sounds/energy-boost.mp3" />
        <audio ref={turboBoosterAudioRef} src="/sounds/turbo-boost.mp3" />
    </main>
  )
}
