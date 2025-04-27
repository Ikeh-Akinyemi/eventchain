import React, { useState, useEffect } from 'react';
import { getUserTickets } from '../services/web3Service';
import TransferTicketComponent from './TransferTicketComponent';

function MyTickets({ walletAddress }) {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    async function fetchTickets() {
      if (!walletAddress) {
        setLoading(false);
        return;
      }
      
      try {
        const userTickets = await getUserTickets(walletAddress);
        setTickets(userTickets);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching tickets:', error);
        setLoading(false);
      }
    }

    fetchTickets();
  }, [walletAddress]);

  function handleTransferClick(ticketId, eventId) {
    setSelectedTicket({ id: ticketId, eventId: eventId });
  }

  function handleCancelTransfer() {
    setSelectedTicket(null);
  }

  if (!walletAddress) {
    return <div>Please connect your wallet to view your tickets.</div>;
  }

  if (loading) {
    return <div>Loading your tickets...</div>;
  }

  return (
    <div className="my-tickets">
      <h2>My Tickets</h2>
      {tickets.length === 0 ? (
        <p>You don't have any tickets yet.</p>
      ) : (
        <div className="tickets-list">
          {tickets.map(ticket => (
            <div key={ticket.id} className="ticket-card">
              <h3>{ticket.eventName}</h3>
              <p>Ticket ID: #{ticket.id}</p>
              <p>Event Date: {new Date(ticket.eventDate).toLocaleDateString()}</p>
              <p>Venue: {ticket.venue}</p>
              <p>Status: {ticket.used ? 'Used' : 'Valid'}</p>
              
              {!ticket.used && (
                <button 
                  onClick={() => handleTransferClick(ticket.id, ticket.eventId)}
                  className="transfer-button"
                >
                  Transfer Ticket
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedTicket && (
        <div className="transfer-modal">
          <div className="transfer-modal-content">
            <span className="close" onClick={handleCancelTransfer}>&times;</span>
            <TransferTicketComponent 
              walletAddress={walletAddress} 
              ticketId={selectedTicket.id}
              eventId={selectedTicket.eventId}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default MyTickets;