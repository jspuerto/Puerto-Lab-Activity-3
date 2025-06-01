export type NodeType = 'empty' | 'start' | 'end' | 'obstacle' | 'explored' | 'path' | 'current';

export class PathfindingNode {
  row: number;
  col: number;
  type: NodeType;
  distance: number;
  previous: PathfindingNode | null;
  isVisited: boolean;

  constructor(row: number, col: number) {
    this.row = row;
    this.col = col;
    this.type = 'empty';
    this.distance = Infinity;
    this.previous = null;
    this.isVisited = false;
  }

  reset() {
    if (this.type !== 'start' && this.type !== 'end' && this.type !== 'obstacle') {
      this.type = 'empty';
    }
    this.distance = Infinity;
    this.previous = null;
    this.isVisited = false;
  }

  clearPath() {
    if (this.type === 'explored' || this.type === 'path' || this.type === 'current') {
      this.type = 'empty';
    }
    this.distance = Infinity;
    this.previous = null;
    this.isVisited = false;
  }
}

export class PathfindingGrid {
  nodes: PathfindingNode[][];
  rows: number;
  cols: number;
  startNode: PathfindingNode | null;
  endNode: PathfindingNode | null;

  constructor(rows: number = 10, cols: number = 10) {
    this.rows = rows;
    this.cols = cols;
    this.startNode = null;
    this.endNode = null;
    this.nodes = [];
    this.initialize();
  }

  initialize() {
    this.nodes = [];
    for (let row = 0; row < this.rows; row++) {
      const nodeRow: PathfindingNode[] = [];
      for (let col = 0; col < this.cols; col++) {
        nodeRow.push(new PathfindingNode(row, col));
      }
      this.nodes.push(nodeRow);
    }
  }

  getNode(row: number, col: number): PathfindingNode | null {
    if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
      return this.nodes[row][col];
    }
    return null;
  }

  setNodeType(row: number, col: number, type: NodeType) {
    const node = this.getNode(row, col);
    if (!node) return;

    if (type === 'start') {
      if (this.startNode) {
        this.startNode.type = 'empty';
      }
      this.startNode = node;
    } else if (type === 'end') {
      if (this.endNode) {
        this.endNode.type = 'empty';
      }
      this.endNode = node;
    }

    node.type = type;
  }

  getNeighbors(node: PathfindingNode): PathfindingNode[] {
    const neighbors: PathfindingNode[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    for (const [dRow, dCol] of directions) {
      const newRow = node.row + dRow;
      const newCol = node.col + dCol;
      const neighbor = this.getNode(newRow, newCol);
      
      if (neighbor && neighbor.type !== 'obstacle') {
        neighbors.push(neighbor);
      }
    }

    return neighbors;
  }

  clearPath() {
    for (let row = 0; row < this.rows; row++) {
      for (let col = 0; col < this.cols; col++) {
        this.nodes[row][col].clearPath();
      }
    }
  }

  reset() {
    this.startNode = null;
    this.endNode = null;
    this.initialize();
  }

  loadFromData(gridData: any) {
    this.reset();
    
    if (gridData.nodes) {
      for (let row = 0; row < this.rows && row < gridData.nodes.length; row++) {
        for (let col = 0; col < this.cols && col < gridData.nodes[row].length; col++) {
          const nodeData = gridData.nodes[row][col];
          if (nodeData && nodeData.type) {
            this.setNodeType(row, col, nodeData.type);
          }
        }
      }
    }
    
    if (gridData.startNode) {
      const { row, col } = gridData.startNode;
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.setNodeType(row, col, 'start');
      }
    }
    
    if (gridData.endNode) {
      const { row, col } = gridData.endNode;
      if (row >= 0 && row < this.rows && col >= 0 && col < this.cols) {
        this.setNodeType(row, col, 'end');
      }
    }
  }
}

export interface PathfindingStats {
  exploredCount: number;
  pathLength: number;
  timeElapsed: number;
  status: string;
}

export class DijkstraAlgorithm {
  grid: PathfindingGrid;
  onNodeUpdate: (node: PathfindingNode) => void;
  onStatsUpdate: (stats: PathfindingStats) => void;
  speed: number;
  isRunning: boolean;
  stats: PathfindingStats;

  constructor(
    grid: PathfindingGrid,
    onNodeUpdate: (node: PathfindingNode) => void,
    onStatsUpdate: (stats: PathfindingStats) => void
  ) {
    this.grid = grid;
    this.onNodeUpdate = onNodeUpdate;
    this.onStatsUpdate = onStatsUpdate;
    this.speed = 2;  
    this.isRunning = false;
    this.stats = {
      exploredCount: 0,
      pathLength: 0,
      timeElapsed: 0,
      status: 'Ready'
    };
  }

  async findPath(): Promise<boolean> {
    if (!this.grid.startNode || !this.grid.endNode) {
      this.stats.status = 'Please set both start and end points';
      this.onStatsUpdate(this.stats);
      return false;
    }

    this.isRunning = true;
    this.stats = {
      exploredCount: 0,
      pathLength: 0,
      timeElapsed: 0,
      status: 'Finding path...'
    };

    const startTime = Date.now();
    
    const unvisited: PathfindingNode[] = [];
    for (let row = 0; row < this.grid.rows; row++) {
      for (let col = 0; col < this.grid.cols; col++) {
        const node = this.grid.nodes[row][col];
        node.distance = Infinity;
        node.previous = null;
        node.isVisited = false;
        unvisited.push(node);
      }
    }

    this.grid.startNode.distance = 0;

    while (unvisited.length > 0) {
      if (!this.isRunning) break;

      unvisited.sort((a, b) => a.distance - b.distance);
      const currentNode = unvisited.shift()!;

      if (currentNode.type === 'obstacle' || currentNode.distance === Infinity) {
        continue;
      }

      if (currentNode.type !== 'start' && currentNode.type !== 'end') {
        currentNode.type = 'current';
        this.onNodeUpdate(currentNode);
      }

      if (currentNode === this.grid.endNode) {
        await this.reconstructPath();
        this.stats.timeElapsed = Date.now() - startTime;
        this.stats.status = 'Path found!';
        this.onStatsUpdate(this.stats);
        this.isRunning = false;
        return true;
      }

      const neighbors = this.grid.getNeighbors(currentNode);
      for (const neighbor of neighbors) {
        if (neighbor.isVisited) continue;

        const tentativeDistance = currentNode.distance + 1;
        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previous = currentNode;
        }
      }

      currentNode.isVisited = true;
      if (currentNode.type === 'current') {
        currentNode.type = 'explored';
        this.stats.exploredCount++;
        this.onNodeUpdate(currentNode);
      }

      this.stats.timeElapsed = Date.now() - startTime;
      this.onStatsUpdate(this.stats);

      await this.delay(this.getDelayTime());
    }

    this.stats.timeElapsed = Date.now() - startTime;
    this.stats.status = 'No path found';
    this.onStatsUpdate(this.stats);
    this.isRunning = false;
    return false;
  }

  async reconstructPath() {
    const path: PathfindingNode[] = [];
    let currentNode = this.grid.endNode;

    while (currentNode !== null) {
      path.unshift(currentNode);
      currentNode = currentNode.previous;
    }

    this.stats.pathLength = Math.max(0, path.length - 1);

    for (let i = 1; i < path.length - 1; i++) {
      path[i].type = 'path';
      this.onNodeUpdate(path[i]);
      await this.delay(50);
    }
  }

  getDelayTime(): number {
    const speeds = { 1: 200, 2: 100, 3: 30 };
    return speeds[this.speed as keyof typeof speeds] || 100;
  }

  delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  stop() {
    this.isRunning = false;
  }

  setSpeed(speed: number) {
    this.speed = speed;
  }
}
