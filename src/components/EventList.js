import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getEvents } from '../services/web3Service';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const eventData = await getEvents();
        setEvents(eventData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching events:', error);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) {
    return <div>Loading events...</div>;
  }

  return (
    <div className="event-list">
      <h2>Upcoming Events</h2>
      {events.length === 0 ? (
        <p>No upcoming events found.</p>
      ) : (
        <div className="events-grid">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.name}</h3>
              <p>Date: {new Date(event.date).toLocaleDateString()}</p>
              <p>Venue: {event.venue}</p>
              <p>Price: {event.price} ETH</p>
              <Link to={`/event/${event.id}`}>View Details</Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventList;