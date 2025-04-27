import React, { useState, useEffect } from 'react';

function WalletConnect() {
  const [walletAddress, setWalletAddress] = useState('');
  const [connectionStatus, setConnectionStatus] = useState('Not Connected');

  async function connectWallet() {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts'
        });
        
        const address = accounts[0];
        setWalletAddress(address);
        setConnectionStatus('Connected');
        
        // Store wallet in local state
        localStorage.setItem('walletAddress', address);
        
        console.log('Wallet connected:', address);
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setConnectionStatus('Connection Failed');
      }
    } else {
      alert('Please install MetaMask to use this application');
      setConnectionStatus('No Provider Detected');
    }
  }

  // Check for existing connection on load
  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress && window.ethereum) {
      setWalletAddress(storedAddress);
      setConnectionStatus('Connected');
    }
  }, []);

  return (
    <div className="wallet-connect">
      <h2>Wallet Connection</h2>
      <p>Status: {connectionStatus}</p>
      {walletAddress ? (
        <p>Connected Address: {walletAddress.substring(0, 6)}...{walletAddress.substring(38)}</p>
      ) : (
        <button onClick={connectWallet}>Connect Wallet</button>
      )}
    </div>
  );
}

export default WalletConnect;