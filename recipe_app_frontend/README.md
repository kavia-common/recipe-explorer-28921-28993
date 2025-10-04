# Recipe Explorer Frontend

Recipe Explorer is a lightweight React application for browsing, searching, and favoriting recipes. It ships with an accessible, modern UI using the Ocean Professional theme and a flexible data layer that can run entirely on local mock data or point to a backend API when available.

## Project Overview and Features

The app presents a searchable grid of recipe cards with a detail view shown in an accessible modal. Users can type to filter results, toggle common tag filters, and mark recipes as favorites. Favorites are stored locally in the browser so they persist across reloads. The UI emphasizes clarity and performance with subtle shadows, rounded corners, and smooth transitions, following the Ocean Professional theme.

Key features include:
- Search with 300ms debounce and live result counts
- Tag filters with multi-select toggle chips
- Responsive recipe grid with skeleton loaders and friendly empty states
- Favorites persistence via localStorage
- Accessible modal dialog with focus management, Escape/overlay close, and return-to-trigger focus
- Optional react-router based deep linking to recipe modals when routing is installed
- Switchable data source between local mock data and a future REST backend

## Getting Started (install, run, test)

Run these commands from recipe_app_frontend:

- Install dependencies:
  - npm install
- Start development server:
  - npm start
  - App runs at http://localhost:3000
- Execute unit/integration tests:
  - npm test
- Create a production build:
  - npm run build

The project uses Create React App tooling via react-scripts for local development and testing.

## Project Structure (key folders/files)

- src/index.js: Application entry. Optionally wraps the app with react-router-dom’s BrowserRouter if the dependency is present. Falls back to rendering App directly when routing is not installed.
- src/App.js: App shell that composes the sticky Header, Home content, and RecipeDetailModal. Wraps content with RecipesProvider for global state.
- src/pages/Home.jsx: Home page that shows a welcome surface and the RecipeGrid.
- src/components/: Reusable UI building blocks
  - layout/: Container.jsx and Header.jsx
  - common/: Button.jsx, Badge.jsx, Icon.jsx, Modal.jsx
  - search/: SearchBar.jsx and TagFilters.jsx
  - recipes/: RecipeGrid.jsx, RecipeCard.jsx, RecipeDetailModal.jsx, EmptyState.jsx, RecipeSkeleton.jsx
- src/state/: Application state with React Context and hook
  - RecipesContext.jsx: Global recipes state, actions, and URL history integration for modal open/close
  - useRecipes.js: Consumer hook for the RecipesContext
- src/api/: Data access abstraction
  - client.js: Minimal fetch wrapper with base URL and timeout
  - recipesApi.js: Switches between mock data and backend calls; exposes list/search/get and favorite helpers
- src/config/env.js: Reads and normalizes environment variables, sets defaults, and exports flags
- src/data/mockRecipes.js: Local mock dataset used when mock mode is enabled
- src/utils/: Pure utilities for filtering and client persistence
  - filters.js: Text and tag filtering helpers
  - storage.js: Favorites and last search persistence via localStorage
- src/types/recipe.js: JSDoc typedef for the Recipe shape
- src/__tests__/: Tests covering smoke rendering, search and filtering, favorites persistence, and modal accessibility
- src/index.css and src/App.css: Theme tokens, global resets, utilities, and app shell styles
- src/routes/AppRoutes.jsx: Optional routing table used only when react-router-dom is installed

## Theme: Ocean Professional (color tokens, styles, components)

The UI follows the Ocean Professional theme, a modern aesthetic with blue and amber accents, subtle shadows, rounded corners, and smooth transitions.

- Theme tokens in CSS: src/index.css defines CSS variables such as:
  - --color-primary: #2563EB
  - --color-secondary: #F59E0B
  - --color-success: #10B981
  - --color-error: #EF4444
  - --color-bg, --color-surface, --color-text, --color-text-muted, --color-border
  - Radii: --radius-sm/md/lg/pill
  - Shadows: --shadow-xs/sm/md/lg
  - Transitions: --transition-fast/base/slow
  - Focus ring tokens: --focus-ring and --focus-offset
- JS theme helper: src/theme.js exports the same token palette plus helpers like pxToRem and hexToRgba for component logic if needed.
- App shell and components: src/App.css and component inline styles use these tokens to maintain consistent spacing, color, and motion, including gradient background utilities and surface hover elevations.

## Data Layer: mock recipes and API abstraction

The data layer is centralized in src/api/recipesApi.js and uses:
- mockRecipes (src/data/mockRecipes.js) in mock mode, with a simulated 200–400ms delay to exercise loading states
- A future REST backend in non-mock mode using the minimal fetch client in src/api/client.js

Recipes API exposes:
- listRecipes(): all recipes
- getRecipeById(id)
- searchRecipes(query): server or client-side filtering depending on mode
- toggleFavorite(id) and getFavorites(): localStorage-backed favorites, even when a backend exists

State management in src/state/RecipesContext.jsx loads recipes, handles queries and tag filters, manages favorites, and controls the selected recipe for the detail modal.

## Environment Variables: REACT_APP_USE_MOCK, REACT_APP_API_BASE_URL (defaults and usage)

Environment configuration lives in src/config/env.js and follows CRA conventions (variables prefixed with REACT_APP_).

- REACT_APP_USE_MOCK
  - Type: string
  - Default: "true"
  - Behavior: If unset or not explicitly "false", mock mode is enabled. Set REACT_APP_USE_MOCK=false to switch to backend mode.
- REACT_APP_API_BASE_URL
  - Type: string
  - Default: http://localhost:4000/api
  - Used only when USE_MOCK is false to form request URLs in client.js.
- REACT_APP_REQUEST_TIMEOUT_MS (optional)
  - Type: number
  - Default: 8000
  - Overrides the default request timeout for HTTP requests.

Examples:
- Local mock mode (default): no .env required; npm start will run with mocks.
- Backend mode: create a .env file with:
  - REACT_APP_USE_MOCK=false
  - REACT_APP_API_BASE_URL=https://your-api.example.com/api

## Mock vs Backend Switching

At build time, Create React App inlines environment variables. The recipesApi.js module reads USE_MOCK from env.js and branches accordingly:
- USE_MOCK=true: returns local mockRecipes with simulated latency; search filters locally.
- USE_MOCK=false: uses requestJson() to call endpoints such as GET /recipes, GET /recipes/:id, GET /recipes/search?q=.

Favorite toggling remains client-side using localStorage in both modes until user accounts or backend persistence is introduced. This keeps UI interactions fast and predictable.

## Routing: optional react-router-dom with History API fallback

Routing is optional. The app will detect if react-router-dom is installed:
- When present, src/index.js wraps the app in BrowserRouter and uses src/routes/AppRoutes.jsx to support:
  - / for the main grid
  - /recipe/:id to deep link to the detail modal
- When not present, the app still supports opening/closing the modal and updates the URL query (?id=...) using history.pushState. Back/forward buttons work through a popstate listener in RecipesContext.

This dual approach lets the app remain fully functional without adding a routing dependency but allows deep-linking when routing is available.

## Accessibility Notes: skip link, focus management, modal a11y

The application aims to be accessible by default:
- Global skip link in App.js allows keyboard users to jump directly to main content.
- Focus rings are visible via CSS focus-visible tokens and consistent across interactive elements.
- Search input uses proper roles and aria-labels; live regions announce search result counts.
- Tag chips expose toggle state via aria-pressed and have keyboard activation with Enter/Space.
- Modal (src/components/common/Modal.jsx) implements:
  - role="dialog", aria-modal, aria-labelledby, aria-describedby
  - Focus trap within the dialog, Escape to close, and overlay click to close
  - Focus is set to the primary action on open and returned to the opener on close
  - Body scroll lock while open
- Tests in src/__tests__/ModalAccessibility.test.jsx verify opening, closing, focus, and trap behavior.

## Future Backend Integration Instructions

When integrating a real backend:
- Set REACT_APP_USE_MOCK=false and provide REACT_APP_API_BASE_URL.
- Implement the following endpoints expected by recipesApi.js:
  - GET /recipes → Recipe[]
  - GET /recipes/:id → Recipe
  - GET /recipes/search?q=<query> → Recipe[]
- Consider adding endpoints for favorites if you decide to persist them server-side. Update recipesApi.toggleFavorite to call the backend and reconcile with local state as needed.
- If adopting router-based deep links, ensure the server serves index.html on unknown routes to support BrowserRouter paths (/recipe/:id).

## Scripts and Available NPM commands

- npm start: Starts the development server with react-scripts.
- npm test: Runs the test suites with Jest and React Testing Library.
- npm run build: Builds an optimized production bundle.
- npm run eject: Ejects CRA configuration (irreversible; only if you need customization).

Tip: In CI environments, set CI=true for non-interactive test runs.

## Running With Custom Environment

Create a .env file in the project root (recipe_app_frontend) to override defaults. Example for backend mode:

REACT_APP_USE_MOCK=false
REACT_APP_API_BASE_URL=https://api.example.com/v1
REACT_APP_REQUEST_TIMEOUT_MS=10000

Then rebuild/restart:
- npm start (dev) or npm run build (production)

## Testing Overview

The test suite covers core behaviors:
- App.smoke.test.jsx: Renders header, search, and grid without CRA boilerplate.
- SearchAndFilter.test.jsx: Ensures debounced search updates results and clear restores the list.
- FavoritesPersistence.test.jsx: Verifies favorites persist to and hydrate from localStorage.
- ModalAccessibility.test.jsx: Validates dialog focus, Escape/overlay close, and focus trap.

All tests run under Jest with @testing-library/dom/react/user-event and jsdom.
