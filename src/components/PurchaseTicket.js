import React, { useState } from 'react';
import { purchaseTicket } from '../services/web3Service';
import withPermission from '../middleware/withPermission';
import { updateUserAttributes } from '../middleware/permissionMiddleware';

function PurchaseTicket({ eventId, eventName, price, walletAddress }) {
  const [purchaseStatus, setPurchaseStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  async function handlePurchase() {
    if (!walletAddress) {
      setPurchaseStatus('Please connect your wallet first');
      return;
    }

    setIsProcessing(true);
    setPurchaseStatus('Processing your purchase...');

    try {
      // Call our web3Service to handle the NFT purchase
      const result = await purchaseTicket(eventId, price, walletAddress);

      if (result.success) {
        // Update user attributes in Permit.io to track ticket ownership
        await updateUserAttributes(walletAddress, {
          owned_ticket_ids: {
            $append: result.ticketId
          }
        });

        setPurchaseStatus(`Success! Ticket purchased. Transaction: ${result.transactionHash.substring(0, 10)}...`);
      } else {
        setPurchaseStatus(`Failed: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setPurchaseStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="purchase-ticket">
      <h3>Purchase Ticket for {eventName}</h3>
      <p>Price: {price} ETH</p>

      <button
        onClick={handlePurchase}
        disabled={isProcessing || !walletAddress}
      >
        {isProcessing ? 'Processing...' : 'Buy Ticket'}
      </button>

      {purchaseStatus && <p className="status-message">{purchaseStatus}</p>}
    </div>
  );
}

export default withPermission(PurchaseTicket, 'purchase', 'ticket');
