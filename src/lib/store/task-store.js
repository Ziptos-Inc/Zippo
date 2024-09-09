import { create } from 'zustand'
import { collection, query, where, getDocs, updateDoc, increment } from 'firebase/firestore'
import { db } from '../../config/firebase'

export const useTaskStore = create(
  (set, get) => ({
    completedDailyTasks: [],
    completedRegularTasks: [],
    completeTask: (task) => {
      if (task.type === 'daily') {
        set((state) => ({
          completedDailyTasks: [...state.completedDailyTasks, task.id]
        }))
      } else {
        set((state) => ({
          completedRegularTasks: [...state.completedRegularTasks, task.id]
        }))
      }
      get().updateTaskCompletionInFirestore(task)
    },
    // undoTaskCompletion: (taskId, taskType) => {
    //   if (taskType === 'daily') {
    //     set((state) => ({
    //       completedDailyTasks: state.completedDailyTasks.filter((id) => id !== taskId)
    //     }))
    //   } else {
    //     set((state) => ({
    //       completedRegularTasks: state.completedRegularTasks.filter((id) => id !== taskId)
    //     }))
    //   }
    // },
    updateTaskCompletionInFirestore: async (task) => {
        try {
          const tele = window.Telegram.WebApp
          const telegramUser = tele.initDataUnsafe?.user
          if (!telegramUser?.id) {
            console.error("No valid Telegram user ID")
            return
          }
          const userRef = collection(db, 'zippoUsers')
          const q = query(userRef, where("id", "==", telegramUser.id))
          const querySnapshot = await getDocs(q)
      
          if (querySnapshot.empty) {
            console.error(`No matching document found for user ID: ${telegramUser.id}`)
            return
          }
      
          const userDoc = querySnapshot.docs[0]
          const updatedCompletedTaskIds = task.type === 'daily'
            ? [...(userDoc.data().completedDailyTasks), task.id]
            : [...(userDoc.data().completedRegularTasks), task.id];
      
          const updates = {}
          if (task.type === 'daily') {
            updates.completedDailyTasks = updatedCompletedTaskIds
          } else {
            updates.completedRegularTasks = updatedCompletedTaskIds
          }
      
          await updateDoc(userDoc.ref, updates)
      
          console.log("Task completion updated in Firestore")
        } catch (error) {
          console.error("Error updating task completion in Firestore:", error)
        }
      }
  })
)