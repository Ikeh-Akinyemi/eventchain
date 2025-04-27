import React, { useState, useEffect } from 'react';
import { BrowserProvider } from 'ethers';
import { syncWalletWithPermit, assignRoleToWallet } from '../middleware/permissionMiddleware';

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
        
        // Add signature verification
         const provider = new BrowserProvider(
           window.ethereum
        );
        const signer = provider.getSigner();
        const message = "Sign this message to verify your identity with EventChain";
        
        // Ask user to sign message
        setConnectionStatus('Please sign message...');
        (await signer).signMessage(message)
        
        // After successful signature, sync with Permit.io
        setConnectionStatus('Syncing account...');
        await syncWalletWithPermit(address);
        
        // Assign default role
        await assignRoleToWallet(address, 'Attendee');
        
        setConnectionStatus('Connected');
        localStorage.setItem('walletAddress', address);
        
      } catch (error) {
        console.error('Error connecting wallet:', error);
        setConnectionStatus('Connection Failed');
      }
    } else {
      alert('Please install MetaMask to use this application');
      setConnectionStatus('No Provider Detected');
    }
  }

  useEffect(() => {
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress && window.ethereum) {
      setWalletAddress(storedAddress);
      setConnectionStatus('Connected');
      
      // Sync with Permit.io (without requesting signature again)
      syncWalletWithPermit(storedAddress).catch(console.error);
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