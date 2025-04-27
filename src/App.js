import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import CreateEvent from './components/CreateEvent';
import MyTickets from './components/MyTickets';
import './App.css';

function App() {
  const [walletAddress, setWalletAddress] = useState('');
  
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', accounts => {
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          localStorage.setItem('walletAddress', accounts[0]);
        } else {
          setWalletAddress('');
          localStorage.removeItem('walletAddress');
        }
      });
    }
  }, []);
  
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>EventChain</h1>
          <WalletConnect />
        </header>
        
        <nav className="app-nav">
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/events">Events</Link></li>
            {walletAddress && <li><Link to="/my-tickets">My Tickets</Link></li>}
            {walletAddress && <li><Link to="/create-event">Create Event</Link></li>}
          </ul>
        </nav>
        
        <main className="app-main">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/create-event" element={<CreateEvent walletAddress={walletAddress} />} />
            <Route path="/my-tickets" element={<MyTickets walletAddress={walletAddress} />} />
          </Routes>
        </main>
        
        <footer className="app-footer">
          <p>&copy; 2025 EventChain - Web3 Event Management Platform</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;