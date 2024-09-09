import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import App from './App';
import { UserProvider, useUser } from './contexts/UserContext';

function WelcomeCard({ onProceed }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
      <div className="bg-white flex flex-col justify-center items-center rounded-lg p-6 max-w-sm w-full mx-4 animate-slideUp">
        <img src="/zippo-photo.jpg" alt="zippo" className='w-10 h-10 rounded-full' />
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Zippo!</h2>
        <p className="mb-6 text-center">Welcome to the first ever Wiggle2Earn game based on move technology, powered by Ziptos</p>
        <button 
          onClick={onProceed}
          className="w-full bg-[#F33439] hover:bg-[#F33439]/80 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          Let's Go!
        </button>
      </div>
    </div>
  );
}

function AppContent() {
  const tele = window.Telegram?.WebApp;
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setShowWelcome(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleProceed = () => {
    setShowWelcome(false);
  };

  if (tele?.platform === 'web') {
    return (
      <div className='h-screen text-[20px] text-white flex justify-center items-center'>
        Sorry, Zippo is not available on web
      </div>
    );
  }

  if (isLoading || !user) {
    return (
      <main className="h-[100vh] bg-center bg-[url('/zippo-game-screen.png')] bg-no-repeat bg-cover md:bg-contain"></main>
    );
  }

  if (showWelcome) {
    return (
      <main className="h-[100vh] bg-center bg-[url('/zippo-game-screen.png')] bg-no-repeat bg-cover md:bg-contain">
        <WelcomeCard onProceed={handleProceed} />
      </main>
    );
  }

  return <App />;
}

function AppWrapper() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default AppWrapper;