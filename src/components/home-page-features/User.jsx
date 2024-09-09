import React, { useState, useEffect} from "react";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from '../../lib/store/game-store';

const levelNames = [
  "Novice",
  "Apprentice",
  "Adept",
  "Expert",
  "Master",
  "Champion",
  "Prodigy",
  "Virtuoso",
  "Legendary",
  "Grandmaster"
];

export default function User() {
  const [user, setUser] = useState(null);
  const { level } = useGameStore();
  

  const getLevelName = (level) => {
    return level > 10 ? levelNames[9] : levelNames[Math.min(level - 1, 9)];
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tele = window.Telegram.WebApp;
      const telegramUser = tele.initDataUnsafe?.user;
      setUser(telegramUser);
    }
  }, []);

  return (
    <div class="rounded-[20px] p-[1.38px] bg-gradient-to-r from-white/60 to-white/70 flex items-center">
      <div className="rounded-[calc(20px-1.38px)] flex items-center bg-[#2c281e] h-12">
        <img
          src="/ziptos-coin.svg"
          width={34}
          height={34}
          alt="Ziptos Logo"
          className="ml-3"
        />
        <div className="flex flex-col text-white ml-2">
          <span className="text-sm">{user?.username}</span>
          <span className="text-xs">{getLevelName(level)}</span>
        </div>
        <Separator
          orientation="vertical"
          className="h-7 bg-[#747474] ml-7 mr-4"
        />
        <img
          src="/settings.svg"
          height={18}
          width={18}
          alt="settings"
          className="mr-[19px]"
        />
      </div>
    </div>
  );
}
