import React, { useState, useEffect, useMemo, useCallback } from "react";
import { collection, query, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useUser } from "../contexts/UserContext";
import Moonloader from "react-spinners/MoonLoader";
import { Link } from 'react-router-dom';
import { FormattedNumber } from '../components/FormattedNumber';

export default function Stats() {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useUser();
  const usersCollectionRef = useMemo(() => collection(db, "zippoUsers"), []);

  const fetchLeaderboardData = useCallback(async () => {
    setLoading(true);
    try {
      const q = query(
        usersCollectionRef,
        orderBy("points", "desc"),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc, index) => ({
        ...doc.data(),
        rank: index + 1,
      }));

      return newData;
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setError("Failed to load leaderboard. Please try again later.");
      return [];
    }
  }, [usersCollectionRef]);

  const updateLeaderboard = useCallback(async () => {
    // Fetch the latest data from the database
    const newData = await fetchLeaderboardData();
    
    // Retrieve the previous data from localStorage
    const prevData = JSON.parse(localStorage.getItem('ziptos-leaderboardData') || '[]');
  
    // Create a map of previous points
    const prevRanks = new Map(prevData.map(user => [user.id, user.rank]));
  
    // Update new data with previous points before saving to localStorage
    const updatedData = newData.map(user => {
      const previousRanks = prevRanks.get(user.id);
  
      // If previousPoints is undefined, it means the user didn't exist before
      return {
        ...user,
        previousRanks: previousRanks !== undefined ? previousRanks : 0,
      };
    });
  
    // Set the leaderboard state with the updated data
    setLeaderboardData(updatedData);
  
    // After the comparison logic, now save the new data to localStorage
    // Delay updating localStorage until the component has re-rendered
    const dataToSave = newData.map(({ id, rank }) => ({ id, rank }));
    setTimeout(() => {
      localStorage.setItem('ziptos-leaderboardData', JSON.stringify(dataToSave));
      console.log('stored data', dataToSave);
    }, 1000);
  
    // Mark loading as false since we have updated the leaderboard
    setLoading(false);
  }, [fetchLeaderboardData]);
  
  useEffect(() => {
    updateLeaderboard();
  }, []);

  const getTrophyIcon = (rank) => {
    switch(rank) {
      case 1: return <img src="/first.png" alt='icon' width={42} height={35}/>;
      case 2: return <img src="/second.png" alt='icon' width={42} height={35}/>;
      case 3: return <img src="/third.png" alt='icon' width={42} height={35}/>;
      default: return null;
    }
  };

  const getPointsChangeIcon = (currentPoints, previousPoints) => {
    if (currentPoints > previousPoints) {
      return <img src="/arrow-down.png" alt='icon'/>;
    } else if (currentPoints < previousPoints) {
      return <img src="/arrow-up.png" alt='icon'/>;
    } else if (currentPoints === previousPoints) {
      return <img src="/arrow-neutral.png" alt='icon'/>;
    } else {
      return <img src="/newcomer-star.png" alt='icon'/>;
    }
  };

  const memoizedLeaderboard = useMemo(() => {
    return leaderboardData.map((userData) => (
      <li
        key={userData.id}
        className=""
      >
        <div
        className={`flex border border-[#666666] justify-between items-center rounded-[15px] h-16 pl-[14px] pr-[23px] ${
          userData.id === user?.id ? "text-sky-500" : ""
        } ${userData.rank === 1 ? 'bg-[#FFB500]' : userData.rank === 2 ? 'bg-[#5B5B5B]' : userData.rank === 3 ? 'bg-[#7C4D16]/70' : 'bg-[#1E1E1E]'}`}
        >
        <div className="flex items-center gap-[14px]">
        <span className="flex rounded-full justify-center items-center w-7 h-6 bg-[#1E1E1E]">
          {getPointsChangeIcon(userData.rank, userData.previousRanks)}
        </span>
          <div className="flex flex-col">
          <span className="font-bold text-[16px]">{userData.username || userData.first_name || userData.last_name}</span>
          <span className='text-sm flex items-center'><img src="/ziptos-coin.svg" alt="logo" width={22} height={22}/><FormattedNumber value={userData.points} /></span>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          <span className={`font-bold text-[22px] ${userData.rank > 3 ? 'pr-[36px]' : ''}`}>{userData.rank}</span>
          {getTrophyIcon(userData.rank)}
        </div>
        </div>
      </li>
    ));
  }, [leaderboardData, user]);

  if (loading)
    return (
      <div className="h-[90vh] overflow-auto pt-10 pb-7 flex justify-center items-center">
        <Moonloader color="#fdba74" size={40} />
      </div>
    );

  if (error)
    return (
      <div className="h-[90vh] overflow-auto pt-10 pb-7 text-white text-center">{error}</div>
    );

  return (
    <div className="h-[90vh] overflow-auto pt-10 pb-7 mx-5 text-white flex flex-col items-center">
      <span className="flex text-[18px] w-full items-center gap-3 font-bold mb-6"><Link to='/friends'><img src="/left-arrow.svg" alt="icon" /></Link>Leaderboard</span>
      <div className="bg-[url('/leaderboard-header.png')] mb-6 flex items-center justify-between rounded-[20px] min-h-[150px] bg-cover  max-w-[420px]">
        <div className="text-black space-y-2 pl-5">
          <h1 className='font-bold text-[20px] leading-5 max-w-[216px]'>Qualify for exclusive token via ziptos pocket.</h1>
          <p className='text-sm'>Get rewarded for ranking weekly</p>
        </div>
        <img src="/trophy.png" alt="icon" width={115} heigt={115}/>
      </div>
      <ol className="w-full space-y-2">{memoizedLeaderboard}</ol>
    </div>
  );
}