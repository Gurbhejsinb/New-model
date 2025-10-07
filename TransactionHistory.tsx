import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ExternalLink, Trash2, Clock } from "lucide-react";
import { getTransactionHistory, clearTransactionHistory } from "@/lib/transactionHistory";
import type { SwapTransaction } from "@shared/schema";
import { formatDistanceToNow } from "date-fns";

export function TransactionHistory() {
  const [history, setHistory] = useState<SwapTransaction[]>([]);

  useEffect(() => {
    const loadHistory = () => {
      setHistory(getTransactionHistory());
    };

    loadHistory();
    const interval = setInterval(loadHistory, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleClear = () => {
    clearTransactionHistory();
    setHistory([]);
  };

  if (history.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 mx-auto mb-3 text-muted-foreground/50" />
          <p className="text-sm text-muted-foreground">No swap history yet</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Swaps</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="text-muted-foreground hover:text-destructive"
          data-testid="button-clear-history"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </div>
      
      <ScrollArea className="h-[300px] pr-4">
        <div className="space-y-3">
          {history.map((tx) => (
            <div
              key={tx.hash}
              className="p-3 rounded-lg border bg-card hover-elevate transition-all"
              data-testid={`transaction-${tx.hash.slice(0, 10)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {tx.fromAmount} {tx.fromToken}
                  </span>
                  <span className="text-muted-foreground">→</span>
                  <span className="text-sm font-medium">
                    {tx.toAmount} {tx.toToken}
                  </span>
                </div>
                <a
                  href={tx.bscscanUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-primary/80 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground font-mono">
                  {tx.hash.slice(0, 10)}...{tx.hash.slice(-8)}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}
