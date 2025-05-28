import { useState, useCallback, useEffect } from 'react';
import { PathfindingGrid, DijkstraAlgorithm, PathfindingNode, PathfindingStats } from '@/lib/pathfinding';
import { Grid } from '@/components/Grid';
import { ControlPanel, PlacementMode } from '@/components/ControlPanel';
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

  return (
    <>
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <RouteIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Pathfinding Visualizer</h1>
                <p className="text-sm text-gray-500">Dijkstra's Algorithm Demonstration</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span className="text-sm text-gray-600 font-mono">Web Engineering Lab</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
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
          
          <div className="lg:col-span-2">
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
