import React, { useState } from 'react';
import { ethers } from 'ethers';
import { transferTicket } from '../services/web3Service';

function TransferTicketComponent({ walletAddress, ticketId, eventId }) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [transferStatus, setTransferStatus] = useState('');
  
  async function handleTransfer(e) {
    e.preventDefault();
    
    // Check if address is valid
    if (!ethers.isAddress(recipientAddress)) {
      setTransferStatus('Invalid Ethereum address');
      return;
    }
    
    try {
      setTransferStatus('Initiating transfer...');
      
      const result = await transferTicket(ticketId, recipientAddress);
      
      if (result.success) {
        setTransferStatus('Ticket successfully transferred!');
      } else {
        setTransferStatus('Transfer failed: ' + result.error);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferStatus('Transfer failed: ' + error.message);
    }
  }
  
  return (
    <div>
      <h3>Transfer Ticket #{ticketId}</h3>
      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label>Recipient Address:</label>
          <input 
            type="text" 
            value={recipientAddress} 
            onChange={(e) => setRecipientAddress(e.target.value)} 
            placeholder="0x..." 
            required
          />
        </div>
        <button type="submit">Transfer Ticket</button>
      </form>
      {transferStatus && <p>{transferStatus}</p>}
    </div>
  );
}

export default TransferTicketComponent;