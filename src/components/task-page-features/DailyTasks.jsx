import React, { useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from '../ui/button';
import { useUser } from '../../contexts/UserContext';
import { useTaskStore } from '../../lib/store/task-store';
import { useGameStore } from '../../lib/store/game-store';
import { FormattedNumber } from '../FormattedNumber';
import { useToast } from "@/components/ui/use-toast";

const FIXED_VOLUME = 0.3;

const DailyTasks = ({ dailyTasks, completeTask }) => {
    const { user } = useUser();
    const { completedDailyTasks } = useTaskStore(); 
    const { addPoints } = useGameStore();
    const { toast } = useToast();
    const NotificationAudioRef = useRef(null);

    function hapticFeedback() {
      if (window.Telegram && window.Telegram.WebApp) {
        const tele = window.Telegram.WebApp;
        tele.HapticFeedback.impactOccurred("soft");
      }
      return;
    }

    const playNotificationSound = () => {
      if (NotificationAudioRef.current) {
        NotificationAudioRef.current.currentTime = 0; // Reset audio to start
        NotificationAudioRef.current.volume = FIXED_VOLUME;
        NotificationAudioRef.current.play().catch(error => console.error("Audio playback failed:", error));
      }
    }

    const handleCompleteTask = (task) => {
      completeTask(task);
      playNotificationSound();
      addPoints(task.pointsToAdd)
      hapticFeedback();
      toast({
        description: `Succuesfully recieved ${task.pointsToAdd} ZP.`,
      });
    }

  return (
    <div>
      <h2 className='mb-2 font-bold text-[16px]'>Daily Tasks</h2>
      {dailyTasks.map((task, index) => (
        <div key={index} className='flex justify-between items-center text-white rounded-[15px] bg-[#484848]/50 h-[69px] pl-[18px] pr-[17px] mb-[9px]'>
            <div className='flex gap-3 items-center justify-center'>
            <img src="thunder-bolt.png" alt="icon" width={30} height={30}/>
            <div className='flex flex-col'>
                <span className='font-bold text-[16px]'>{task.taskDescription}</span>
                <span className='text-sm flex items-center'><img src="/ziptos-coin.svg" alt="logo" width={22} height={22}/><span className='mb-[3px]'>+</span><FormattedNumber value={task.pointsToAdd} /></span>
            </div>
            </div>
            {user?.completedDailyTasks.includes(task.id) || completedDailyTasks.includes(task.id) ? (
            <span className='bg-[#5CB75F] size-6 rounded-full flex justify-center items-center'><img src="/check-icon.svg" alt="check" width={17} height={17}/></span>
          ) : (
            <button onClick={() => handleCompleteTask(task)} className='text-sm h-8 w-[71px] rounded-[10px] bg-[#F33439]'>Start</button>
          )}
        </div>
      ))}
      <audio ref={NotificationAudioRef} src="/sounds/notification.mp3" />
    </div>
  );
};

export default DailyTasks;