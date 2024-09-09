import React, { useEffect, useRef } from "react";
import { useGameStore, } from "../../lib/store/game-store";
import { useToast } from "@/components/ui/use-toast";
import { FormattedNumber } from '../FormattedNumber';

const boosters = [
  {
    name: "",
    value: 2000,
    icon: "/bi-robot.png",
  },
  {
    name: "",
    value: 2000,
    icon: "/thunder-bolt.png",
  },
];

const FIXED_VOLUME = 0.3;

export default function Boosters() {
  const { subtractPoints, points } = useGameStore();
  const { toast } = useToast();
  const NotificationAudioRef = useRef(null);

  useEffect(() => {
    const { resetBoostsIfNeeded, resetTurboBoostsIfNeeded } = useGameStore.getState();
    resetBoostsIfNeeded();
    resetTurboBoostsIfNeeded();
  }, []);

  function hapticFeedback() {
    if (window.Telegram && window.Telegram.WebApp) {
      const tele = window.Telegram.WebApp;
      tele.HapticFeedback.impactOccurred("light");
    }
    return;
  }

  const playNotificationSound = () => {
    if (NotificationAudioRef.current) {
      NotificationAudioRef.current.currentTime = 0; // Reset audio to start
      // NotificationAudioRef.current.volume = FIXED_VOLUME;
      NotificationAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  }

  const handleBuyBooster = (value) => {
    if (value > points) {
      hapticFeedback();
      playNotificationSound();
      toast({
        description: "Sorry you dont have enough points to purchase this booster. Tap Tap Tap!",
      });
    } else {
      subtractPoints(value);
      hapticFeedback();
      playNotificationSound();
      toast({
        description: "You're getting there. LFG!!",
      });
    }
  };

  return (
    <div className="flex gap-2">
      {boosters.map((booster, index) => (
        <button
          key={index}
          onClick={() => handleBuyBooster(booster.value)}
          className="flex flex-col items-center overflow-x-auto text-white h-[151px] w-[171px] bg-[#1E1E1E]/50 rounded-2xl active:border-2 border-[#535353]"
        >
          <img
            src={booster.icon}
            alt="icon"
            width={67}
            height={67}
            className="my-6"
          />
          <span>{booster.name}</span>
          <div className="flex gap-1 items-center">
            <img
              src="/ziptos-coin.svg"
              alt="ziptos-coin"
              width={25}
              height={25}
            />
            <span className="mb-1 text-[16px]"><FormattedNumber value={booster.value} /></span>
          </div>
        </button>
      ))}
      <audio ref={NotificationAudioRef} src="/sounds/notification.mp3" />
    </div>
  );
}
