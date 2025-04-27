const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  
  console.log("Deploying contracts with the account:", deployer.address);
  
  const EventChain = await ethers.getContractFactory("EventChain");
  const eventChain = await EventChain.deploy();
  await eventChain.waitForDeployment();
  
  const deployedAddress = await eventChain.getAddress();
  console.log("EventChain deployed to:", deployedAddress);
  
  // Create sample events
  const events = [
    {
      name: "Web3 Conference 2025",
      date: Math.floor(new Date('2025-06-15').getTime() / 1000),
      venue: "Crypto Arena, New York",
      price: ethers.parseEther("0.05")
    },
    {
      name: "Blockchain Music Festival",
      date: Math.floor(new Date('2025-07-20').getTime() / 1000),
      venue: "Decentraland Virtual Venue",
      price: ethers.parseEther("0.03")
    },
    {
      name: "NFT Art Exhibition",
      date: Math.floor(new Date('2025-05-10').getTime() / 1000),
      venue: "Digital Gallery, Miami",
      price: ethers.parseEther("0.02")
    }
  ];
  
  for (const event of events) {
    const tx = await eventChain.createEvent(
      event.name,
      event.date,
      event.venue,
      event.price
    );
    await tx.wait();
    console.log(`Created event: ${event.name}`);
  }
  
  // Use the same deployer account to purchase a ticket as an example
  console.log("Creating a sample ticket purchase with deployer account");
  const ticketTx = await eventChain.purchaseTicket(1, { value: ethers.parseEther("0.05") });
  await ticketTx.wait();
  console.log("Purchased ticket for event 1");
  
  console.log("Basic seeding completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });