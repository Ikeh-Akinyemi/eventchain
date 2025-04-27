import React, { useState, useEffect } from 'react';
import { transferTicket } from '../services/web3Service';
import { checkPermissionWithContext, updateUserAttributes } from '../middleware/permissionMiddleware';
import { ethers } from 'ethers';

function TransferTicketComponent({ walletAddress, ticketId, eventId }) {
  const [recipientAddress, setRecipientAddress] = useState('');
  const [canTransfer, setCanTransfer] = useState(false);
  const [transferStatus, setTransferStatus] = useState('');

  useEffect(() => {
    async function checkTransferPermission() {
      if (!walletAddress || !ticketId) return;

      // Check if user has permission to transfer this specific ticket
      const permitted = await checkPermissionWithContext(
        walletAddress,
        'transfer',
        'Ticket',
        ticketId,
        { ticket_id: ticketId, event_id: eventId }
      );

      setCanTransfer(permitted);
    }

    checkTransferPermission();
  }, [walletAddress, ticketId, eventId]);

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
        // 2. Update user attributes in Permit.io
        // Remove ticket from current owner
        await updateUserAttributes(walletAddress, {
          owned_ticket_ids: {
            $remove: ticketId
          }
        });

        // Add ticket to new owner
        await updateUserAttributes(recipientAddress, {
          owned_ticket_ids: {
            $append: ticketId
          }
        });

        setTransferStatus('Ticket successfully transferred!');
        setCanTransfer(false);
      } else {
        setTransferStatus('Transfer failed: ' + result.error);
      }
    } catch (error) {
      console.error('Transfer error:', error);
      setTransferStatus('Transfer failed: ' + error.message);
    }
  }

  if (!canTransfer) {
    return (
      <div>
        <h3>Transfer Ticket</h3>
        <p>You don't have permission to transfer this ticket.</p>
      </div>
    );
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
