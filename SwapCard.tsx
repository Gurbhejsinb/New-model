import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TokenInput } from "./TokenInput";
import { SlippageSettings } from "./SlippageSettings";
import { ArrowDownUp, Settings, Loader2, AlertTriangle } from "lucide-react";
import { type Token } from "@shared/schema";

interface SwapCardProps {
  fromToken: Token;
  toToken: Token;
  fromAmount: string;
  toAmount: string;
  fromBalance: string | null;
  toBalance: string | null;
  conversionRate: string | null;
  priceImpact: number | null;
  slippage: number;
  isLoadingQuote: boolean;
  isSwapping: boolean;
  needsApproval: boolean;
  isApproving: boolean;
  onFromAmountChange: (value: string) => void;
  onFromTokenSelect: () => void;
  onToTokenSelect: () => void;
  onSwapTokens: () => void;
  onApprove: () => void;
  onSwap: () => void;
  onMaxClick: () => void;
  onSlippageChange: (value: number) => void;
}

export function SwapCard({
  fromToken,
  toToken,
  fromAmount,
  toAmount,
  fromBalance,
  toBalance,
  conversionRate,
  priceImpact,
  slippage,
  isLoadingQuote,
  isSwapping,
  needsApproval,
  isApproving,
  onFromAmountChange,
  onFromTokenSelect,
  onToTokenSelect,
  onSwapTokens,
  onApprove,
  onSwap,
  onMaxClick,
  onSlippageChange,
}: SwapCardProps) {
  const [showSettings, setShowSettings] = useState(false);
  
  const isHighPriceImpact = priceImpact !== null && priceImpact > 5;

  const isValidAmount = fromAmount && parseFloat(fromAmount) > 0;
  const hasInsufficientBalance = fromBalance && fromAmount && parseFloat(fromAmount) > parseFloat(fromBalance);

  const getButtonContent = () => {
    if (!isValidAmount) {
      return "Enter Amount";
    }
    if (hasInsufficientBalance) {
      return "Insufficient Balance";
    }
    if (needsApproval) {
      return isApproving ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Approving {fromToken.symbol}...
        </>
      ) : (
        `Approve ${fromToken.symbol}`
      );
    }
    if (isSwapping) {
      return (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Swapping...
        </>
      );
    }
    return "Confirm Swap";
  };

  const handleButtonClick = () => {
    if (needsApproval) {
      onApprove();
    } else {
      onSwap();
    }
  };

  const isButtonDisabled = !isValidAmount || hasInsufficientBalance || isSwapping || isApproving || isLoadingQuote;

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg rounded-2xl">
      <div className="p-6 md:p-8 space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Swap</h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-lg"
            onClick={() => setShowSettings(!showSettings)}
            data-testid="button-settings"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {showSettings && (
          <div className="p-4 rounded-xl bg-muted/50 border animate-in fade-in slide-in-from-top-2 duration-200">
            <SlippageSettings slippage={slippage} onSlippageChange={onSlippageChange} />
          </div>
        )}

        <div className="space-y-2">
          <TokenInput
            label="From"
            token={fromToken}
            amount={fromAmount}
            balance={fromBalance}
            onAmountChange={onFromAmountChange}
            onTokenSelect={onFromTokenSelect}
            onMaxClick={onMaxClick}
            isLoading={isLoadingQuote}
          />

          <div className="flex justify-center -my-2 relative z-10">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 rounded-full bg-background border-4 border-background shadow-sm hover-elevate"
              onClick={onSwapTokens}
              data-testid="button-swap-direction"
            >
              <ArrowDownUp className="w-4 h-4" />
            </Button>
          </div>

          <TokenInput
            label="To (estimated)"
            token={toToken}
            amount={toAmount}
            balance={toBalance}
            onAmountChange={() => {}}
            onTokenSelect={onToTokenSelect}
            readOnly
            isLoading={isLoadingQuote}
          />
        </div>

        <div className="space-y-2">
          {conversionRate && (
            <div className="flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-muted/30">
              <span className="text-sm font-medium text-center text-muted-foreground">
                {conversionRate}
              </span>
            </div>
          )}
          
          {isHighPriceImpact && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
              <AlertTriangle className="w-4 h-4 text-chart-3 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs font-medium text-chart-3">High Price Impact</p>
                <p className="text-xs text-chart-3/80">
                  Price impact: {priceImpact?.toFixed(2)}% - You may receive less than expected
                </p>
              </div>
            </div>
          )}
        </div>

        <Button
          className="w-full h-14 rounded-xl font-semibold text-base"
          onClick={handleButtonClick}
          disabled={isButtonDisabled}
          data-testid="button-confirm-swap"
        >
          {getButtonContent()}
        </Button>

        {hasInsufficientBalance && (
          <p className="text-xs text-center text-destructive">
            Insufficient {fromToken.symbol} balance
          </p>
        )}
      </div>
    </Card>
  );
}
