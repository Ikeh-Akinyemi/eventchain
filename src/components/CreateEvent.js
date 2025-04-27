import React, { useState } from 'react';
import { createEvent } from '../services/web3Service';

function CreateEvent({ walletAddress }) {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventVenue, setEventVenue] = useState('');
  const [ticketPrice, setTicketPrice] = useState('');
  const [createStatus, setCreateStatus] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!walletAddress) {
      setCreateStatus('Please connect your wallet first');
      return;
    }
    
    setIsProcessing(true);
    setCreateStatus('Creating event...');
    
    try {
      const result = await createEvent(eventName, eventDate, eventVenue, ticketPrice);
      
      setCreateStatus(`Event created successfully! Transaction: ${result.hash.substring(0, 10)}...`);
      // Reset form
      setEventName('');
      setEventDate('');
      setEventVenue('');
      setTicketPrice('');
    } catch (error) {
      console.error('Error creating event:', error);
      setCreateStatus(`Error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="create-event">
      <h2>Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Name:</label>
          <input 
            type="text" 
            value={eventName} 
            onChange={(e) => setEventName(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Event Date:</label>
          <input 
            type="date" 
            value={eventDate} 
            onChange={(e) => setEventDate(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Venue:</label>
          <input 
            type="text" 
            value={eventVenue} 
            onChange={(e) => setEventVenue(e.target.value)} 
            required
          />
        </div>
        <div className="form-group">
          <label>Ticket Price (ETH):</label>
          <input 
            type="number" 
            step="0.01" 
            value={ticketPrice} 
            onChange={(e) => setTicketPrice(e.target.value)} 
            required
          />
        </div>
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Create Event'}
        </button>
      </form>
      
      {createStatus && <p className="status-message">{createStatus}</p>}
    </div>
  );
}

export default CreateEvent;