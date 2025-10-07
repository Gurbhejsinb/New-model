import { useQuery } from "@tanstack/react-query";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { BNBPrice } from "@shared/schema";

export function PriceDisplay() {
  const { data: bnbPrice } = useQuery<BNBPrice>({
    queryKey: ["/api/bnb-price"],
    refetchInterval: 30000,
  });

  if (!bnbPrice) {
    return null;
  }

  const isPositive = (bnbPrice.usd_24h_change ?? 0) >= 0;

  return (
    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-card-border">
      <span className="text-sm font-medium text-foreground">BNB</span>
      <span className="text-sm font-mono font-semibold text-foreground">
        ${bnbPrice.usd.toFixed(2)}
      </span>
      {bnbPrice.usd_24h_change !== undefined && (
        <div className={`flex items-center gap-1 text-xs font-medium ${isPositive ? 'text-chart-2' : 'text-chart-4'}`}>
          {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
          <span>{Math.abs(bnbPrice.usd_24h_change).toFixed(2)}%</span>
        </div>
      )}
    </div>
  );
}
