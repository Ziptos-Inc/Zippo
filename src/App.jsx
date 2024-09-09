import React, { useEffect } from 'react';
import { db } from './config/firebase';
import { getDocs, collection, addDoc, query, where, setDoc } from 'firebase/firestore';

import NavBar from './components/NavBar'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Friends from './pages/Friends';
import Task from './pages/Task';
import Home from './pages/Home';
import Boost from './pages/Boost';
import Stats from './pages/Stat';
import Wallet from './pages/Wallet';
import CallbackPage from './pages/CallbackPage';
import AuthWallet from './pages/AuthWallet';
import { Toaster } from "@/components/ui/toaster";

function App() {

  return (
    <Router>
    <div className="App">
    <Routes>
          <Route path="/friends" element={<Friends />} />
          <Route path="/task" element={<Task />} />
          <Route path="/" element={<Home />} />
          <Route path="/boost" element={<Boost />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/callback" element={<CallbackPage />} />
          <Route path="/auth-wallet" element={<AuthWallet />} />
        </Routes>
      <NavBar />
      <Toaster />
    </div>
    </Router>
  );
}

export default App;
