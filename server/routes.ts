import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGridSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/grids", async (req, res) => {
    try {
      const grids = await storage.getAllGrids();
      res.json(grids);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grids" });
    }
  });

  app.get("/api/grids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid grid ID" });
      }

      const grid = await storage.getGrid(id);
      if (!grid) {
        return res.status(404).json({ error: "Grid not found" });
      }

      res.json(grid);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch grid" });
    }
  });

  app.post("/api/grids", async (req, res) => {
    try {
      const validatedData = insertGridSchema.parse(req.body);
      const grid = await storage.createGrid(validatedData);
      res.status(201).json(grid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid grid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create grid" });
    }
  });

  app.put("/api/grids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid grid ID" });
      }

      const validatedData = insertGridSchema.partial().parse(req.body);
      const grid = await storage.updateGrid(id, validatedData);
      
      if (!grid) {
        return res.status(404).json({ error: "Grid not found" });
      }

      res.json(grid);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid grid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update grid" });
    }
  });

  app.delete("/api/grids/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid grid ID" });
      }

      const deleted = await storage.deleteGrid(id);
      if (!deleted) {
        return res.status(404).json({ error: "Grid not found" });
      }

      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete grid" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
