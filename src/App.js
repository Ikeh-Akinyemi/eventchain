import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WalletConnect from './components/WalletConnect';
import EventList from './components/EventList';
import EventDetails from './components/EventDetails';
import CreateEvent from './components/CreateEvent';
import MyTickets from './components/MyTickets';
import Navigation from './components/Navigation';
import './App.css';
import ProtectedRoute from './components/ProtectedRoute';

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

        <Navigation walletAddress={walletAddress} />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/events" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetails />} />
            <Route path="/my-tickets" element={
              <ProtectedRoute walletAddress={walletAddress} requiredAction="read" resource="Ticket">
                <MyTickets walletAddress={walletAddress} />
              </ProtectedRoute>
            } />
            <Route path="/create-event" element={
              <ProtectedRoute walletAddress={walletAddress} requiredAction="create" resource="Event">
                <CreateEvent walletAddress={walletAddress} />
              </ProtectedRoute>
            } />
            {/* <Route path="/venues" element={
              <ProtectedRoute walletAddress={walletAddress} requiredAction="create" resource="venue">
                <VenueManagement walletAddress={walletAddress} />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute walletAddress={walletAddress} requiredAction="read" resource="system:audit_logs">
                <AdminDashboard walletAddress={walletAddress} />
              </ProtectedRoute>
            } /> */}
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
