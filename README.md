# Blockchain Explorer

Blockchain Explorer is a developer-friendly tool designed to simplify the process of developing and debugging smart contracts. Inspired by tools like Ganache, this project provides a user-friendly interface to visualize and interact with the blockchain network. Unlike traditional frameworks like Hardhat, which rely on logs, Blockchain Explorer offers a comprehensive UI to help developers better understand the current state of the blockchain.

## Features

- **Default Network Connection**: Connects to the default Ethereum JSON-RPC URL (`http://127.0.0.1:8545/`) out of the box.
- **Customizable RPC URL**: Users can easily update the RPC URL from the top page to connect to their preferred network.
- **Visualize Blockchain Data**:
  - View recent blocks and their details.
  - Explore transactions and their metadata.
  - Monitor events and logs emitted by smart contracts.
  - Manage accounts and contracts.
- **Developer-Friendly**: Built with [Ethers.js](https://docs.ethers.org/v6/) and [Next.js](https://nextjs.org), ensuring a modern and efficient development experience.

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- Yarn (or npm/pnpm)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/blockchain-explorer.git
   cd blockchain-explorer
   ```

2. Install dependencies:

   ```bash
   yarn install
   # or
   npm install
   ```

3. Start the development server:

   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to access the app.

## Why Blockchain Explorer?

Developing smart contracts can be challenging, especially for beginners. Blockchain Explorer bridges the gap by providing:

- A clear and intuitive UI to visualize blockchain data.
- Easy access to transaction and block details.
- A customizable RPC URL to connect to any Ethereum-compatible network.

This tool is perfect for developers who want to:

- Debug smart contracts more effectively.
- Gain insights into the blockchain's current state.
- Simplify the development workflow.

## Contributing

We welcome contributions from the community! If you have ideas for new features or improvements, feel free to open an issue or submit a pull request.

## Star Us ⭐

If you find this project helpful, please give us a star on [GitHub](https://github.com/your-username/blockchain-explorer). Your support helps us grow and improve!

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
