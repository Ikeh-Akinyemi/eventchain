import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEvents } from '../services/web3Service';
import PurchaseTicket from './PurchaseTicket';

function EventDetails() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    // Get wallet address from local storage
    const storedAddress = localStorage.getItem('walletAddress');
    if (storedAddress) {
      setWalletAddress(storedAddress);
    }

    async function fetchEvent() {
      try {
        const events = await getEvents();
        const foundEvent = events.find(e => e.id === parseInt(id));
        
        if (foundEvent) {
          setEvent(foundEvent);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching event:', error);
        setLoading(false);
      }
    }

    fetchEvent();
  }, [id]);

  if (loading) {
    return <div>Loading event details...</div>;
  }

  if (!event) {
    return <div>Event not found</div>;
  }

  return (
    <div className="event-details">
      <h2>{event.name}</h2>
      <div className="event-info">
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Price:</strong> {event.price} ETH</p>
        <p><strong>Organizer:</strong> {event.organizer.substring(0, 6)}...{event.organizer.substring(38)}</p>
      </div>
      
      <div className="ticket-section">
        <PurchaseTicket 
          eventId={event.id} 
          eventName={event.name} 
          price={event.price} 
          walletAddress={walletAddress} 
        />
      </div>
    </div>
  );
}

export default EventDetails;