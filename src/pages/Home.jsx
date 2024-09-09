import TotalToken from "../components/TotalToken";
import { Trophy, ChevronRight } from "lucide-react";
import TokenEnergyProgressBar from "../components/home-page-features/TokenEnergyProgressBar";
import HomePageImage from "../components/home-page-features/HomePageImage";
import User from '../components/home-page-features/User';
import Character from '../components/home-page-features/Character';
import EnergyCounter from '../components/home-page-features/EnergyCounter';
import { useGameStore } from '../lib/store/game-store.js';

export default function Home() {
  const { level, calculateLevel } = useGameStore();
  calculateLevel();

  return (
    <main className="flex bg-[url('/red-background.png')] h-[90vh] flex-col items-center overflow-auto pt-10 bg-cover">
      <div className="flex flex-col gap-3">
        <div className="flex gap-3 justify-center mb-[18px]">
          <User />
          <Character />
        </div>
      </div>
      <div className="w-full h-full border-t-[3px] rounded-t-[35px] flex flex-col justify-between items-center shadow-red-bg relative ">
        <div className='flex flex-col mt-3 z-50'>
          <span className='text-white mb-1 text-center font-bold'>level {level}</span>
          <TokenEnergyProgressBar />
          <TotalToken />
        </div>
        <HomePageImage />
        <div className="flex flex-col justify-end pb-2">
          <EnergyCounter />
        </div>
        <img src="/background-tree.png" alt="background-tree" className='opacity-20 absolute top-0' />
      </div>
    </main>
  );
}