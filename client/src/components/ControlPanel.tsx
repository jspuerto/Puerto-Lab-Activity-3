import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlayIcon, Eraser, RefreshCwIcon, SettingsIcon, InfoIcon, PaletteIcon, RouteIcon } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Mode Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <SettingsIcon className="w-5 h-5 text-blue-600 mr-2" />
            Controls
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Current Mode</Label>
            <RadioGroup value={mode} onValueChange={(value) => onModeChange(value as PlacementMode)}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="start" id="start" />
                <Label htmlFor="start" className="flex items-center cursor-pointer">
                  <div className="w-4 h-4 cell-start rounded mr-2"></div>
                  Place Start Point
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="end" id="end" />
                <Label htmlFor="end" className="flex items-center cursor-pointer">
                  <div className="w-4 h-4 cell-end rounded mr-2"></div>
                  Place End Point
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="obstacle" id="obstacle" />
                <Label htmlFor="obstacle" className="flex items-center cursor-pointer">
                  <div className="w-4 h-4 cell-obstacle rounded mr-2"></div>
                  Place Obstacles
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="erase" id="erase" />
                <Label htmlFor="erase" className="flex items-center cursor-pointer">
                  <Eraser className="w-4 h-4 text-gray-500 mr-2" />
                  Erase
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">Animation Speed</Label>
            <div className="flex items-center space-x-3">
              <span className="text-xs text-gray-500">Slow</span>
              <Slider
                value={[speed]}
                onValueChange={(values) => onSpeedChange(values[0])}
                max={3}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-gray-500">Fast</span>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-mono text-gray-600">
                {speedNames[speed as keyof typeof speedNames]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PlayIcon className="w-5 h-5 text-green-600 mr-2" />
            Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={onFindPath} 
            disabled={isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <RouteIcon className="w-4 h-4 mr-2" />
            Find Path
          </Button>
          
          <Button 
            onClick={onClearPath} 
            disabled={isRunning}
            variant="outline"
            className="w-full border-orange-600 text-orange-600 hover:bg-orange-50"
          >
            <Eraser className="w-4 h-4 mr-2" />
            Clear Path
          </Button>
          
          <Button 
            onClick={onResetGrid} 
            disabled={isRunning}
            variant="outline"
            className="w-full border-gray-600 text-gray-600 hover:bg-gray-50"
          >
            <RefreshCwIcon className="w-4 h-4 mr-2" />
            Reset Grid
          </Button>
        </CardContent>
      </Card>

      {/* Algorithm Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <InfoIcon className="w-5 h-5 text-purple-600 mr-2" />
            Algorithm Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Status:</span>
            <span className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">{stats.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Nodes Explored:</span>
            <span className="text-sm font-mono bg-blue-50 px-2 py-1 rounded text-blue-800">{stats.exploredCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Path Length:</span>
            <span className="text-sm font-mono bg-orange-50 px-2 py-1 rounded text-orange-800">{stats.pathLength}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Time Elapsed:</span>
            <span className="text-sm font-mono bg-green-50 px-2 py-1 rounded text-green-800">{stats.timeElapsed}ms</span>
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <PaletteIcon className="w-5 h-5 text-indigo-600 mr-2" />
            Legend
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center">
            <div className="w-4 h-4 cell-start rounded mr-3"></div>
            <span className="text-sm text-gray-700">Start Point</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 cell-end rounded mr-3"></div>
            <span className="text-sm text-gray-700">End Point</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 cell-obstacle rounded mr-3"></div>
            <span className="text-sm text-gray-700">Obstacle</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 cell-explored rounded mr-3"></div>
            <span className="text-sm text-gray-700">Explored Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 cell-current rounded mr-3"></div>
            <span className="text-sm text-gray-700">Current Node</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 cell-path rounded mr-3"></div>
            <span className="text-sm text-gray-700">Shortest Path</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
