import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import type { Token } from "@shared/schema";

interface TokenInputProps {
  label: string;
  token: Token;
  amount: string;
  balance: string | null;
  onAmountChange: (value: string) => void;
  onTokenSelect: () => void;
  onMaxClick?: () => void;
  readOnly?: boolean;
  isLoading?: boolean;
}

export function TokenInput({
  label,
  token,
  amount,
  balance,
  onAmountChange,
  onTokenSelect,
  onMaxClick,
  readOnly = false,
  isLoading = false,
}: TokenInputProps) {
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onAmountChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-1">
        <label className="text-sm font-medium text-muted-foreground">{label}</label>
        {balance !== null && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              Balance: <span className="font-mono font-medium text-foreground">{balance}</span>
            </span>
            {onMaxClick && !readOnly && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={onMaxClick}
                className="h-6 px-2 text-xs font-semibold text-primary hover:text-primary"
                data-testid="button-max"
              >
                MAX
              </Button>
            )}
          </div>
        )}
      </div>
      
      <div className="rounded-xl border bg-muted/30 p-4 hover-elevate transition-all">
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onTokenSelect}
            className="h-auto px-3 py-2 rounded-lg gap-2 bg-background hover:bg-muted"
            data-testid={`button-select-${token.symbol.toLowerCase()}`}
          >
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                <span className="text-xs font-bold text-primary">{token.symbol[0]}</span>
              </div>
              <span className="font-semibold">{token.symbol}</span>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          <div className="flex-1">
            <input
              type="text"
              value={amount}
              onChange={handleAmountChange}
              readOnly={readOnly}
              placeholder="0.0"
              className="w-full text-right text-2xl font-mono font-semibold bg-transparent border-none outline-none focus:ring-0 placeholder:text-muted-foreground/40"
              data-testid={`input-amount-${label.toLowerCase().replace(' ', '-')}`}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
