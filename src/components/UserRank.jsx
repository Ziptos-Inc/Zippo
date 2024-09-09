import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../config/firebase';
import { useUser } from '../contexts/UserContext';
import { useGameStore } from '../lib/store/game-store';
import { useLocation } from 'react-router-dom';
import { FormattedNumber } from './FormattedNumber';

export default function UserRank() {
  const [currentRank, setCurrentRank] = useState(null);
  const [previousRank, setPreviousRank] = useState(null);
  const { user } = useUser();
  const usersCollectionRef = collection(db, 'zippoUsers');
  const { points } = useGameStore();
  const location = useLocation();

  const fetchCurrentUserRank = useCallback(async () => {
    try {
      const q = query(usersCollectionRef, orderBy('points', 'desc'));
      const querySnapshot = await getDocs(q);
      let rank = null;

      querySnapshot.docs.forEach((doc, index) => {
        if (doc.data().id === user?.id) {
          rank = index + 1;
        }
      });

      return rank;
    } catch (error) {
      console.error('Error fetching user rank:', error);
      return null;
    }
  }, [usersCollectionRef, user?.id]);

  useEffect(() => {
    const updateRank = async () => {
      const newRank = await fetchCurrentUserRank();

      // Retrieve the previous rank from localStorage
      const prevRank = JSON.parse(localStorage.getItem('ziptos-user-rank')) || null;

      setCurrentRank(newRank);
      setPreviousRank(prevRank);

      // Delay saving the new rank to localStorage by 1 second
      setTimeout(() => {
        localStorage.setItem('ziptos-user-rank', JSON.stringify(newRank));
        console.log('New rank saved to localStorage:', newRank);
      }, 1000);
    };

    updateRank();
  }, [fetchCurrentUserRank]);

  const getTrophyIcon = (rank) => {
    switch(rank) {
      case 1: return <img src="/first.png" alt='icon' width={42} height={35} />;
      case 2: return <img src="/second.png" alt='icon' width={42} height={35} />;
      case 3: return <img src="/third.png" alt='icon' width={42} height={35} />;
      default: return null;
    }
  };

  const getRankChangeIcon = (current, previous) => {
    // if (current === null || previous === null) return null;

    if (current < previous) {
      return <img src="/arrow-up.png" alt='icon'/>;
    } else if (current > previous) {
      return <img src="/arrow-down.png" alt='icon'/>;
    } else {
      return <img src="/arrow-neutral.png" alt='icon'/>;
    }
  };

  return (
    <div
      className={`flex border text-white border-[#666666] justify-between items-center rounded-[15px] h-[71px] pl-[14px] pr-[23px] min-w-[354px] ${location.pathname === '/friends' ? 'bg-[#FFB500]/20' : 'bg-[#FFFFFF]/10'}`}
    >
      <div className="flex items-center gap-[14px]">
        <span className="flex rounded-full justify-center items-center w-7 h-6 bg-[#1E1E1E]">
          {getRankChangeIcon(currentRank, previousRank)}
        </span>
        <div className="flex flex-col">
          <span className="font-bold text-[16px]">{user?.username}</span>
          <span className='text-sm flex items-center'>
            <img src="/ziptos-coin.svg" alt="logo" width={22} height={22} /><FormattedNumber value={points} />
          </span>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <span className="font-bold text-[22px]">{currentRank !== null ? currentRank : '--'}</span>
        {getTrophyIcon(currentRank)}
      </div>
    </div>
  );
}
