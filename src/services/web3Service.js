import { ethers } from 'ethers';
import EventChainArtifact from '../artifacts/contracts/EventChain.sol/EventChain.json';

const CONTRACT_ADDRESSES = {
  // Local development
  1337: "0x5FbDB2315678afecb367f032d93F642f64180aa3", 
  // Sepolia testnet
  11155111: "0x675c79fC3a3BDec7B31739683E5645CC214D0144"
};

export const getWeb3Provider = async () => {
  if (!window.ethereum) {
    throw new Error("Please install MetaMask to use this application");
  }
  
  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = new ethers.BrowserProvider(window.ethereum);
  return provider;
};

export const getContract = async (withSigner = false) => {
  const provider = await getWeb3Provider();
  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);
  
  const contractAddress = CONTRACT_ADDRESSES[chainId];
  if (!contractAddress) {
    throw new Error("Unsupported network. Please connect to Sepolia testnet or a local development network.");
  }
  
  if (withSigner) {
    const signer = await provider.getSigner();
    return new ethers.Contract(contractAddress, EventChainArtifact.abi, signer);
  }
  
  return new ethers.Contract(contractAddress, EventChainArtifact.abi, provider);
};

export const getEvents = async () => {
  try {
    const contract = await getContract();
    const eventCountBigInt = await contract.eventCount();
    const eventCount = Number(eventCountBigInt);
    
    const events = [];
    
    for (let i = 1; i <= eventCount; i++) {
      try {
        const eventData = await contract["getEvent(uint256)"](ethers.parseEther(i.toString()));
        
        events.push({
          id: i,
          name: eventData.name,
          date: new Date(Number(eventData.date) * 1000),
          venue: eventData.venue,
          price: ethers.formatEther(eventData.ticketPrice),
          organizer: eventData.organizer,
          isActive: eventData.isActive
        });
      } catch (err) {
        console.error(`Error fetching event ${i}:`, err);
      }
    }
    
    return events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
};

export const getUserTickets = async (address) => {
  try {
    const contract = await getContract();
    const ticketIds = await contract.getUserTickets(address);
    
    const tickets = [];
    for (let i = 0; i < ticketIds.length; i++) {
      const ticketId = ticketIds[i].toString();
      try {
        const ticket = await contract.tickets(ticketId);
        const eventId = ticket.eventId.toString();
        
        const event = await contract["getEvent(uint256)"](ethers.parseEther(eventId.toString()));
        
        tickets.push({
          id: ticketId,
          eventId: eventId,
          eventName: event.name,
          eventDate: new Date(Number(event.date) * 1000),
          venue: event.venue,
          used: ticket.used
        });
      } catch (err) {
        console.error(`Error fetching ticket ${ticketId}:`, err);
      }
    }
    
    return tickets;
  } catch (error) {
    console.error("Error getting user tickets:", error);
    return [];
  }
};

export const createEvent = async (name, date, venue, price) => {
  const contract = await getContract(true);
  const timestamp = Math.floor(new Date(date).getTime() / 1000);
  const priceInWei = ethers.parseEther(price.toString());
  
  const tx = await contract.createEvent(name, timestamp, venue, priceInWei);
  await tx.wait();
  
  return tx;
};

export const purchaseTicket = async (eventId, price, address) => {
  try {
    const contract = await getContract(true);
    const priceInWei = ethers.parseEther(price.toString());
    
    const tx = await contract.purchaseTicket(eventId, { value: priceInWei });
    const receipt = await tx.wait();
    
    // Find the ticketId from the event logs
    let ticketId = "0";
    
    for (const log of receipt.logs) {
      try {
        const parsedLog = contract.interface.parseLog({
          topics: log.topics,
          data: log.data
        });
        
        if (parsedLog && parsedLog.name === 'TicketPurchased') {
          ticketId = parsedLog.args[0].toString();
          break;
        }
      } catch (e) {
        // Skip logs that can't be parsed
      }
    }
    
    return {
      success: true,
      transactionHash: tx.hash,
      ticketId: ticketId
    };
  } catch (error) {
    console.error("Purchase error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const transferTicket = async (ticketId, toAddress) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.transferTicket(toAddress, ticketId);
    await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    console.error("Transfer error:", error);
    return {
      success: false,
      error: error.message
    };
  }
};

export const useTicket = async (ticketId) => {
  try {
    const contract = await getContract(true);
    const tx = await contract.useTicket(ticketId);
    await tx.wait();
    
    return {
      success: true,
      transactionHash: tx.hash
    };
  } catch (error) {
    console.error("Error using ticket:", error);
    return {
      success: false,
      error: error.message
    };
  }
};