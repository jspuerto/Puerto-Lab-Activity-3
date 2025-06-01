import { users, grids, type User, type InsertUser, type Grid, type InsertGrid } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getAllGrids(): Promise<Grid[]>;
  getGrid(id: number): Promise<Grid | undefined>;
  createGrid(grid: InsertGrid): Promise<Grid>;
  updateGrid(id: number, grid: Partial<InsertGrid>): Promise<Grid | undefined>;
  deleteGrid(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private grids: Map<number, Grid>;
  private currentUserId: number;
  private currentGridId: number;

  constructor() {
    this.users = new Map();
    this.grids = new Map();
    this.currentUserId = 1;
    this.currentGridId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllGrids(): Promise<Grid[]> {
    return Array.from(this.grids.values()).sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getGrid(id: number): Promise<Grid | undefined> {
    return this.grids.get(id);
  }

  async createGrid(insertGrid: InsertGrid): Promise<Grid> {
    const id = this.currentGridId++;
    const now = new Date();
    const grid: Grid = { 
      ...insertGrid, 
      id, 
      createdAt: now,
      updatedAt: now
    };
    this.grids.set(id, grid);
    return grid;
  }

  async updateGrid(id: number, updateData: Partial<InsertGrid>): Promise<Grid | undefined> {
    const existingGrid = this.grids.get(id);
    if (!existingGrid) return undefined;

    const updatedGrid: Grid = {
      ...existingGrid,
      ...updateData,
      updatedAt: new Date()
    };
    
    this.grids.set(id, updatedGrid);
    return updatedGrid;
  }

  async deleteGrid(id: number): Promise<boolean> {
    return this.grids.delete(id);
  }
}

export const storage = new MemStorage();
