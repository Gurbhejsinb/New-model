import { ethers, type ContractTransactionResponse } from "ethers";
import { BSC_TESTNET_CHAIN_ID, BSC_TESTNET_RPC, PANCAKESWAP_ROUTER_ADDRESS, TOKENS, SLIPPAGE_TOLERANCE } from "@shared/schema";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const PANCAKESWAP_ROUTER_ABI = [
  "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
  "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
  "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
  "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
];

const ERC20_ABI = [
  "function balanceOf(address account) external view returns (uint256)",
  "function decimals() external view returns (uint8)",
  "function symbol() external view returns (string)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

export async function connectWallet(): Promise<string> {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed. Please install MetaMask to use this app.");
  }

  try {
    const accounts = await window.ethereum.request({ 
      method: "eth_requestAccounts" 
    });

    await switchToBSCTestnet();

    return accounts[0];
  } catch (error: any) {
    if (error.code === 4001) {
      throw new Error("Please connect your wallet to continue.");
    }
    throw error;
  }
}

export async function switchToBSCTestnet() {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }

  try {
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}` }],
    });
  } catch (error: any) {
    if (error.code === 4902) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: `0x${BSC_TESTNET_CHAIN_ID.toString(16)}`,
              chainName: "BSC Testnet",
              nativeCurrency: {
                name: "BNB",
                symbol: "BNB",
                decimals: 18,
              },
              rpcUrls: [BSC_TESTNET_RPC],
              blockExplorerUrls: ["https://testnet.bscscan.com"],
            },
          ],
        });
      } catch (addError) {
        throw new Error("Failed to add BSC Testnet network");
      }
    } else {
      throw error;
    }
  }
}

export function getProvider(): ethers.BrowserProvider {
  if (!window.ethereum) {
    throw new Error("MetaMask is not installed");
  }
  return new ethers.BrowserProvider(window.ethereum);
}

export async function getBalance(address: string, tokenAddress?: string): Promise<string> {
  const provider = getProvider();

  if (!tokenAddress || tokenAddress === TOKENS.BNB.address) {
    const balance = await provider.getBalance(address);
    return ethers.formatEther(balance);
  } else {
    const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
    const balance = await contract.balanceOf(address);
    const decimals = await contract.decimals();
    return ethers.formatUnits(balance, decimals);
  }
}

export async function getSwapQuote(
  fromTokenAddress: string,
  toTokenAddress: string,
  amountIn: string,
  fromDecimals: number,
  toDecimals: number,
  isFromNative: boolean
): Promise<string> {
  const provider = new ethers.JsonRpcProvider(BSC_TESTNET_RPC);
  const router = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, PANCAKESWAP_ROUTER_ABI, provider);

  const fromAddress = isFromNative ? TOKENS.WBNB.address : fromTokenAddress;
  const path = [fromAddress, toTokenAddress === TOKENS.BNB.address ? TOKENS.WBNB.address : toTokenAddress];

  try {
    const amountInWei = ethers.parseUnits(amountIn, fromDecimals);
    const amounts = await router.getAmountsOut(amountInWei, path);
    return ethers.formatUnits(amounts[1], toDecimals);
  } catch (error) {
    console.error("Error getting swap quote:", error);
    throw new Error("Failed to get swap quote");
  }
}

export async function approveToken(
  tokenAddress: string,
  spenderAddress: string,
  amount: string,
  decimals: number
): Promise<ContractTransactionResponse> {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, signer);

  const amountWei = ethers.parseUnits(amount, decimals);
  const tx = await contract.approve(spenderAddress, amountWei);
  return tx;
}

export async function checkAllowance(
  ownerAddress: string,
  tokenAddress: string,
  spenderAddress: string,
  decimals: number
): Promise<string> {
  const provider = getProvider();
  const contract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
  const allowance = await contract.allowance(ownerAddress, spenderAddress);
  return ethers.formatUnits(allowance, decimals);
}

export async function executeSwap(
  fromTokenAddress: string,
  toTokenAddress: string,
  amountIn: string,
  amountOutMin: string,
  fromDecimals: number,
  toDecimals: number,
  account: string,
  isFromNative: boolean,
  isToNative: boolean,
  slippageTolerance: number
): Promise<ContractTransactionResponse> {
  const provider = getProvider();
  const signer = await provider.getSigner();
  const router = new ethers.Contract(PANCAKESWAP_ROUTER_ADDRESS, PANCAKESWAP_ROUTER_ABI, signer);

  const deadline = Math.floor(Date.now() / 1000) + 60 * 20;
  const amountInWei = ethers.parseUnits(amountIn, fromDecimals);
  
  const amountOutMinWei = ethers.parseUnits(amountOutMin, toDecimals);
  const slippageBasisPoints = Math.floor((100 - slippageTolerance) * 100);
  const minAmountOut = (amountOutMinWei * BigInt(slippageBasisPoints)) / BigInt(10000);

  const fromAddress = isFromNative ? TOKENS.WBNB.address : fromTokenAddress;
  const toAddress = isToNative ? TOKENS.WBNB.address : toTokenAddress;
  const path = [fromAddress, toAddress];

  try {
    if (isFromNative) {
      const tx = await router.swapExactETHForTokens(
        minAmountOut,
        path,
        account,
        deadline,
        { value: amountInWei }
      );
      return tx;
    } else if (isToNative) {
      const tx = await router.swapExactTokensForETH(
        amountInWei,
        minAmountOut,
        path,
        account,
        deadline
      );
      return tx;
    } else {
      const tx = await router.swapExactTokensForTokens(
        amountInWei,
        minAmountOut,
        path,
        account,
        deadline
      );
      return tx;
    }
  } catch (error: any) {
    console.error("Swap error:", error);
    if (error.code === "ACTION_REJECTED") {
      throw new Error("Transaction was rejected");
    }
    throw new Error(error.message || "Swap failed");
  }
}
