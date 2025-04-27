import React, { useState } from 'react';
import { checkPermissionWithContext } from '../middleware/permissionMiddleware';
import withPermission from '../middleware/withPermission';

function VenueCheckIn({ walletAddress, venueId, eventId }) {
  const [ticketId, setTicketId] = useState('');
  const [attendeeAddress, setAttendeeAddress] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function verifyTicket(e) {
    e.preventDefault();
    setIsLoading(true);
    setVerificationStatus('');

    try {
      // First, check if the current user (validator) has permission to check in
      const validatorPermission = await checkPermissionWithContext(
        walletAddress,
        'checkin',
        'Venue',
        venueId,
        { event_id: eventId }
      );

      if (!validatorPermission) {
        setVerificationStatus('You do not have permission to validate tickets for this venue.');
        setIsLoading(false);
        return;
      }

      // Then check if the attendee has a valid ticket
      const ticketValid = await checkPermissionWithContext(
        attendeeAddress,
        'checkin',
        'Venue',
        venueId,
        { 
          ticket_id: ticketId,
          event_id: eventId
        }
      );

      if (ticketValid) {
        setVerificationStatus('✅ Valid ticket! Attendee can enter the venue.');
        
        // In a real application, you would also:
        // 1. Verify on-chain that the wallet owns the ticket NFT
        // 2. Mark the ticket as used in your database or smart contract
        // 3. Log the check-in for audit purposes
      } else {
        setVerificationStatus('❌ Invalid ticket. Access denied.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationStatus('Error verifying ticket: ' + error.message);
    }

    setIsLoading(false);
  }

  return (
    <div className="venue-check-in">
      <h2>Venue Check-In</h2>
      <p>Venue: {venueId} | Event: {eventId}</p>
      
      <form onSubmit={verifyTicket}>
        <div className="form-group">
          <label>Attendee Wallet Address:</label>
          <input 
            type="text" 
            value={attendeeAddress} 
            onChange={(e) => setAttendeeAddress(e.target.value)} 
            placeholder="0x..." 
            required
          />
        </div>
        <div className="form-group">
          <label>Ticket ID:</label>
          <input 
            type="text" 
            value={ticketId} 
            onChange={(e) => setTicketId(e.target.value)} 
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Verifying...' : 'Verify Ticket'}
        </button>
      </form>
      
      {verificationStatus && (
        <div className="verification-status">
          <p>{verificationStatus}</p>
        </div>
      )}
    </div>
  );
}

// Only validators can access this component
export default withPermission(VenueCheckIn, 'checkin', 'venue');