import React, { useRef } from 'react';
import { useUser } from '../contexts/UserContext';
import { Button } from '../components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import InvitedFriends from '../components/friends-page-features/InvitedFriends';
import { Link, useLocation } from 'react-router-dom';
import UserRank from '../components/UserRank';

const FIXED_VOLUME = 0.3;

export default function Friends() {
  const { user } = useUser();
  const { toast } = useToast();
  const location = useLocation();
  const NotificationAudioRef = useRef(null);

  // if (!user) return (<div className='h-[88vh] pt-10 pb-7 text-white text-center'>No Refferals</div>);

  const referralLink = `https://t.me/Zippo_Ziptos_Bot/Zippo?startapp=${user?.referralCode}`;

  const playNotificationSound = () => {
    if (NotificationAudioRef.current) {
      NotificationAudioRef.current.currentTime = 0; // Reset audio to start
      // NotificationAudioRef.current.volume = FIXED_VOLUME;
      NotificationAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
    }
  }

  function handleClick(referralLink) {
    navigator.clipboard.writeText(referralLink)
    playNotificationSound();
    toast({
      description: "Copied link to clipboard",
    })
  }

  return (
    <main className='h-[90vh] px-5 pt-10 pb-7 text-white flex flex-col'>
      <div className='flex flex-col justify-center items-center mb-10'>
        <h1 className="font-bold text-[22px] mb-4">Invite a Friend</h1>
        <p className='text-center mb-6 w-[239px]'>Get <span className='inline-flex mt-2 items-center font-bold text-[16px] '><img src="/ziptos-coin.svg" alt="coin" width={22} height={22}/>2500zpts</span> for you and a friend when you invite them</p>
        <div className='flex items-center gap-[14px]'>
          <span className='flex items-center max-w-[240px] px-6 bg-[#1E1E1E]/50 h-14 rounded-xl'><p className='overflow-hidden text-ellipsis whitespace-nowrap'>{referralLink}</p></span>
          <button className='flex justify-center items-center bg-[#F33439] rounded-xl size-14' onClick={() => handleClick(referralLink)}>
            <img src="/user-tick.svg" alt="icon" width={26} height={26} />
          </button>
        </div>
      </div>

      <div className='mb-[37px]'>
        <div className='flex justify-between items-center mb-3'>
          <span className='flex gap-1 items-center text-[16px] text-[#FFB500]'><img src="/trophy-small.png" alticon />Leaderboard</span>
          <Link to='/stats' className='bg-[#F33439] inline-flex justify-center items-center h-[33px] w-[147px] rounded-[10px] text-[14px]'>View Leaderboard</Link>
        </div>
        <UserRank />
      </div>

      <InvitedFriends />
      <audio ref={NotificationAudioRef} src="/sounds/notification.mp3" />
    </main>
  );
}
