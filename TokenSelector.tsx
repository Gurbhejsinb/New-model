import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TRADEABLE_TOKENS } from "@shared/schema";
import type { Token } from "@shared/schema";

interface TokenSelectorProps {
  selectedToken: Token;
  onSelect: (token: Token) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  excludeToken?: Token;
}

export function TokenSelector({
  selectedToken,
  onSelect,
  open,
  onOpenChange,
  excludeToken,
}: TokenSelectorProps) {
  const availableTokens = TRADEABLE_TOKENS.filter(
    (token) => !excludeToken || token.symbol !== excludeToken.symbol
  );

  const handleSelect = (token: Token) => {
    onSelect(token);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Token</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {availableTokens.map((token) => (
            <Button
              key={token.symbol}
              variant={selectedToken.symbol === token.symbol ? "default" : "outline"}
              className="w-full justify-start h-auto py-3"
              onClick={() => handleSelect(token)}
              data-testid={`select-token-${token.symbol.toLowerCase()}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-primary">{token.symbol[0]}</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold">{token.symbol}</p>
                  <p className="text-xs text-muted-foreground">{token.name}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
