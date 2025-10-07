import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SwapCard } from "@/components/SwapCard";
import { PriceDisplay } from "@/components/PriceDisplay";
import { TokenSelector } from "@/components/TokenSelector";
import { TransactionHistory } from "@/components/TransactionHistory";
import { useWallet } from "@/hooks/useWallet";
import { useTokenBalance } from "@/hooks/useTokenBalance";
import { useToast } from "@/hooks/use-toast";
import { TOKENS, PANCAKESWAP_ROUTER_ADDRESS } from "@shared/schema";
import { getSwapQuote, approveToken, checkAllowance, executeSwap } from "@/lib/web3";
import { addTransactionToHistory } from "@/lib/transactionHistory";
import type { Token } from "@shared/schema";

export default function SwapPage() {
  const { account, isConnecting, connect } = useWallet();
  const { toast } = useToast();

  const [fromToken, setFromToken] = useState<Token>(TOKENS.BNB);
  const [toToken, setToToken] = useState<Token>(TOKENS.CAKE);
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  const [conversionRate, setConversionRate] = useState<string | null>(null);
  const [priceImpact, setPriceImpact] = useState<number | null>(null);
  const [slippage, setSlippage] = useState(3);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [isSwapping, setIsSwapping] = useState(false);
  const [needsApproval, setNeedsApproval] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [fromSelectorOpen, setFromSelectorOpen] = useState(false);
  const [toSelectorOpen, setToSelectorOpen] = useState(false);

  const { balance: fromBalance } = useTokenBalance(account, fromToken.address);
  const { balance: toBalance } = useTokenBalance(account, toToken.address);

  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) === 0) {
      setToAmount("");
      setConversionRate(null);
      return;
    }

    let isMounted = true;
    const fetchQuote = async () => {
      setIsLoadingQuote(true);
      try {
        const quote = await getSwapQuote(
          fromToken.address,
          toToken.address,
          fromAmount,
          fromToken.decimals,
          toToken.decimals,
          fromToken.isNative || false
        );
        if (isMounted) {
          setToAmount(parseFloat(quote).toFixed(6));
          const rate = parseFloat(quote) / parseFloat(fromAmount);
          setConversionRate(`1 ${fromToken.symbol} = ${rate.toFixed(6)} ${toToken.symbol}`);
          
          const impact = Math.abs((1 - rate) * 100);
          setPriceImpact(impact);
        }
      } catch (error: any) {
        console.error("Error fetching quote:", error);
        if (isMounted) {
          setToAmount("");
          setConversionRate(null);
          toast({
            title: "Quote Error",
            description: error.message || "Failed to fetch swap quote",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) {
          setIsLoadingQuote(false);
        }
      }
    };

    const timeoutId = setTimeout(fetchQuote, 500);
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [fromAmount, fromToken, toToken, toast]);

  useEffect(() => {
    if (!account || !fromAmount || fromToken.isNative) {
      setNeedsApproval(false);
      return;
    }

    let isMounted = true;
    const checkApproval = async () => {
      try {
        const allowance = await checkAllowance(
          account,
          fromToken.address,
          PANCAKESWAP_ROUTER_ADDRESS,
          fromToken.decimals
        );
        if (isMounted) {
          const allowanceBigInt = ethers.parseUnits(allowance, fromToken.decimals);
          const amountBigInt = ethers.parseUnits(fromAmount, fromToken.decimals);
          setNeedsApproval(allowanceBigInt < amountBigInt);
        }
      } catch (error: any) {
        console.error("Error checking allowance:", error);
        if (isMounted) {
          toast({
            title: "Allowance Check Error",
            description: error.message || "Failed to check token allowance",
            variant: "destructive",
          });
        }
      }
    };

    checkApproval();
    return () => {
      isMounted = false;
    };
  }, [account, fromAmount, fromToken, toast]);

  const handleConnect = async () => {
    try {
      await connect();
      toast({
        title: "Wallet Connected",
        description: "Successfully connected to MetaMask",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromTokenSelect = (token: Token) => {
    if (token.symbol === toToken.symbol) {
      setToToken(fromToken);
    }
    setFromToken(token);
  };

  const handleToTokenSelect = (token: Token) => {
    if (token.symbol === fromToken.symbol) {
      setFromToken(toToken);
    }
    setToToken(token);
  };

  const handleMaxClick = () => {
    if (fromBalance) {
      const maxAmount = fromToken.isNative 
        ? Math.max(0, parseFloat(fromBalance) - 0.01).toFixed(6)
        : fromBalance;
      setFromAmount(maxAmount);
    }
  };

  const handleApprove = async () => {
    if (!account) return;

    setIsApproving(true);
    try {
      const tx = await approveToken(
        fromToken.address,
        PANCAKESWAP_ROUTER_ADDRESS,
        fromAmount,
        fromToken.decimals
      );
      
      toast({
        title: "Approval Pending",
        description: "Waiting for transaction confirmation...",
      });

      const receipt = await tx.wait();

      toast({
        title: "Approval Successful",
        description: (
          <div className="space-y-1">
            <p>{fromToken.symbol} approved for swapping</p>
            <a 
              href={`https://testnet.bscscan.com/tx/${receipt?.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline block"
            >
              View on BSCScan
            </a>
          </div>
        ),
      });

      setNeedsApproval(false);
    } catch (error: any) {
      console.error("Approval error:", error);
      toast({
        title: "Approval Failed",
        description: error.message || "Failed to approve token",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleSwap = async () => {
    if (!account || !fromAmount || !toAmount) return;

    setIsSwapping(true);
    try {
      const tx = await executeSwap(
        fromToken.address,
        toToken.address,
        fromAmount,
        toAmount,
        fromToken.decimals,
        toToken.decimals,
        account,
        fromToken.isNative || false,
        toToken.isNative || false,
        slippage
      );

      toast({
        title: "Swap Pending",
        description: "Waiting for transaction confirmation...",
      });

      const receipt = await tx.wait();
      const bscscanUrl = `https://testnet.bscscan.com/tx/${receipt?.hash}`;

      addTransactionToHistory({
        hash: receipt?.hash || "",
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount,
        toAmount,
        timestamp: Date.now(),
        bscscanUrl,
      });

      toast({
        title: "Swap Successful",
        description: (
          <div className="space-y-1">
            <p>Successfully swapped {fromAmount} {fromToken.symbol} for {toAmount} {toToken.symbol}</p>
            <a 
              href={bscscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline block"
            >
              View on BSCScan
            </a>
          </div>
        ),
      });

      setFromAmount("");
      setToAmount("");
      setConversionRate(null);
      setPriceImpact(null);
    } catch (error: any) {
      console.error("Swap error:", error);
      toast({
        title: "Swap Failed",
        description: error.message || "Failed to execute swap",
        variant: "destructive",
      });
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header account={account} onConnect={handleConnect} isConnecting={isConnecting} />
      
      <main className="flex-1 container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
            <div className="space-y-6">
              {account && (
                <div className="flex justify-center lg:justify-start">
                  <PriceDisplay />
                </div>
              )}
              
              {account ? (
                <SwapCard
                  fromToken={fromToken}
                  toToken={toToken}
                  fromAmount={fromAmount}
                  toAmount={toAmount}
                  fromBalance={fromBalance}
                  toBalance={toBalance}
                  conversionRate={conversionRate}
                  priceImpact={priceImpact}
                  slippage={slippage}
                  isLoadingQuote={isLoadingQuote}
                  isSwapping={isSwapping}
                  needsApproval={needsApproval}
                  isApproving={isApproving}
                  onFromAmountChange={setFromAmount}
                  onFromTokenSelect={() => setFromSelectorOpen(true)}
                  onToTokenSelect={() => setToSelectorOpen(true)}
                  onSwapTokens={handleSwapTokens}
                  onApprove={handleApprove}
                  onSwap={handleSwap}
                  onMaxClick={handleMaxClick}
                  onSlippageChange={setSlippage}
                />
              ) : (
                <div className="w-full max-w-md mx-auto">
                  <div className="p-8 md:p-12 text-center space-y-4 rounded-2xl border bg-card shadow-lg">
                    <h2 className="text-2xl font-semibold">Connect Your Wallet</h2>
                    <p className="text-muted-foreground">
                      Connect your MetaMask wallet to start swapping tokens on BSC Testnet
                    </p>
                  </div>
                </div>
              )}
            </div>
            
            {account && (
              <div className="lg:sticky lg:top-24 lg:self-start">
                <TransactionHistory />
              </div>
            )}
          </div>
        </div>
        
        <TokenSelector
          selectedToken={fromToken}
          onSelect={handleFromTokenSelect}
          open={fromSelectorOpen}
          onOpenChange={setFromSelectorOpen}
          excludeToken={toToken}
        />
        
        <TokenSelector
          selectedToken={toToken}
          onSelect={handleToTokenSelect}
          open={toSelectorOpen}
          onOpenChange={setToSelectorOpen}
          excludeToken={fromToken}
        />
      </main>
      
      <Footer />
    </div>
  );
}
