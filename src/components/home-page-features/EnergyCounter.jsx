import React, { useEffect, useState } from 'react';
import { useGameStore } from '../../lib/store/game-store';

export default function EnergyCounter() {
  const { calculateAndUpdateEnergy, baseMaxEnergy, energy, maxEnergy } = useGameStore();
  const [displayEnergy, setDisplayEnergy] = useState(energy);

  // const ensureStoreInitialized = () => {
  //   // const state = useGameStore.getState();
  //   // console.log('Current state:', state);
  //   if (energy === baseMaxEnergy && maxEnergy > baseMaxEnergy) {
  //     const storedState = JSON.parse(localStorage.getItem('ziptos-storage'))?.state;
  //     if (storedState && storedState.energy !== baseMaxEnergy) {
  //       useGameStore.setState(storedState);
  //       useGameStore.getState().updateEnergyOnStart();
  //     }
  //   }
  // };
  
  useEffect(() => {
    const interval = setInterval(() => {
      const updatedEnergy = calculateAndUpdateEnergy();
      setDisplayEnergy(updatedEnergy);
    }, 1000); // Check every second, but energy will only update based on rechargeInterval
    return () => clearInterval(interval);
  }, [calculateAndUpdateEnergy]);

  useEffect(() => {
    // ensureStoreInitialized();
    console.log('App mounted, current energy:', energy);
    const storedData = JSON.parse(localStorage.getItem('ziptos-storage'));
    const storedState = storedData?.state;
    console.log('Stored state:', storedState);
    console.log('Stored states:', storedData);
  }, []);

  return (
    <div className='text-white flex items-center mb-1'>
        <img src='/thunder-bolt.png' alt='energy' height={42} width={42} />
        <span className='font-bold ml-[-5px]'>{Math.floor(displayEnergy)} / {maxEnergy}</span>
    </div>
  )
}