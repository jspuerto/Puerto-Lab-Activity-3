import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SaveIcon,
  FolderOpenIcon,
  TrashIcon,
  CalendarIcon,
} from "lucide-react";
import { PathfindingGrid } from "@/lib/pathfinding";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Grid } from "@shared/schema";

interface SavedGridsProps {
  currentGrid: PathfindingGrid;
  onLoadGrid: (gridData: any) => void;
}

export function SavedGrids({ currentGrid, onLoadGrid }: SavedGridsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [gridName, setGridName] = useState("");
  const { toast } = useToast();

  const { data: savedGrids, isLoading } = useQuery({
    queryKey: ["/api/grids"],
    queryFn: () =>
      fetch("/api/grids").then((res) => res.json()) as Promise<Grid[]>,
  });

  const saveGridMutation = useMutation({
    mutationFn: async (data: { name: string; gridData: any }) => {
      const response = await fetch("/api/grids", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to save grid");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grids"] });
      setSaveDialogOpen(false);
      setGridName("");
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
    },
  });

  const deleteGridMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/grids/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete grid");
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/grids"] });
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
    },
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

    const gridData = {
      nodes: currentGrid.nodes.map((row) =>
        row.map((node) => ({
          row: node.row,
          col: node.col,
          type: node.type,
        }))
      ),
      startNode: currentGrid.startNode
        ? { row: currentGrid.startNode.row, col: currentGrid.startNode.col }
        : null,
      endNode: currentGrid.endNode
        ? { row: currentGrid.endNode.row, col: currentGrid.endNode.col }
        : null,
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
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 shadow-lg h-full flex flex-col w-[1000px]+">
      <CardHeader className="pb-1 flex-shrink-0">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center text-sm">
            <FolderOpenIcon className="w-4 h-4 text-purple-600 mr-2" />
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
               Saved
            </span>
          </div>
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-xs py-1 h-6"
              >
                <SaveIcon className="w-3 h-3 mr-1" />
                Save
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-300">
              <DialogHeader>
                <DialogTitle className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Save Grid Configuration
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="gridName" className="text-purple-700">
                    Grid Name
                  </Label>
                  <Input
                    id="gridName"
                    value={gridName}
                    onChange={(e) => setGridName(e.target.value)}
                    placeholder="Enter a name for your grid... "
                    className="mt-1 border-purple-300 focus:border-purple-500"
                  />
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setSaveDialogOpen(false)}
                    className="border-purple-400 text-purple-600 hover:bg-purple-50"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSaveGrid}
                    disabled={saveGridMutation.isPending}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    {saveGridMutation.isPending
                      ? "Saving... "
                      : "Save Grid "}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 flex-1 min-h-0">
        {isLoading ? (
          <div className="text-center py-2 text-purple-500 text-xs">
            Loading... 
          </div>
        ) : !savedGrids || savedGrids.length === 0 ? (
          <div className="text-center py-2 text-purple-500">
            <FolderOpenIcon className="w-6 h-6 mx-auto mb-1 text-purple-300" />
            <p className="text-xs">No saved grids </p>
          </div>
        ) : (
          <div className="space-y-1 h-full">
            {savedGrids.slice(0, 4).map((grid) => (
              <div
                key={grid.id}
                className="flex items-center justify-between p-1 bg-white/50 rounded border border-purple-200"
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-purple-800 text-xs truncate">
                    {grid.name}
                  </h4>
                </div>
                <div className="flex space-x-1 ml-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLoadGrid(grid)}
                    className="text-purple-600 border-purple-400 hover:bg-purple-50 text-xs py-0 px-1 h-5"
                  >
                    Load
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteGridMutation.mutate(grid.id)}
                    disabled={deleteGridMutation.isPending}
                    className="text-pink-600 border-pink-400 hover:bg-pink-50 p-0 h-5 w-5"
                  >
                    <TrashIcon className="w-2 h-2" />
                  </Button>
                </div>
              </div>
            ))}
            {savedGrids && savedGrids.length > 4 && (
              <div className="text-center text-xs text-purple-500">
                +{savedGrids.length - 4} more grids
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
