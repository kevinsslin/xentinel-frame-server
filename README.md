# Safe Transaction Simulator Frame 🖼️

## Overview

A powerful Frame app leveraging [Frames.js](https://framesjs.org) and Next.js to enable secure transaction simulation and visualization for Safe multi-sig wallets.

## Key Features

✨ **Rich Transaction Details**
- Comprehensive view of proposed Safe transactions

🔍 **Advanced Simulation**
- Pre-execution transaction simulation
- Detailed impact analysis on wallet balances
- Token transfer tracking with value calculations

📊 **Transaction Monitoring**
- Real-time confirmation tracking
- Integrated block explorer links (BlockScout & MultiBaas)

## Quick Start

1. Install dependencies:

```bash
yarn
```

2. Set up environment variables:

Create a `.env` file with the following variables:

```bash
SAFE_ADDRESS=your_safe_address
RPC_URL=your_rpc_url
CHAIN_ID=84532
NODE_ENV=dev

# Tenderly
TENDERLY_API_URL=https://api.tenderly.co/api/v1/account/your_account/project/your_project/
TENDERLY_ACCESS_KEY=your_access_key
TENDERLY_ACCOUNT_SLUG=your_account_slug
TENDERLY_PROJECT_SLUG=your_project_slug
```

3. Run the development server:

```bash
yarn dev
```


## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [Frames.js](https://framesjs.org) - Frame development framework
- [Safe Protocol Kit](https://github.com/safe-global/safe-core-sdk) - Safe transaction handling
- [Tenderly](https://tenderly.co/) - Transaction simulation
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Viem](https://viem.sh/) - Ethereum interactions

## Development

The project uses the following structure:
- `/app` - Next.js application code
- `/app/frames` - Frame routes and handlers
- `/app/utils` - Utility functions
- `/app/types` - TypeScript type definitions

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.