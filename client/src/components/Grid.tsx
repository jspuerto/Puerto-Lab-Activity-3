import { PathfindingNode } from '@/lib/pathfinding';
import { PlayIcon, FlagIcon } from 'lucide-react';

interface GridProps {
  nodes: PathfindingNode[][];
  onCellClick: (row: number, col: number) => void;
  isRunning: boolean;
}

export function Grid({ nodes, onCellClick, isRunning }: GridProps) {
  const getCellClass = (node: PathfindingNode) => {
    const baseClass = 'w-8 h-8 border-2 cursor-pointer transition-all duration-300 hover:scale-105 flex items-center justify-center rounded-lg';
    
    switch (node.type) {
      case 'start':
        return `${baseClass} cell-start`;
      case 'end':
        return `${baseClass} cell-end`;
      case 'obstacle':
        return `${baseClass} cell-obstacle`;
      case 'current':
        return `${baseClass} cell-current`;
      case 'path':
        return `${baseClass} cell-path`;
      case 'explored':
        return `${baseClass} cell-explored`;
      default:
        return `${baseClass} bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:from-purple-100 hover:to-pink-100 hover:border-purple-300`;
    }
  };

  const getCellIcon = (node: PathfindingNode) => {
    if (node.type === 'start') {
      return <PlayIcon className="w-4 h-4 text-white" />;
    }
    if (node.type === 'end') {
      return <FlagIcon className="w-4 h-4 text-white" />;
    }
    return null;
  };

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
          <svg className="w-6 h-6 text-purple-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          ✨ Interactive Grid ✨
        </h2>
        <div className="text-sm text-purple-500 font-mono bg-white/50 px-3 py-1 rounded-full">10×10 Grid</div>
      </div>
      
      <div className="flex justify-center">
        <div className="inline-block border-3 border-purple-300 rounded-2xl overflow-hidden shadow-xl bg-white/30 backdrop-blur-sm p-2">
          <div className="grid grid-cols-10 gap-1">
            {nodes.map((row, rowIndex) =>
              row.map((node, colIndex) => (
                <button
                  key={`${rowIndex}-${colIndex}`}
                  className={getCellClass(node)}
                  onClick={() => !isRunning && onCellClick(rowIndex, colIndex)}
                  disabled={isRunning}
                >
                  {getCellIcon(node)}
                </button>
              ))
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-2xl p-4 shadow-md">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-purple-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-purple-800 mb-2">💜 How to Use:</h4>
            <ol className="text-sm text-purple-700 space-y-1 list-decimal list-inside">
              <li>Select a mode from the controls panel</li>
              <li>Click on grid cells to place start/end points or obstacles</li>
              <li>Adjust the animation speed if desired</li>
              <li>Click "Find Path" to visualize Dijkstra's algorithm</li>
              <li>Watch as the algorithm explores nodes and finds the shortest path ✨</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
