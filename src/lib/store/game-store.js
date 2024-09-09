import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../config/firebase";

const baseMaxEnergy = 500;
const baseEnergyRechargeRate = 5;
const rechargeInterval = 2000; // Recharge interval in milliseconds (1.7 seconds in this example)
const boostCooldownTime = 1800000; // 30mins in milliseconds
const pointUpdateThreshold = 20;
const maxBoosts = 3;
const turboCooldownTime = 1800000;//86400000()
const maxTurboBoosts = 3;

// Function to clear local storage and reinitialize with new data
const clearAndReinitializeStorage = () => {
  // Clear the entire local storage
  localStorage.clear();

  // Set new initial data
  const newInitialData = {
    energy: baseMaxEnergy,
    maxEnergy: baseMaxEnergy,
    lastUpdateTimestamp: Date.now(),
    lastFirebaseUpdate: 0,
    boostCount: maxBoosts,
    lastBoostTime: null,
    boostsResetTime: null,
    turboBoostCount: maxTurboBoosts,
    lastTurboBoostTime: null,
    turboBoostsResetTime: null,
    level: 1,
    points: 0,
    // Add any other initial state properties here
  };

  // Store the new initial data
  localStorage.setItem('ziptos-storage', JSON.stringify({...newInitialData}));

  return newInitialData;
};

const getInitialState = () => {
  const storedData = JSON.parse(localStorage.getItem('ziptos-storage'));
  // const storedState = storedData?.state;
  console.log('Stored statez:', storedData);
  
  return {
    energy: storedData?.energy ?? baseMaxEnergy,
    maxEnergy: storedData?.maxEnergy ?? baseMaxEnergy,
    lastRechargeTime: storedData?.lastRechargeTime ?? Date.now(),
  };
};

const calculateBaseEnergyForLevel = (level) => {
  return baseMaxEnergy + (level - 1) * 500;
};

export const useGameStore = create(
  persist(
    (set, get) => ({
      points: 0,
      energy: baseMaxEnergy,
      clicks: [],
      lastUpdateTimestamp: Date.now(),
      lastFirebaseUpdate: 0,
      boostCount: 0,
      lastBoostTime: null,
      maxEnergy: baseMaxEnergy,
      energyRechargeRate: baseEnergyRechargeRate,
      boostsResetTime: null,
      lastRechargeTime: Date.now(),
      turboBoostCount: 0,
      lastTurboBoostTime: null,
      turboBoostsResetTime: null,
      level: 1,
      turboActive: false,
      turboTimeout: null,
      turboActiveUntil: null,
      ...getInitialState(),

      fetchPointsFromFirebase: async () => {
        const tele = window.Telegram.WebApp;
        const telegramUser = tele.initDataUnsafe?.user;
        if (!telegramUser?.id) {
          console.error("No valid Telegram user ID");
          return;
        }

        try {
          const usersRef = collection(db, "zippoUsers");
          const q = query(usersRef, where("id", "==", telegramUser.id));
          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.error(
              "No matching document found for user ID:",
              telegramUser.id
            );
            return;
          }

          const userDoc = querySnapshot.docs[0];
          const userData = userDoc.data();
          const fetchedPoints = userData.points || 0;
          set({
            points: fetchedPoints,
            lastFirebaseUpdate: fetchedPoints,
          });
          console.log("Points fetched from Firebase:", fetchedPoints);
        } catch (error) {
          console.error("Error fetching points from Firebase:", error);
        }
      },

      setInitialPoints: (initialPoints) => {
        set({ points: initialPoints, lastFirebaseUpdate: initialPoints });
      },

      calculateLevel: async () => {
        const tele = window.Telegram.WebApp;
        const telegramUser = tele.initDataUnsafe?.user;

        if (!telegramUser?.id) {
          console.error("No valid Telegram user ID");
          return;
        }

        const { points, level } = get();
        const newLevel = Math.floor(points / 500000) + 1;

        if (newLevel !== level) {
          const newMaxEnergy = calculateBaseEnergyForLevel(newLevel);
          const newEnergyRechargeRate = baseEnergyRechargeRate + (newLevel - 1) * 5;

          set({
            level: newLevel,
            maxEnergy: newMaxEnergy,
            energyRechargeRate: newEnergyRechargeRate,
            energy: Math.min(get().energy, newMaxEnergy), // Adjust current energy if it exceeds new max
          });

          // Update Firebase
          try {
            const usersRef = collection(db, "zippoUsers");
            const q = query(usersRef, where("id", "==", telegramUser.id));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
              const userDoc = querySnapshot.docs[0];
              await updateDoc(userDoc.ref, {
                level: newLevel,
              });

              console.log(
                "Level, maxEnergy, and energyRechargeRate updated successfully in Firebase"
              );
            }
          } catch (error) {
            console.error(
              "Error updating level, maxEnergy, and energyRechargeRate in Firebase:",
              error
            );
          }
        }
      },

      calculateAndUpdateEnergy: () => {
        const currentTime = Date.now();
        const {
          energy,
          lastRechargeTime,
          maxEnergy,
          energyRechargeRate,
          level,
        } = get();

        const baseEnergyForLevel = calculateBaseEnergyForLevel(level);

        if (energy < baseEnergyForLevel) {
          const elapsedTime = currentTime - lastRechargeTime;
          const intervalsElapsed = Math.floor(elapsedTime / rechargeInterval);

          if (intervalsElapsed > 0) {
            const energyToAdd = Math.min(
              intervalsElapsed * energyRechargeRate,
              baseEnergyForLevel - energy
            );
            const newEnergy = Math.min(energy + energyToAdd, baseEnergyForLevel);

            set({
              energy: newEnergy,
              lastRechargeTime: currentTime,
            });

            return newEnergy;
          }
        }

        return energy;
      },

      updateEnergyOnStart: () => {
        const currentTime = Date.now();
        const {
          energy,
          lastRechargeTime,
          maxEnergy,
          energyRechargeRate,
        } = get();
      
        console.log('Before update - Energy:', energy, 'Max Energy:', maxEnergy, 'Last Recharge Time:', lastRechargeTime);
      
        if (energy < maxEnergy) {
          const elapsedTime = currentTime - lastRechargeTime;
          const intervalsElapsed = Math.floor(elapsedTime / rechargeInterval);
      
          if (intervalsElapsed > 0) {
            const energyToAdd = Math.min(
              intervalsElapsed * energyRechargeRate,
              maxEnergy - energy
            );
            const newEnergy = Math.min(energy + energyToAdd, maxEnergy);
      
            set({
              energy: newEnergy,
              lastRechargeTime: currentTime,
            });
      
            console.log('After update - New Energy:', newEnergy, 'Energy Added:', energyToAdd);
          } else {
            console.log('No energy added - Not enough time elapsed');
          }
        } else {
          console.log('No energy added - Already at max energy');
        }
      },

      addPoints: (amount) => {
        set((state) => {
          const newPoints = state.points + amount;
          const pointsDifference = newPoints - state.lastFirebaseUpdate;
          get().calculateLevel();

          // Update points in Firebase if needed
          if (pointsDifference >= pointUpdateThreshold) {
            get().updateFirebasePoints(pointsDifference);
            return {
              points: newPoints,
              lastFirebaseUpdate: newPoints,
            };
          }

          return { points: newPoints };
        });
      },

      subtractPoints: (amount) => {
        set((state) => {
          if (amount > state.points) {
            console.log("Not enough points to subtract");
            return state; // Cancel the operation if not enough points
          }

          const newPoints = state.points - amount;
          const pointsDifference = state.lastFirebaseUpdate - newPoints;
          get().calculateLevel();

          // If users have subtracted enough points, update points in Firebase
          if (pointsDifference >= pointUpdateThreshold) {
            get().updateFirebasePoints(-pointsDifference);
            return {
              points: newPoints,
              lastFirebaseUpdate: newPoints,
            };
          }

          return { points: newPoints };
        });
      },

      updateFirebasePoints: async (pointsToAddOrSubtract) => {
        const tele = window.Telegram.WebApp;
        const telegramUser = tele.initDataUnsafe?.user;

        if (!telegramUser?.id) {
          console.error("No valid Telegram user ID");
          return;
        }

        try {
          // Create a query to find the document where the 'id' field matches the user's ID
          const usersRef = collection(db, "zippoUsers");
          const q = query(usersRef, where("id", "==", telegramUser.id));

          const querySnapshot = await getDocs(q);

          if (querySnapshot.empty) {
            console.error("No matching document found for user ID:", user.id);
            return;
          }

          const userDoc = querySnapshot.docs[0];

          // Update the points for this document
          await updateDoc(userDoc.ref, {
            points: increment(pointsToAddOrSubtract),
          });

          console.log("Points updated successfully in Firebase");
        } catch (error) {
          console.error("Error updating points in Firebase:", error);
        }
      },

      getPointsToAdd: () => {
        const { level, turboActive } = get();
        return turboActive ? 4 * level : 2 * level; // Regular points are multiplied by level
      },

      reduceEnergy: (amount) => {
        const currentEnergy = get().calculateAndUpdateEnergy();
        const newEnergy = Math.max(currentEnergy - amount, 0);
        set({ energy: newEnergy, lastUpdateTimestamp: Date.now() });
        return newEnergy;
      },

      addClick: (click) =>
        set((state) => ({ clicks: [...state.clicks, click] })),

      removeClick: (id) =>
        set((state) => ({
          clicks: state.clicks.filter((click) => click.id !== id),
        })),

      boostEnergy: () => {
        const currentStatus = get().getBoostStatus();
        const isAllowed = get().isEnergyBoostAllowed();
        console.log("Current boost status:", currentStatus);
        console.log("Energy boost allowed:", isAllowed);

        if (currentStatus.availableBoosts > 0 && isAllowed) {
          set((state) => {
            const newState = {
              ...state,
              boostCount: state.boostCount - 1,
              energy: state.maxEnergy,
              boostsResetTime:
                state.boostCount === 1 ? Date.now() + boostCooldownTime : null,
            };
            console.log("New state after boost:", newState);
            return newState;
          });
          console.log("Boost applied, new status:", get().getBoostStatus());
          return true;
        } else {
          console.log("Boost not available or not allowed, status unchanged");
          return false;
        }
      },

      getBoostStatus: () => {
        const { boostCount, boostsResetTime, maxEnergy } = get();
        const remainingTime = get().calculateRemainingTime(boostsResetTime);

        if (boostCount > 0) {
          return {
            available: true,
            remainingTime: 0,
            availableBoosts: boostCount,
            maxBoosts: maxBoosts,
          };
        } else if (remainingTime > 0) {
          return {
            available: false,
            remainingTime,
            availableBoosts: 0,
            maxBoosts: maxBoosts,
          };
        } else {
          // Reset boosts if cooldown has passed
          set({ boostCount: maxBoosts, boostsResetTime: null });
          return {
            available: true,
            remainingTime: 0,
            availableBoosts: maxBoosts,
            maxBoosts: maxBoosts,
          };
        }
      },

      resetBoostsIfNeeded: () => {
        const { boostCount, boostsResetTime } = get();
        const currentTime = Date.now();

        if (
          boostCount === 0 &&
          boostsResetTime &&
          currentTime >= boostsResetTime
        ) {
          console.log("Resetting regular boosts");
          set({ boostCount: maxBoosts, boostsResetTime: null });
        }
      },

      isEnergyBoostAllowed: () => {
        const { energy, maxEnergy } = get();
        return energy <= 0.7 * maxEnergy;
      },

      activateTurboTaps: () => {
        console.log("Activating Turbo Taps");
        const activeDuration = 30000; // 30 seconds
        const endTime = Date.now() + activeDuration;
        set({ turboActive: true, turboActiveUntil: endTime });
        const timeout = setTimeout(() => {
          console.log("Deactivating Turbo Taps");
          set((state) => ({
            turboActive: false,
            turboActiveUntil: null,
            turboTimeout: null,
          }));
        }, activeDuration);
        set({ turboTimeout: timeout });
      },

      getTurboActiveStatus: () => {
        const { turboActive, turboActiveUntil } = get();
        if (!turboActive) return { active: false, remainingTime: 0 };

        const remainingTime = Math.max(0, turboActiveUntil - Date.now());
        return { active: remainingTime > 0, remainingTime };
      },

      boostTurboTaps: () => {
        const currentStatus = get().getTurboBoostStatus();
        console.log("Current turbo boost status:", currentStatus);

        if (currentStatus.availableBoosts > 0) {
          set((state) => {
            const newState = {
              ...state,
              turboBoostCount: state.turboBoostCount - 1,
              turboBoostsResetTime:
                state.turboBoostCount === 1
                  ? Date.now() + turboCooldownTime
                  : null,
            };
            console.log("New state after turbo boost:", newState);
            return newState;
          });
          console.log(
            "Turbo boost applied, new status:",
            get().getTurboBoostStatus()
          );
          return true;
        } else {
          console.log("Turbo boost not available, status unchanged");
          return false;
        }
      },

      calculateRemainingTime: (resetTime) => {
        if (!resetTime) return 0;
        const currentTime = Date.now();
        return Math.max(0, resetTime - currentTime);
      },

      getTurboBoostStatus: () => {
        const { turboBoostCount, turboBoostsResetTime } = get();
        const remainingTime =
          get().calculateRemainingTime(turboBoostsResetTime);

        if (turboBoostCount > 0) {
          return {
            available: true,
            remainingTime: 0,
            availableBoosts: turboBoostCount,
            maxBoosts: maxTurboBoosts,
          };
        } else if (remainingTime > 0) {
          return {
            available: false,
            remainingTime,
            availableBoosts: 0,
            maxBoosts: maxTurboBoosts,
          };
        } else {
          // Reset turbo boosts if cooldown has passed
          set({ turboBoostCount: maxTurboBoosts, turboBoostsResetTime: null });
          return {
            available: true,
            remainingTime: 0,
            availableBoosts: maxTurboBoosts,
            maxBoosts: maxTurboBoosts,
          };
        }
      },

      resetTurboBoostsIfNeeded: () => {
        const { turboBoostCount, turboBoostsResetTime } = get();
        const currentTime = Date.now();

        if (
          turboBoostCount === 0 &&
          turboBoostsResetTime &&
          currentTime >= turboBoostsResetTime
        ) {
          console.log("Resetting turbo boosts");
          set({ turboBoostCount: maxTurboBoosts, turboBoostsResetTime: null });
        }
      },

      clearAndReinitialize: () => {
        const newData = clearAndReinitializeStorage();
        set(newData);
      },

      onRehydrateStorage: () => (state) => {
        // Reset the lastRechargeTime to the current time
        // when the state is rehydrated from storage
        state.lastRechargeTime = Date.now();
      },
    }),
    {
      name: "ziptos-storage",
      getStorage: () => localStorage,
      onRehydrateStorage: (storedState) => (state) => {
        if (storedState) {
          let shouldReinitialize = false; // Set this to true when you want to force reinitialization
          
          if (shouldReinitialize) {
            const newData = clearAndReinitializeStorage();
            set(newData);
          }
          console.log('Stored state:', storedState);
          set({
            ...storedState,
            lastRechargeTime: Date.now(), // Reset recharge time to now
          });
          
          // Reset boosts if needed
          state.resetBoostsIfNeeded();
          state.resetTurboBoostsIfNeeded();
        }
      },
      partialize: (state) => ({
        energy: state.energy,  
        maxEnergy: state.maxEnergy,
        lastUpdateTimestamp: state.lastUpdateTimestamp,
        lastFirebaseUpdate: state.lastFirebaseUpdate,
        boostCount: state.boostCount,
        lastBoostTime: state.lastBoostTime,
        boostsResetTime: state.boostsResetTime,
        turboBoostCount: state.turboBoostCount,
        lastTurboBoostTime: state.lastTurboBoostTime,
        turboBoostsResetTime: state.turboBoostsResetTime,
        level: state.level,
        lastRechargeTime: state.lastRechargeTime,
      }),
    }
  )
);