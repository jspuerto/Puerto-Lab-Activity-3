import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { SaveIcon, FolderOpenIcon, TrashIcon, CalendarIcon } from 'lucide-react';
import { PathfindingGrid, PathfindingNode } from '@/lib/pathfinding';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import type { Grid } from '@shared/schema';

interface SavedGridsProps {
  currentGrid: PathfindingGrid;
  onLoadGrid: (gridData: any) => void;
}

export function SavedGrids({ currentGrid, onLoadGrid }: SavedGridsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [gridName, setGridName] = useState('');
  const { toast } = useToast();

  const { data: savedGrids, isLoading } = useQuery({
    queryKey: ['/api/grids'],
    queryFn: () => fetch('/api/grids').then(res => res.json()) as Promise<Grid[]>
  });

  const saveGridMutation = useMutation({
    mutationFn: async (data: { name: string; gridData: any }) => {
      const response = await fetch('/api/grids', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to save grid');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grids'] });
      setSaveDialogOpen(false);
      setGridName('');
      toast({
        title: "Grid Saved!",
        description: "Your pathfinding grid has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Save Failed",
        description: "Failed to save the grid. Please try again.",
        variant: "destructive",
      });
    }
  });

  const deleteGridMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/grids/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete grid');
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/grids'] });
      toast({
        title: "Grid Deleted",
        description: "The grid has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Delete Failed", 
        description: "Failed to delete the grid. Please try again.",
        variant: "destructive",
      });
    }
  });

  const handleSaveGrid = () => {
    if (!gridName.trim()) {
      toast({
        title: "Name Required",
        description: "Please enter a name for your grid.",
        variant: "destructive",
      });
      return;
    }

    // Serialize the current grid state
    const gridData = {
      nodes: currentGrid.nodes.map(row => 
        row.map(node => ({
          row: node.row,
          col: node.col,
          type: node.type
        }))
      ),
      startNode: currentGrid.startNode ? { row: currentGrid.startNode.row, col: currentGrid.startNode.col } : null,
      endNode: currentGrid.endNode ? { row: currentGrid.endNode.row, col: currentGrid.endNode.col } : null
    };

    saveGridMutation.mutate({ name: gridName, gridData });
  };

  const handleLoadGrid = (grid: Grid) => {
    try {
      onLoadGrid(grid.gridData);
      toast({
        title: "Grid Loaded!",
        description: `Successfully loaded "${grid.name}".`,
      });
    } catch (error) {
      toast({
        title: "Load Failed",
        description: "Failed to load the grid. The data might be corrupted.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <FolderOpenIcon className="w-5 h-5 text-indigo-600 mr-2" />
            Saved Grids
          </div>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="bg-green-600 hover:bg-green-700">
                <SaveIcon className="w-4 h-4 mr-2" />
                Save Current
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Save Grid Configuration</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gridName">Grid Name</Label>
                  <Input
                    id="gridName"
                    value={gridName}
                    onChange={(e) => setGridName(e.target.value)}
                    placeholder="Enter a name for your grid..."
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setSaveDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSaveGrid}
                    disabled={saveGridMutation.isPending}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {saveGridMutation.isPending ? 'Saving...' : 'Save Grid'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-4 text-gray-500">Loading saved grids...</div>
        ) : !savedGrids || savedGrids.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <FolderOpenIcon className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>No saved grids yet</p>
            <p className="text-sm">Save your current grid to see it here</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {savedGrids.map((grid) => (
              <div key={grid.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{grid.name}</h4>
                  <div className="flex items-center text-xs text-gray-500 mt-1">
                    <CalendarIcon className="w-3 h-3 mr-1" />
                    {formatDate(grid.createdAt)}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadGrid(grid)}
                    className="text-blue-600 border-blue-600 hover:bg-blue-50"
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGridMutation.mutate(grid.id)}
                    disabled={deleteGridMutation.isPending}
                    className="text-red-600 border-red-600 hover:bg-red-50"
                  >
                    <TrashIcon className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}