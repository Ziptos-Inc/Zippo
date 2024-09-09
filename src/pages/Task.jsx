import React, { useEffect, useState, useCallback } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, query, where } from 'firebase/firestore';
import Moonloader from "react-spinners/MoonLoader";
import { useTaskStore } from '../lib/store/task-store';
import TotalToken from '../components/TotalToken';
import DailyTasks from '../components/task-page-features/DailyTasks';
import RegularTasks from '../components/task-page-features/RegularTasks';

export default function Task() {
  const [dailyTasks, setDailyTasks] = useState([]);
  const [regularTasks, setRegularTasks] = useState([]);
  const { completeTask } = useTaskStore();

  const fetchDailyTasks = useCallback(async () => {
    try {
      const dailyTasksRef = collection(db, 'zippoDailyTask');
      const dailyTasksSnapshot = await getDocs(dailyTasksRef);
      const dailyTasksData = dailyTasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setDailyTasks(dailyTasksData);
    } catch (error) {
      console.error('Error fetching daily tasks:', error);
    }
  }, []);

  const fetchRegularTasks = useCallback(async () => {
    try {
      const regularTasksRef = collection(db, 'zippoRegularTask');
      const regularTasksSnapshot = await getDocs(regularTasksRef);
      const regularTasksData = regularTasksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRegularTasks(regularTasksData);
    } catch (error) {
      console.error('Error fetching regular tasks:', error);
    }
  }, []);

  useEffect(() => {
    fetchDailyTasks();
    fetchRegularTasks();
  }, [fetchDailyTasks, fetchRegularTasks]);

  return (
    <main className='h-[90vh] overflow-auto pt-10 pb-7'>
      <div className='flex flex-col items-center justify-center'>
        <img src="/ziptos-logo.svg" alt="logo" width={99} height={99} className='shadow-logo rounded-full'/>
        <h1 className='text-white text-2xl font-bold mt-7 mb-9'>Earn more Coins</h1>
      </div>
      <div className='text-white'>
        
        <div>
          {dailyTasks.length >= 1 || regularTasks.length >= 1 ? (
            <div className='flex flex-col gap-[30px] px-5'>
              
              {dailyTasks.length > 0 && (
                <DailyTasks dailyTasks={dailyTasks} completeTask={completeTask} />
              )}

              {regularTasks.length > 0 && (
                <RegularTasks regularTasks={regularTasks} completeTask={completeTask} />
              )}
            </div>
          ) : (
            <div className='flex justify-center h-[300px] items-center'>
              <Moonloader color='#fdba74' size={40} />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}