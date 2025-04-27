# EventChain - Web3 Event Management Platform

EventChain is a decentralized event management platform built on Ethereum that allows users to:

- Create events with ticket pricing
- Purchase event tickets as NFTs
- View and manage owned tickets
- Transfer tickets to other users

## Technologies Used

- React for the frontend
- Hardhat for Ethereum development
- Solidity for smart contracts
- Ethers.js for Web3 interactions
- React Router for navigation

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Ikeh-Akinyemi/eventchain.git
   cd eventchain
   ```

2. Install dependencies:

```bash
npm install
```

3. Start a local Ethereum node:

```bash
npx hardhat node
```

4. Deploy the smart contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

Update the contract address in `src/services/web3Service.js` with the address from the deployment.

5. Start the React app:

```bash
npm start
```

Open your browser and navigate to http://localhost:3000

## Usage

Connect your MetaMask wallet to the application
Browse available events or create your own
Purchase tickets for events you're interested in
View your tickets in the "My Tickets" section

## Smart Contract
The EventChain smart contract is built on the ERC-721 standard for NFTs and includes features for:

- Creating events
- Purchasing tickets as NFTs
- Tracking ticket usage
- Transferring ticket ownership

## Future Enhancements

- Advanced role-based access control with Permit.io
- Ticket validation at venues
- Secondary market for ticket resale with royalties to event organizers
- Event analytics dashboard

## License
This project is licensed under the MIT License - see the LICENSE file for details.
