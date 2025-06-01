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
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-lg border-2 border-purple-200 p-4 w-[800px] mx-auto ">
      <div className="flex items-center justify-center mb-3">
        <h2 className="text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center">
          <svg
            className="w-5 h-5 text-purple-500 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
            />
          </svg>
          ✨ Interactive Grid ✨
        </h2>
      </div>
      <div className="flex justify-center mb-3 ">
        <div className="inline-block border-3 border-purple-300 rounded-2xl overflow-hidden shadow-xl bg-white/30 backdrop-blur-sm p-2 w-[400px]">
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
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 rounded-xl p-3 shadow-md">
        <div className="text-center">
          <h4 className="text-sm font-semibold text-purple-800 mb-2">
            💜 Quick Guide
          </h4>
          <p className="text-xs text-purple-700">
            Select mode → Click cells → Adjust speed → Find Path ✨
          </p>
        </div>
      </div>
    </div>
  );
}
