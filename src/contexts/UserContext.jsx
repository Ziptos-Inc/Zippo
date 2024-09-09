import React, { createContext, useState, useContext, useEffect } from 'react';
import { db } from '../config/firebase';
import { getDocs, collection, doc, setDoc, query, where, getDoc, addDoc, updateDoc, arrayUnion, increment, serverTimestamp } from 'firebase/firestore';
import { useGameStore } from '../lib/store/game-store';
import { nanoid } from 'nanoid';


const UserContext = createContext();

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);

  const generateReferralCode = () => nanoid();
  const { addPoints, setInitialPoints, fetchPointsFromFirebase } = useGameStore();

  const checkAndSaveUser = async (telegramUser) => {
    if (!telegramUser?.id) {
      console.error("No valid Telegram user ID");
      return;
    }
  
    const userDocRef = doc(db, "zippoUsers", telegramUser.id.toString());
  
    try {
      const userSnapshot = await getDoc(userDocRef);
      if (!userSnapshot.exists()) {
        // New user
        const urlParam = window.Telegram.WebApp;
        const referralCode = urlParam.initDataUnsafe?.start_param;
        const newUser = {
          ...telegramUser,
          referralCode: generateReferralCode(),
          referredUsers: [],
          referredBy: referralCode || null,
          points: 1000, // Add initial points directly
          completedDailyTasks: [],
          completedRegularTasks: [],
          level: 0,
          createdOn: serverTimestamp(),
          taps: 0,
        };
        await setDoc(userDocRef, newUser);
        setInitialPoints(1000);
        if (referralCode) {
          // Update the referrer's document
          const referrerQuery = query(collection(db, "zippoUsers"), where("referralCode", "==", referralCode));
          const referrerSnapshot = await getDocs(referrerQuery);
          if (!referrerSnapshot.empty) {
            const referrerDoc = referrerSnapshot.docs[0];
            await updateDoc(referrerDoc.ref, {
              points: increment(2500),
              referredUsers: arrayUnion(userDocRef.id),
            });
          }
        }
        setUser(newUser);
        console.log("New user added");
      } else {
        // Existing user
        const userData = userSnapshot.data();
        setUser({ ...userData, ...telegramUser });
        await fetchPointsFromFirebase();
        console.log("User info updated");
      }
    } catch (error) {
      console.error("Error checking/saving user:", error);
    }
  };

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tele = window.Telegram.WebApp;
      tele.ready();
      tele.expand();
      const telegramUser = tele.initDataUnsafe?.user;

      if (telegramUser) {
        checkAndSaveUser(telegramUser);
      }
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, checkAndSaveUser }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  return useContext(UserContext);
}