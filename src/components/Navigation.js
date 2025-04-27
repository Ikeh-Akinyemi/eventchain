import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkPermission } from '../middleware/permissionMiddleware';

function Navigation({ walletAddress }) {
  const [canCreateEvents, setCanCreateEvents] = useState(false);
  const [canManageVenues, setCanManageVenues] = useState(false);

  useEffect(() => {
      async function checkPermissions() {
        if (!walletAddress) return;
        
        // Check various permissions
        const createEventPerm = await checkPermission(walletAddress, 'create', 'Event');
        const manageVenuePerm = await checkPermission(walletAddress, 'create', 'Venue');
        
        setCanCreateEvents(createEventPerm);
        setCanManageVenues(manageVenuePerm);
      }
      
      checkPermissions();
    }, [walletAddress]);

  return (
      <nav className="app-nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/events">Events</Link></li>
          {walletAddress && <li><Link to="/my-tickets">My Tickets</Link></li>}
          {canCreateEvents && <li><Link to="/create-event">Create Event</Link></li>}
          {canManageVenues && <li><Link to="/venues">Manage Venues</Link></li>}
        </ul>
      </nav>
    );
  }
  
export default Navigation;