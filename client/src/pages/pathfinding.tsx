import { useState, useCallback, useEffect } from 'react';
import { PathfindingGrid, DijkstraAlgorithm, PathfindingNode, PathfindingStats } from '@/lib/pathfinding';
import { Grid } from '@/components/Grid';
import { ControlPanel, PlacementMode } from '@/components/ControlPanel';
import { SavedGrids } from '@/components/SavedGrids';
import { RouteIcon } from 'lucide-react';

export default function PathfindingPage() {
  const [grid] = useState(() => new PathfindingGrid(10, 10));
  const [nodes, setNodes] = useState(grid.nodes);
  const [mode, setMode] = useState<PlacementMode>('start');
  const [speed, setSpeed] = useState(2);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState<PathfindingStats>({
    exploredCount: 0,
    pathLength: 0,
    timeElapsed: 0,
    status: 'Ready'
  });

  const [algorithm] = useState(() => {
    const onNodeUpdate = (node: PathfindingNode) => {
      setNodes([...grid.nodes]);
    };

    const onStatsUpdate = (newStats: PathfindingStats) => {
      setStats(newStats);
    };

    return new DijkstraAlgorithm(grid, onNodeUpdate, onStatsUpdate);
  });

  useEffect(() => {
    algorithm.setSpeed(speed);
  }, [speed, algorithm]);

  const handleCellClick = useCallback((row: number, col: number) => {
    if (isRunning) return;

    const node = grid.getNode(row, col);
    if (!node) return;

    switch (mode) {
      case 'start':
        if (node.type !== 'end' && node.type !== 'obstacle') {
          grid.setNodeType(row, col, 'start');
        }
        break;
      case 'end':
        if (node.type !== 'start' && node.type !== 'obstacle') {
          grid.setNodeType(row, col, 'end');
        }
        break;
      case 'obstacle':
        if (node.type !== 'start' && node.type !== 'end') {
          const newType = node.type === 'obstacle' ? 'empty' : 'obstacle';
          grid.setNodeType(row, col, newType);
        }
        break;
      case 'erase':
        if (node.type === 'start') {
          grid.startNode = null;
        } else if (node.type === 'end') {
          grid.endNode = null;
        }
        grid.setNodeType(row, col, 'empty');
        break;
    }

    setNodes([...grid.nodes]);
  }, [mode, isRunning, grid]);

  const handleFindPath = useCallback(async () => {
    if (isRunning || !grid.startNode || !grid.endNode) {
      if (!grid.startNode || !grid.endNode) {
        setStats(prev => ({ ...prev, status: 'Please set both start and end points' }));
      }
      return;
    }

    setIsRunning(true);
    await algorithm.findPath();
    setIsRunning(false);
  }, [isRunning, grid, algorithm]);

  const handleClearPath = useCallback(() => {
    if (isRunning) return;
    
    algorithm.stop();
    grid.clearPath();
    setNodes([...grid.nodes]);
    setStats({
      exploredCount: 0,
      pathLength: 0,
      timeElapsed: 0,
      status: 'Path cleared'
    });
  }, [isRunning, grid, algorithm]);

  const handleResetGrid = useCallback(() => {
    if (isRunning) return;
    
    algorithm.stop();
    grid.reset();
    setNodes([...grid.nodes]);
    setStats({
      exploredCount: 0,
      pathLength: 0,
      timeElapsed: 0,
      status: 'Grid reset'
    });
  }, [isRunning, grid, algorithm]);

  const handleLoadGrid = useCallback((gridData: any) => {
    if (isRunning) return;
    
    algorithm.stop();
    grid.loadFromData(gridData);
    setNodes([...grid.nodes]);
    setStats({
      exploredCount: 0,
      pathLength: 0,
      timeElapsed: 0,
      status: 'Grid loaded'
    });
  }, [isRunning, grid, algorithm]);

  return (
    <>
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-100 via-pink-50 to-purple-100 shadow-lg border-b-2 border-purple-200">
        <div className="max-w-full mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shadow-md">
                <RouteIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Pathfinding Visualizer
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-white/30 backdrop-blur-sm px-2 py-1 rounded-full border border-purple-200">
              <span className="text-xs text-purple-600 font-mono">
                Puerto - Web-Based Interactive Pathfinding Visualizer
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="h-[calc(100vh-3rem)] max-w-full mx-auto px-2 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-full">
          <div className="lg:col-span-1 space-y-2 h-full flex flex-col">
            <div className="flex-1">
              <ControlPanel
                mode={mode}
                onModeChange={setMode}
                speed={speed}
                onSpeedChange={setSpeed}
                onFindPath={handleFindPath}
                onClearPath={handleClearPath}
                onResetGrid={handleResetGrid}
                stats={stats}
                isRunning={isRunning}
              />
            </div>

            <div className="flex-1">
              <SavedGrids currentGrid={grid} onLoadGrid={handleLoadGrid} />
            </div>
          </div>

          <div className="lg:col-span-3 flex items-center justify-center h-full">
            <Grid
              nodes={nodes}
              onCellClick={handleCellClick}
              isRunning={isRunning}
            />
          </div>
        </div>
      </div>
    </>
  );
}
