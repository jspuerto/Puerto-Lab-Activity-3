# Pathfinding Visualizer

A modern, interactive pathfinding visualizer built with TypeScript, and Tailwind CSS.  
Visualize algorithms like A* and Dijkstra on a grid, save your favorite grids, and experiment with different scenarios!

---

##  Features

- **Interactive Grid:** Place start, end, and wall nodes with simple clicks.
- **Algorithm Visualization:** Watch pathfinding algorithms step through the grid.
- **Adjustable Speed:** Control the animation speed.
- **Grid Saving:** Save and load your favorite grid layouts (local storage, no backend required).
- **Responsive UI:** Clean, modern design with Tailwind CSS.

---

##  Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or newer)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/your-username/pathfinding-visualizer.git
   cd pathfinding-visualizer
   ```

2. **Install dependencies:**
   ```sh
   cd client
   npm install
   # or
   yarn install
   ```

3. **Start the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

4. **Open in your browser:**
   ```
   http://localhost:5000
   ```

---

##  Project Structure

```
client/
  src/
    components/    # React components (Grid, ControlPanel, SavedGrids, etc.)
    hooks/         # Custom React hooks (e.g., use-toast)
    lib/           # Pathfinding algorithms and helpers
    App.tsx        # Main app entry
    main.tsx       # React root
    index.css      # Tailwind and global styles
shared/
  ...              # Shared types or utilities (if any)
```


##  Saving Grids

- Grids are saved in your browser's local storage.
- No backend or account required.
- You can save, load, and delete grid layouts from the UI.

---

