import type { Express } from "express";
import { createServer, type Server } from "http";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/bnb-price", async (req, res) => {
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd&include_24hr_change=true"
      );
      
      if (!response.ok) {
        throw new Error("Failed to fetch BNB price");
      }

      const data = await response.json();
      
      res.json({
        usd: data.binancecoin.usd,
        usd_24h_change: data.binancecoin.usd_24h_change,
      });
    } catch (error) {
      console.error("Error fetching BNB price:", error);
      res.status(500).json({ error: "Failed to fetch BNB price" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
