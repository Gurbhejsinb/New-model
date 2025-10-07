# JC TRADERS CAPITAL DEX Swap Dashboard

## Overview

A decentralized exchange (DEX) swap dashboard built for BNB Smart Chain Testnet that enables users to swap BNB and CAKE tokens. The application integrates with MetaMask wallet and uses PancakeSwap's Router contract for executing token swaps. It features a modern, clean interface inspired by PancakeSwap with a professional purple brand identity.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR and optimized production builds
- Wouter for lightweight client-side routing

**UI Component System:**
- shadcn/ui components built on Radix UI primitives for accessible, customizable components
- Tailwind CSS with custom design tokens for consistent styling
- CSS variables for theming with light/dark mode support
- Custom color palette with deep purple (`280 65% 60%`) as primary brand color

**State Management:**
- TanStack Query (React Query) for server state management and API caching
- React hooks for local component state
- Custom hooks (`useWallet`, `useTokenBalance`) for wallet integration and blockchain interactions

**Design System:**
- Component-based architecture with strict adherence to design guidelines
- Typography: Inter for UI text, JetBrains Mono for numerical displays
- Spacing system using Tailwind's scale (4, 6, 8, 12, 16, 24px)
- Border radius: lg (9px), md (6px), sm (3px)

### Backend Architecture

**Server Framework:**
- Express.js server with TypeScript
- Custom Vite middleware integration for development
- Single API endpoint pattern for external data fetching

**API Structure:**
- RESTful endpoint: `/api/bnb-price` - fetches BNB price data from CoinGecko API
- Minimal backend footprint - most blockchain interactions happen client-side
- Request/response logging with duration tracking

**Development Tools:**
- Hot module replacement via Vite in development mode
- Runtime error overlay for improved debugging
- Replit-specific plugins for cartographer and dev banner

### Data Storage

**In-Memory Storage:**
- Simple `MemStorage` class implementing `IStorage` interface
- Currently minimal storage requirements as blockchain state is primary source of truth
- Designed for extensibility with database integration potential

**Database Configuration:**
- Drizzle ORM configured for PostgreSQL dialect
- Schema defined in `shared/schema.ts`
- Migration support via drizzle-kit
- Note: Database not actively used in current implementation but infrastructure is ready

### Web3 Integration

**Wallet Connection:**
- MetaMask integration via window.ethereum API
- Automatic network switching to BSC Testnet (Chain ID: 97)
- Account change and network change event listeners
- Session persistence across page reloads

**Smart Contract Interactions:**
- ethers.js v6 for blockchain interactions
- PancakeSwap Router V2 contract integration (address: `0x9ac64cc6e4415144c455bd8e4837fea55603e5c3`)
- ERC20 token standard support for CAKE token
- Native BNB handling with WBNB wrapping support

**Swap Mechanism:**
- Real-time price quotes via `getAmountsOut` before execution
- Token approval flow for ERC20 tokens
- Three swap types supported:
  - ETH to Tokens (swapExactETHForTokens)
  - Tokens to ETH (swapExactTokensForETH)
  - Tokens to Tokens (swapExactTokensForTokens)
- 3% default slippage tolerance
- Deadline protection (5 minutes from transaction initiation)

**Token Configuration:**
- BNB (native token)
- WBNB (Wrapped BNB): `0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd`
- CAKE (PancakeSwap Token): `0xFa60D973F7642B748046464e165A65B7323b0DEE`

### External Dependencies

**Blockchain Infrastructure:**
- BNB Smart Chain Testnet RPC: `https://data-seed-prebsc-1-s1.binance.org:8545/`
- PancakeSwap Router V2 contract on BSC Testnet
- MetaMask browser extension for wallet connectivity

**Third-Party APIs:**
- CoinGecko API for real-time BNB price data and 24h price change
- Polling interval: 30 seconds for price updates

**UI Libraries:**
- Radix UI component primitives (25+ components including Dialog, Dropdown, Toast, etc.)
- class-variance-authority for component variant management
- Lucide React for icon system
- Embla Carousel for potential carousel features

**Development Dependencies:**
- TypeScript for type safety across full stack
- ESBuild for production server bundling
- Drizzle Kit for database schema management and migrations
- TSX for running TypeScript files in development

**Font Resources:**
- Google Fonts: Inter (400, 500, 600, 700) and JetBrains Mono (500, 600, 700)
- Preconnected to fonts.googleapis.com and fonts.gstatic.com for performance