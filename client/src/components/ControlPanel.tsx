import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { PlayIcon, Eraser, RefreshCwIcon, SettingsIcon, InfoIcon, PaletteIcon, RouteIcon, SparklesIcon, HeartIcon } from 'lucide-react';
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
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm">
            <SparklesIcon className="w-4 h-4 text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">✨ Controls</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div>
            <Label className="text-xs font-medium text-purple-700 mb-1 block">💜 Mode</Label>
            <RadioGroup value={mode} onValueChange={(value) => onModeChange(value as PlacementMode)} className="space-y-1">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="start" id="start" className="border-purple-400 text-purple-600 w-3 h-3" />
                <Label htmlFor="start" className="flex items-center cursor-pointer text-purple-700 hover:text-purple-800 text-xs">
                  <div className="w-3 h-3 cell-start rounded mr-2"></div>
                  Start 🌟
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="end" id="end" className="border-purple-400 text-purple-600 w-3 h-3" />
                <Label htmlFor="end" className="flex items-center cursor-pointer text-purple-700 hover:text-purple-800 text-xs">
                  <div className="w-3 h-3 cell-end rounded mr-2"></div>
                  End 💕
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="obstacle" id="obstacle" className="border-purple-400 text-purple-600 w-3 h-3" />
                <Label htmlFor="obstacle" className="flex items-center cursor-pointer text-purple-700 hover:text-purple-800 text-xs">
                  <div className="w-3 h-3 cell-obstacle rounded mr-2"></div>
                  Obstacles 🏰
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="erase" id="erase" className="border-purple-400 text-purple-600 w-3 h-3" />
                <Label htmlFor="erase" className="flex items-center cursor-pointer text-purple-700 hover:text-purple-800 text-xs">
                  <Eraser className="w-3 h-3 text-purple-500 mr-2" />
                  Erase ✨
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <Label className="text-xs font-medium text-purple-700 mb-1 block">⚡ Speed</Label>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-purple-500">Slow</span>
              <Slider
                value={[speed]}
                onValueChange={(values) => onSpeedChange(values[0])}
                max={3}
                min={1}
                step={1}
                className="flex-1"
              />
              <span className="text-xs text-purple-500">Fast</span>
            </div>
            <div className="mt-1 text-center">
              <span className="text-xs font-mono text-purple-600 bg-white/50 px-2 py-0.5 rounded-full">
                {speedNames[speed as keyof typeof speedNames]}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm">
            <PlayIcon className="w-4 h-4 text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">✨ Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <Button 
            onClick={onFindPath} 
            disabled={isRunning}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs py-2"
          >
            <RouteIcon className="w-3 h-3 mr-2" />
            Find Path ✨
          </Button>
          
          <Button 
            onClick={onClearPath} 
            disabled={isRunning}
            variant="outline"
            className="w-full border-purple-400 text-purple-600 hover:bg-purple-50 text-xs py-2"
          >
            <Eraser className="w-3 h-3 mr-2" />
            Clear Path
          </Button>
          
          <Button 
            onClick={onResetGrid} 
            disabled={isRunning}
            variant="outline"
            className="w-full border-purple-400 text-purple-600 hover:bg-purple-50 text-xs py-2"
          >
            <RefreshCwIcon className="w-3 h-3 mr-2" />
            Reset Grid
          </Button>
        </CardContent>
      </Card>

      {/* Algorithm Info */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center text-sm">
            <InfoIcon className="w-4 h-4 text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">💜 Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 pt-0">
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-600">Status:</span>
            <span className="text-xs font-mono bg-white/50 px-2 py-0.5 rounded text-purple-700">{stats.status}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-600">Explored:</span>
            <span className="text-xs font-mono bg-purple-100 px-2 py-0.5 rounded text-purple-800">{stats.exploredCount}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-600">Path:</span>
            <span className="text-xs font-mono bg-pink-100 px-2 py-0.5 rounded text-purple-800">{stats.pathLength}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-purple-600">Time:</span>
            <span className="text-xs font-mono bg-purple-100 px-2 py-0.5 rounded text-purple-800">{stats.timeElapsed}ms</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
