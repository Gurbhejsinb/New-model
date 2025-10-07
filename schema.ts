import { z } from "zod";

export interface Token {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
  isNative?: boolean;
}

export const BSC_TESTNET_CHAIN_ID = 97;
export const BSC_TESTNET_RPC = "https://data-seed-prebsc-1-s1.binance.org:8545/";

export const TOKENS: Record<string, Token> = {
  BNB: {
    symbol: "BNB",
    name: "BNB",
    address: "0x0000000000000000000000000000000000000000",
    decimals: 18,
    isNative: true,
  },
  WBNB: {
    symbol: "WBNB",
    name: "Wrapped BNB",
    address: "0xae13d989daC2f0dEbFf460aC112a837C89BAa7cd",
    decimals: 18,
  },
  CAKE: {
    symbol: "CAKE",
    name: "PancakeSwap Token",
    address: "0xFa60D973F7642B748046464e165A65B7323b0DEE",
    decimals: 18,
  },
  BUSD: {
    symbol: "BUSD",
    name: "Binance USD",
    address: "0xeD24FC36d5Ee211Ea25A80239Fb8C4Cfd80f12Ee",
    decimals: 18,
  },
  USDT: {
    symbol: "USDT",
    name: "Tether USD",
    address: "0x337610d27c682E347C9cD60BD4b3b107C9d34dDd",
    decimals: 18,
  },
};

export const TRADEABLE_TOKENS = [TOKENS.BNB, TOKENS.CAKE, TOKENS.BUSD, TOKENS.USDT];

export const PANCAKESWAP_ROUTER_ADDRESS = "0x9ac64cc6e4415144c455bd8e4837fea55603e5c3";

export const SLIPPAGE_TOLERANCE = 3;
export const SLIPPAGE_PRESETS = [0.1, 0.5, 1, 3];

export interface SwapState {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  isLoading: boolean;
}

export interface SwapTransaction {
  hash: string;
  fromToken: string;
  toToken: string;
  fromAmount: string;
  toAmount: string;
  timestamp: number;
  bscscanUrl: string;
}

export interface BNBPrice {
  usd: number;
  usd_24h_change?: number;
}

export type TransactionStatus = "idle" | "approving" | "swapping" | "success" | "error";
