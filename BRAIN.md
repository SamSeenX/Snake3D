# BRAIN.md &middot; Mochi Snake 3D Garden Architecture

## 1. Project Philosophy & Vision
Mochi Snake 3D Garden is a relaxing Japanese diorama snake simulation inspired by Animal Crossing and Studio Ghibli. Instead of an arcade aesthetic or rigid cube grids, the snake appears as a continuous organic mochi dragon exploring a miniature cedar wood planter with matcha garden tiles and morning mist atmosphere.

## 2. Technical Stack & Key Decisions
- **Rendering**: Vanilla Three.js (`CatmullRomCurve3`, `TubeGeometry`, `InstancedMesh`, `MeshStandardMaterial`).
- **Build Tooling**: Vite targeting modern `es2022` with console and debugger removal on production bundles.
- **Styling**: Pure semantic Vanilla CSS with Fredoka typography, pill badges, and safe area insets.
- **State & Architecture**: Reactive micro-store and decoupled pub-sub event bus keeping view and simulation decoupled.
- **File Modularity**: Every single source file strictly adheres to the under 200 lines rule.

## 3. Subsystem Breakdown
- `src/sim/engine.js`: Pure mathematical grid loop managing discrete tile movements, apples, and collisions.
- `src/sim/ai.js`: Safe pathfinding heuristic utilizing BFS reachability, longest path tail-chasing, and fail-safe survival.
- `src/view/scene.js`: Three.js scene setup with soft pastel background, directional sunlight, and ACESFilmic tone mapping.
- `src/view/diorama.js`: Miniature wooden planter pedestal, soil bed, matcha stepping stones, and corner bamboo markers.
- `src/view/dragon-parts.js`: Procedural anime dragon head mesh with snout, dark bead eyes with reflection glints, blushing cheeks, cream horns, and whiskers.
- `src/view/snake-mesh.js`: Catmull-Rom spline tube generation and instanced white spine spikes tapered toward the tail.
- `src/view/food-mesh.js`: Glossy red spherical apple complete with curved wood stem, emerald leaf, and ambient hover float.
- `src/view/camera.js`: Isometric angle with gentle turntable orbit and drag to explore controls.

## 4. Engineering Memories & Fixes
- **Spline Tangent vs Head Orientation**: Avoid relying on global cardinal directions for dragon head rotation. Use dynamic vector math between head and neck spline nodes to ensure the dragon always faces forward through sharp turns.
- **Instanced Spike Orientation**: Pre-rotating cone geometry by `0.38` radians slants spikes backward along the spine without shearing on rotation transforms.
- **PWA & Social Previews**: Compact 1:1 square preview (`256x256`) with `summary` card metadata for social share targets.
