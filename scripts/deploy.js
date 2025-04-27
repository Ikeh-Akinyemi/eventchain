const hre = require("hardhat");


async function main() {
  const EventChain = await hre.ethers.getContractFactory("EventChain");
  const eventChain = await EventChain.deploy();
  await eventChain.waitForDeployment();
  
  const eventChainAddr = await eventChain.getAddress();
  console.log("EventChain deployed to:", eventChainAddr);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });