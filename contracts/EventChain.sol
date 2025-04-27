// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract EventChain is ERC721URIStorage, Ownable {
    uint256 private _nextEventId = 1;
    uint256 private _nextTicketId = 1;
    
    struct Event {
        string name;
        uint256 date;
        string venue;
        uint256 ticketPrice;
        address organizer;
        bool isActive;
    }
    
    struct Ticket {
        uint256 eventId;
        bool used;
    }
    
    mapping(uint256 => Event) public events;
    mapping(uint256 => Ticket) public tickets;
    mapping(uint256 => bool) private _ticketExists;
    
    event EventCreated(uint256 eventId, string name, uint256 date, string venue, uint256 ticketPrice, address organizer);
    event TicketPurchased(uint256 ticketId, uint256 eventId, address buyer);
    event TicketUsed(uint256 ticketId, uint256 eventId);
    
    constructor() ERC721("EventChain Ticket", "TICKET") Ownable(msg.sender) {}
    
    function createEvent(string memory name, uint256 date, string memory venue, uint256 ticketPrice) public {
        uint256 eventId = _nextEventId;
        _nextEventId += 1;
        
        events[eventId] = Event(name, date, venue, ticketPrice, msg.sender, true);
        
        emit EventCreated(eventId, name, date, venue, ticketPrice, msg.sender);
    }
    
    function purchaseTicket(uint256 eventId) public payable {
        Event storage eventItem = events[eventId];
        require(eventItem.isActive, "Event does not exist or is not active");
        require(msg.value >= eventItem.ticketPrice, "Insufficient funds for ticket");
        
        uint256 ticketId = _nextTicketId;
        _nextTicketId += 1;
        
        tickets[ticketId] = Ticket(eventId, false);
        _ticketExists[ticketId] = true;
        _mint(msg.sender, ticketId);
        
        // Transfer funds to event organizer
        payable(eventItem.organizer).transfer(msg.value);
        
        emit TicketPurchased(ticketId, eventId, msg.sender);
    }
    
    function useTicket(uint256 ticketId) public {
        require(_ticketExists[ticketId], "Ticket does not exist");
        require(ownerOf(ticketId) == msg.sender, "Only ticket owner can use ticket");
        
        Ticket storage ticket = tickets[ticketId];
        require(!ticket.used, "Ticket has already been used");
        
        ticket.used = true;
        
        emit TicketUsed(ticketId, ticket.eventId);
    }
    
    function getEvent(uint256 eventId) public view returns (Event memory) {
        return events[eventId];
    }
    
    function getUserTickets(address user) public view returns (uint256[] memory) {
        uint256 totalTickets = _nextTicketId - 1;
        uint256 userTicketCount = 0;
        
        // First, count the tickets owned by the user
        for (uint256 i = 1; i <= totalTickets; i++) {
            if (_ticketExists[i] && ownerOf(i) == user) {
                userTicketCount++;
            }
        }
        
        // Then, create an array of the right size and fill it
        uint256[] memory userTickets = new uint256[](userTicketCount);
        uint256 index = 0;
        
        for (uint256 i = 1; i <= totalTickets; i++) {
            if (_ticketExists[i] && ownerOf(i) == user) {
                userTickets[index] = i;
                index++;
            }
        }
        
        return userTickets;
    }

    function eventCount() public view returns (uint256) {
        return _nextEventId - 1;
    }
    
    function transferTicket(address to, uint256 ticketId) public {
        require(_ticketExists[ticketId], "Ticket does not exist");
        require(ownerOf(ticketId) == msg.sender, "Only ticket owner can transfer ticket");
        require(to != address(0), "Cannot transfer to zero address");
        
        Ticket storage ticket = tickets[ticketId];
        require(!ticket.used, "Used tickets cannot be transferred");
        
        _transfer(msg.sender, to, ticketId);
    }
}
