import React, { useEffect, useState, useCallback, useRef } from "react";
import { useGameStore } from "../../lib/store/game-store";
import FallingMelons from "./FallingMelons";
import { useUser } from "../../contexts/UserContext";
import { db } from "../../config/firebase";
import {
  collection,
  query,
  where,
  updateDoc,
  increment,
  getDocs,
} from "firebase/firestore";

const CLICK_COOLDOWN = 10; // ms
const DOUBLE_TAP_DELAY = 300; // ms
const ANIMATION_DURATION = 1000; // ms

const tele = window.Telegram?.WebApp;

const images = {
  idle: "/zippo/01 Zippo-Idle.gif",
  wiggleStart: "/zippo/02 Wiggle Start.gif",
  wiggle: "/zippo/03 Wiggle.gif",
  wiggleEnd: "/zippo/04 Wiggle End.gif",
};

export default function HomePageImage() {
  const {
    energy,
    getPointsToAdd,
    reduceEnergy,
    addPoints,
    getTurboActiveStatus,
  } = useGameStore();
  const { user } = useUser();
  const [currentImage, setCurrentImage] = useState(images.idle);
  const [tapCount, setTapCount] = useState(0);
  const [totalClicks, setTotalClicks] = useState(0);
  const lastTapTimeRef = useRef(0);
  const [clicks, setClicks] = useState([]);
  const [turboActiveStatus, setTurboActiveStatus] = useState(
    getTurboActiveStatus()
  );

  // Preload images
  useEffect(() => {
    Object.values(images).forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const resetCounters = useCallback(() => {
    setTotalClicks(0);
    setTapCount(0);
  }, []);

  const hapticFeedback = useCallback(() => {
    if (tele && tele.HapticFeedback && tele.HapticFeedback.impactOccurred) {
      tele.HapticFeedback.impactOccurred("rigid");
    }
  }, []);

  const handleClick = useCallback((e) => {
    const now = Date.now();
    if (now - lastTapTimeRef.current < CLICK_COOLDOWN) return;

    hapticFeedback();

    const pointsToAdd = getPointsToAdd();
    const energyToReduce = pointsToAdd;

    if (energy < energyToReduce) {
      setCurrentImage(images.wiggleEnd);
      setTimeout(() => {
        setCurrentImage(images.idle);
        resetCounters();
      }, 5000);

      reduceEnergy(energy);
      return;
    }

    reduceEnergy(energyToReduce);
    addPoints(pointsToAdd);

    setTotalClicks((prevTotal) => prevTotal + 1);
    setTapCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 1) {
        setCurrentImage(images.wiggleStart);
      } else if (newCount >= 2) {
        setCurrentImage(images.wiggle);
      }
      return newCount;
    });

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClicks((prevClicks) => [
      ...prevClicks,
      { id: now, x, y, pointsToAdd: getPointsToAdd() }
    ]);

    // Handle double tap
    if (now - lastTapTimeRef.current < DOUBLE_TAP_DELAY) {
      hapticFeedback(); // Second haptic feedback for double tap
    }

    lastTapTimeRef.current = now;

    // Clear old clicks
    setTimeout(() => {
      setClicks((prevClicks) => prevClicks.filter(click => click.id !== now));
    }, ANIMATION_DURATION);
  }, [energy, getPointsToAdd, reduceEnergy, addPoints, hapticFeedback, resetCounters]);

  const updateNumberofTaps = useCallback(async (tapCount) => {
    if (tapCount === 0) return;
    
    try {
      const referrerQuery = query(
        collection(db, "zippoUsers"),
        where("id", "==", user?.id)
      );
      const referrerSnapshot = await getDocs(referrerQuery);
      if (!referrerSnapshot.empty) {
        const referrerDoc = referrerSnapshot.docs[0];
        await updateDoc(referrerDoc.ref, {
          taps: increment(tapCount),
        });
      }

      setTotalClicks(0);
    } catch (error) {
      console.log(error);
    }
  }, [user?.id]);

  useEffect(() => {
    let timeoutId;

    if (tapCount > 0) {
      timeoutId = setTimeout(() => {
        if (Date.now() - lastTapTimeRef.current >= 900) {
          setCurrentImage(images.wiggleEnd);

          setTimeout(() => {
            setCurrentImage(images.idle);
            setTapCount(0);
          }, 5000);
        }
      }, 900);
    }

    return () => clearTimeout(timeoutId);
  }, [tapCount]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTurboActiveStatus(getTurboActiveStatus());
    }, 1000);

    return () => clearInterval(interval);
  }, [getTurboActiveStatus]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      updateNumberofTaps(totalClicks);
    }, 10000); // Update every 10 seconds

    return () => clearInterval(updateInterval);
  }, [totalClicks, updateNumberofTaps]);

  return (
    <div className="relative">
      {turboActiveStatus.active && <FallingMelons />}
      <div className="flex items-center justify-center w-full">
        <div className="relative" onClick={handleClick}>
          <div className="relative flex items-center justify-center">
            <div className="flex flex-col items-center justify-center z-10">
              <img
                src={currentImage}
                className="img pointer-events-none transition-opacity duration-300 ease-in-out"
                width={300}
                height={100}
                alt="Ziptos Logo"
              />
              <img src="/ellipse.png" alt="ellipse" className="-mt-4" />
            </div>
            <div className="absolute">
              <div className="border-[5px] border-white/10 size-[245px] rounded-full flex flex-col items-center justify-center">
                <div className="border-[5px] border-white/10 size-[196px] rounded-full"></div>
              </div>
            </div>
          </div>
          {clicks.map((click) => (
            <div
              key={click.id}
              className="absolute text-3xl font-bold text-white z-50"
              style={{
                top: `${click.y - 42}px`,
                left: `${click.x - 28}px`,
                animation: `floatUp 2s ease-out, fadeOut 1s ease-out 1s`,
              }}
            >
              +{click.pointsToAdd}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}