import React, { useEffect, useState, useRef } from 'react';
import { Progress } from "../ui/progress";
import { BatteryChargingIcon } from 'lucide-react';
import { useGameStore } from '../../lib/store/game-store';

const FIXED_VOLUME = 0.3;

export default function TokenEnergyProgressBar() {
  const { calculateAndUpdateEnergy, energy, maxEnergy, lastRechargeTime, updateEnergyOnStart } = useGameStore();
  const [displayEnergy, setDisplayEnergy] = useState(energy);
  const [intervalId, setIntervalId] = useState(null);
  const energyDownAudioRef = useRef(null);

  useEffect(() => {
    // Update energy on component mount (app start)
    updateEnergyOnStart();
    
    // Initial energy calculation
    setDisplayEnergy(calculateAndUpdateEnergy());

    // Start the interval to update energy every second
    const interval = setInterval(() => {
      setDisplayEnergy(calculateAndUpdateEnergy());
    }, 1000);
    setIntervalId(interval);

    // Clean up the interval when the component unmounts
    return () => clearInterval(interval);
  }, [calculateAndUpdateEnergy, updateEnergyOnStart]);

  useEffect(() => {
    if (displayEnergy === 0 && energyDownAudioRef.current) {
      energyDownAudioRef.current.currentTime = 0;
      energyDownAudioRef.current.volume = FIXED_VOLUME;
      energyDownAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  }, [displayEnergy]);

  // Calculate the progress percentage
  const progressPercentage = (displayEnergy / maxEnergy) * 100;

  return (
    <div className='w-[216px] mb-1'>
      <Progress value={progressPercentage} className="w-[100%] h-[6px]" />
      {/* <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>{Math.floor(displayEnergy)}</span>
        <span>{maxEnergy}</span>
      </div> */}
      <audio ref={energyDownAudioRef} src="/sounds/energy-down.mp3" />
    </div>
  )
}