import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { db } from '../../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from "@/components/ui/use-toast";
import { FormattedNumber } from '../FormattedNumber';

export default function InvitedFriends() {
  const { user } = useUser();
  const { toast } = useToast();
  const [friendsData, setFriendsData] = useState([]);

  useEffect(() => {
    async function fetchFriendsData() {
      if (!user?.referredUsers) return;

      const friendsData = [];

      for (const userId of user.referredUsers) {
        try {
          const userDocRef = doc(db, 'zippoUsers', userId);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            friendsData.push({ ...userDocSnap.data() });
          }
        } catch (error) {
          console.error('Error fetching friend data:', error);
        }
      }

      // Sort friends by points in descending order
      friendsData.sort((a, b) => (b.points || 0) - (a.points || 0));

      // Save the friends data and trigger the effect to check for updates
      setFriendsData(friendsData);

      // Handle rewards for new referrals
      const currentLength = friendsData.length;
      const previousLength = parseInt(localStorage.getItem('ziptos-friendsCount') || '0', 10);

      if (currentLength > previousLength) {
        const newReferrals = currentLength - previousLength;
        const reward = newReferrals * 2500;
        toast({
          description: `You have referred ${newReferrals} new friend(s) and earned ${reward} points!`,
        })
      }

      // Update local storage with the new count
      localStorage.setItem('ziptos-friendsCount', currentLength.toString());
    }

    fetchFriendsData();
  }, [user]);

  return (
    <div>
      <h2 className='text-[16px] mb-5'>All your friends ({friendsData.length})</h2>
      {friendsData.map((friend) => (
        <div key={friend.id} className='flex justify-between items-center text-white rounded-[15px] bg-[#484848]/50 h-[63px] pl-[18px] pr-[17px] mb-[6px]'>
            <div className='flex gap-3 items-center justify-center'>
            <img src="friend.svg" alt="icon" width={29} height={29}/>
            <div className='flex flex-col'>
                <span className='font-bold text-[16px]'>{friend.username || friend.first_name || friend.last_name}</span>
                <span className='text-sm font-thin'>Amateur</span>
            </div>
            </div>
            <span className='text-sm flex items-center'><img src="/ziptos-coin.svg" alt="logo" width={25} height={25}/><span className='mb-[3px]'>+</span><FormattedNumber value={friend.points} /></span>
        </div>
      ))}
    </div>
  );
}
