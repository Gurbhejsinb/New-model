import type { SwapTransaction } from "@shared/schema";

const HISTORY_KEY = "swap_transaction_history";
const MAX_HISTORY_ITEMS = 50;

export function getTransactionHistory(): SwapTransaction[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch (error) {
    console.error("Error loading transaction history:", error);
    return [];
  }
}

export function addTransactionToHistory(transaction: SwapTransaction): void {
  try {
    const history = getTransactionHistory();
    const updated = [transaction, ...history].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error("Error saving transaction to history:", error);
  }
}

export function clearTransactionHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Error clearing transaction history:", error);
  }
}
