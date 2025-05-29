import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Eraser, RouteIcon, SparklesIcon} from 'lucide-react';
import { PathfindingStats } from '@/lib/pathfinding';

export type PlacementMode = 'start' | 'end' | 'obstacle' | 'erase';

interface ControlPanelProps {
  mode: PlacementMode;
  onModeChange: (mode: PlacementMode) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  onFindPath: () => void;
  onClearPath: () => void;
  onResetGrid: () => void;
  stats: PathfindingStats;
  isRunning: boolean;
}

export function ControlPanel({
  mode,
  onModeChange,
  speed,
  onSpeedChange,
  onFindPath,
  onClearPath,
  onResetGrid,
  stats,
  isRunning
}: ControlPanelProps) {
  const speedNames = { 1: 'Slow Speed', 2: 'Medium Speed', 3: 'Fast Speed' };

  return (
    <div className="h-full flex flex-col">
      {/* Combined Card with all controls */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg h-full flex flex-col">
        <CardHeader className="pb-1 flex-shrink-0">
          <CardTitle className="flex items-center text-sm">
            <SparklesIcon className="w-4 h-4 text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Controls
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 flex-1 flex flex-col space-y-2">
          {/* Mode Selection - Compact */}
          <div className="flex-shrink-0">
            <Label className="text-xs font-medium text-purple-700 mb-1 block">
              Mode
            </Label>
            <div className="grid grid-cols-2 gap-1">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="start"
                  checked={mode === "start"}
                  onChange={(e) =>
                    onModeChange(e.target.value as PlacementMode)
                  }
                  className="w-3 h-3 text-purple-600"
                />
                <div className="w-2 h-2 cell-start rounded"></div>
                <span className="text-xs text-purple-700">Start</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="end"
                  checked={mode === "end"}
                  onChange={(e) =>
                    onModeChange(e.target.value as PlacementMode)
                  }
                  className="w-3 h-3 text-purple-600"
                />
                <div className="w-2 h-2 cell-end rounded"></div>
                <span className="text-xs text-purple-700">End</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="obstacle"
                  checked={mode === "obstacle"}
                  onChange={(e) =>
                    onModeChange(e.target.value as PlacementMode)
                  }
                  className="w-3 h-3 text-purple-600"
                />
                <div className="w-2 h-2 cell-obstacle rounded"></div>
                <span className="text-xs text-purple-700">Wall</span>
              </label>
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="radio"
                  name="mode"
                  value="erase"
                  checked={mode === "erase"}
                  onChange={(e) =>
                    onModeChange(e.target.value as PlacementMode)
                  }
                  className="w-3 h-3 text-purple-600"
                />
                <Eraser className="w-2 h-2 text-purple-500" />
                <span className="text-xs text-purple-700">Erase</span>
              </label>
            </div>
          </div>

          {/* Speed Control - Compact */}
          <div className="flex-shrink-0">
            <Label className="text-xs font-medium text-purple-700 mb-1 block">
              Speed: {speedNames[speed as keyof typeof speedNames]}
            </Label>
            <Slider
              value={[speed]}
              onValueChange={(values) => onSpeedChange(values[0])}
              max={3}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Action Buttons - Compact */}
          <div className="flex-shrink-0 space-y-1">
            <Button
              onClick={onFindPath}
              disabled={isRunning}
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs py-1 h-7"
            >
              <RouteIcon className="w-3 h-3 mr-1" />
              Find Path 
            </Button>
            <div className="grid grid-cols-2 gap-1">
              <Button
                onClick={onClearPath}
                disabled={isRunning}
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-purple-50 text-xs py-1 h-6"
              >
                Clear
              </Button>
              <Button
                onClick={onResetGrid}
                disabled={isRunning}
                variant="outline"
                className="border-purple-400 text-purple-600 hover:bg-purple-50 text-xs py-1 h-6"
              >
                Reset
              </Button>
            </div>
          </div>

          {/* Status - Compact */}
          <div className="flex-1 min-h-0">
            <Label className="text-xs font-medium text-purple-700 mb-1 block">
              Status
            </Label>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-xs text-purple-600">Status:</span>
                <span className="text-xs font-mono bg-white/50 px-1 py-0.5 rounded text-purple-700 truncate max-w-20">
                  {stats.status}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-xs">
                <div className="text-center">
                  <div className="text-purple-600">Explored</div>
                  <div className="font-mono bg-purple-100 px-1 rounded text-purple-800">
                    {stats.exploredCount}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600">Path</div>
                  <div className="font-mono bg-pink-100 px-1 rounded text-purple-800">
                    {stats.pathLength}
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-purple-600">Time</div>
                  <div className="font-mono bg-purple-100 px-1 rounded text-purple-800">
                    {stats.timeElapsed}ms
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
