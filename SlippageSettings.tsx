import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SLIPPAGE_PRESETS } from "@shared/schema";
import { AlertCircle } from "lucide-react";

interface SlippageSettingsProps {
  slippage: number;
  onSlippageChange: (value: number) => void;
}

export function SlippageSettings({ slippage, onSlippageChange }: SlippageSettingsProps) {
  const [customValue, setCustomValue] = useState("");
  const [isCustom, setIsCustom] = useState(!SLIPPAGE_PRESETS.includes(slippage));

  const handlePresetClick = (value: number) => {
    setIsCustom(false);
    setCustomValue("");
    onSlippageChange(value);
  };

  const handleCustomChange = (value: string) => {
    setCustomValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0 && numValue <= 50) {
      setIsCustom(true);
      onSlippageChange(numValue);
    }
  };

  const isHighSlippage = slippage > 5;
  const isLowSlippage = slippage < 0.5;

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-sm font-medium mb-2 block">Slippage Tolerance</Label>
        <div className="flex gap-2 mb-3">
          {SLIPPAGE_PRESETS.map((preset) => (
            <Button
              key={preset}
              type="button"
              variant={!isCustom && slippage === preset ? "default" : "outline"}
              size="sm"
              onClick={() => handlePresetClick(preset)}
              className="flex-1 font-mono"
              data-testid={`button-slippage-${preset}`}
            >
              {preset}%
            </Button>
          ))}
        </div>
        <div className="flex gap-2 items-center">
          <Input
            type="text"
            placeholder="Custom"
            value={customValue}
            onChange={(e) => handleCustomChange(e.target.value)}
            className="flex-1 font-mono"
            data-testid="input-custom-slippage"
          />
          <span className="text-sm text-muted-foreground">%</span>
        </div>
      </div>
      
      {isHighSlippage && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
          <AlertCircle className="w-4 h-4 text-chart-3 mt-0.5" />
          <p className="text-xs text-chart-3">
            High slippage tolerance may result in unfavorable rates
          </p>
        </div>
      )}
      
      {isLowSlippage && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-chart-3/10 border border-chart-3/20">
          <AlertCircle className="w-4 h-4 text-chart-3 mt-0.5" />
          <p className="text-xs text-chart-3">
            Low slippage may cause transaction to fail
          </p>
        </div>
      )}
    </div>
  );
}
