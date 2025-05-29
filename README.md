# Pathfinding Visualizer

An interactive pathfinding visualizer that demonstrates Dijkstra's algorithm with real-time animation on a customizable grid.

## Features

- **Interactive 10x10 Grid**: Click to place start points, end points, and obstacles
- **Real-time Algorithm Visualization**: Watch Dijkstra's algorithm explore nodes and find the shortest path
- **Adjustable Animation Speed**: Control the visualization speed (slow, medium, fast)
- **Grid Save/Load System**: Save your favorite grid configurations and load them later
- **Beautiful Purple Theme**: Girly purple aesthetic with gradients and animations
- **Responsive Design**: Compact single-page layout that fits perfectly on screen
- **Algorithm Statistics**: Track nodes explored, path length, and execution time

## Technologies Used

- **Frontend**: React 18, TypeScript
- **Styling**: Tailwind CSS with custom purple theme
- **UI Components**: Radix UI components for modern interface
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL for grid persistence
- **State Management**: React hooks and TanStack Query
- **Animation**: CSS animations and transitions

## Algorithm Implementation

The core pathfinding logic implements Dijkstra's algorithm with:
- Priority queue using sorted array
- Real-time node exploration visualization
- Animated path reconstruction
- Performance tracking and statistics

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL database (for grid saving feature)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd pathfinding-visualizer
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
# Database connection will be provided automatically in supported environments
```

4. Start the development server
```bash
npm run dev
```

5. Open your browser to `http://localhost:5000`

## How to Use

1. **Select Mode**: Choose from Start Point, End Point, Obstacles, or Erase mode
2. **Build Your Maze**: Click on grid cells to place elements
3. **Adjust Speed**: Use the slider to control animation speed
4. **Find Path**: Click the "Find Path" button to run Dijkstra's algorithm
5. **Save Grid**: Save interesting configurations for later use
6. **Load Grid**: Quickly load previously saved grids

## Algorithm Details

The visualizer implements Dijkstra's shortest path algorithm:

1. Initialize all nodes with infinite distance except start node (distance 0)
2. Maintain a priority queue of unvisited nodes
3. Process nodes in order of shortest distance
4. Update neighbor distances when shorter paths are found
5. Mark nodes as explored and visualize the process
6. Reconstruct and animate the final shortest path

## Color Coding

- **Green**: Start point
- **Pink**: End point  
- **Dark Purple**: Obstacles/walls
- **Light Purple**: Explored nodes
- **Bright Purple**: Current node being processed
- **Orange/Pink**: Final shortest path

## Project Structure

```
pathfinding-visualizer/
├── client/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── lib/           # Core algorithm logic
│   │   ├── pages/         # Page components
│   │   └── hooks/         # Custom React hooks
├── server/
│   ├── index.ts          # Express server setup
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data persistence
├── shared/
│   └── schema.ts         # Database schema
└── package.json
```

## API Endpoints

- `GET /api/grids` - Fetch all saved grids
- `POST /api/grids` - Save a new grid configuration
- `PUT /api/grids/:id` - Update existing grid
- `DELETE /api/grids/:id` - Delete a grid

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of a Web Engineering laboratory exercise.

## Acknowledgments

- Dijkstra's algorithm implementation based on computer science fundamentals
- UI components powered by Radix UI
- Purple theme design for aesthetic appeal
- Real-time visualization techniques for educational purposes
