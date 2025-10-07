import { Button } from "@/components/ui/button";
import { Wallet } from "lucide-react";

interface HeaderProps {
  account: string | null;
  onConnect: () => void;
  isConnecting: boolean;
}

export function Header({ account, onConnect, isConnecting }: HeaderProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container mx-auto flex h-16 md:h-20 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: "hsl(280, 65%, 60%)" }}>
            JC TRADERS CAPITAL
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          {account ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-muted">
                <div className="w-2 h-2 rounded-full bg-chart-2"></div>
                <span className="text-sm font-mono font-medium">{formatAddress(account)}</span>
              </div>
              <div className="sm:hidden">
                <Button variant="outline" size="sm" className="font-mono">
                  {formatAddress(account)}
                </Button>
              </div>
            </div>
          ) : (
            <Button 
              onClick={onConnect}
              disabled={isConnecting}
              className="h-12 px-6 rounded-xl font-semibold"
              data-testid="button-connect-wallet"
            >
              <Wallet className="w-4 h-4 mr-2" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
