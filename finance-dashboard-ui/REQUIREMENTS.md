# Finance Dashboard UI - Requirements & Dependencies Document

## Project Overview
This is a **React-based finance dashboard UI** built with **Vite** as the build tool, **TailwindCSS** for styling, and **Recharts** for data visualizations. The dashboard includes role-switching (admin/analyst), theme toggling (light/dark), and pages for Dashboard, Insights, and Transactions. It features candy-themed colors suitable for engaging financial visualizations.

**Current Working Directory**: `e:/Zoryn/finance-dashboard-ui/finance-dashboard-ui/`
**Tech Stack**: React 18, Vite 5, TailwindCSS 3.4, PostCSS 8, Recharts 2.8

## 1. Node.js & npm Dependencies
### Production Dependencies (`dependencies`)
| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.2.0 | Core React library for UI components |
| `react-dom` | ^18.2.0 | React DOM renderer for browser |
| `recharts` | ^2.8.0 | Charting library for financial data visualizations (e.g., Dashboard, Insights pages) |

### Development Dependencies (`devDependencies`)
| Package | Version | Purpose |
|---------|---------|---------|
| `@types/react` | ^18.2.43 | TypeScript definitions for React |
| `@types/react-dom` | ^18.2.17 | TypeScript definitions for React DOM |
| `@vitejs/plugin-react` | ^4.2.1 | Vite plugin for fast React Refresh/ HMR |
| `autoprefixer` | ^10.4.16 | CSS vendor prefixing (used in PostCSS) |
| `eslint` | ^8.55.0 | JavaScript linter |
| `eslint-plugin-react` | ^7.33.2 | ESLint rules for React |
| `eslint-plugin-react-hooks` | ^4.6.0 | ESLint rules for React Hooks |
| `eslint-plugin-react-refresh` | ^0.4.5 | ESLint rules for Vite React Refresh |
| `postcss` | ^8.4.16 | PostCSS processor for TailwindCSS |
| `tailwindcss` | ^3.4.0 | Utility-first CSS framework |
| `vite` | ^5.0.8 | Fast build tool & dev server |

### Lockfile
- `package-lock.json`: Ensures reproducible installs (npm lockfile)

## 2. Build & Configuration Files
| File | Purpose | Key Dependencies |
|------|---------|------------------|
| `vite.config.js` | Vite configuration | `@vitejs/plugin-react` |
| `tailwind.config.js` | TailwindCSS theme config (custom candy colors, Inter font, dark mode) | `tailwindcss` |
| `postcss.config.js` | PostCSS pipeline | `tailwindcss`, `autoprefixer` |
| `index.css` | Global styles (likely imports Tailwind directives `@tailwind base; @tailwind components; @tailwind utilities;`) | `tailwindcss` |
| `src/main.jsx` | App entry point | `react`, `react-dom` |

## 3. System & Runtime Requirements
- **Node.js**: v18+ (recommended for Vite 5)
- **npm**: v9+ (or yarn/pnpm)
- **Browser**: Modern (Chrome 90+, Firefox 90+, Safari 15+ for full Tailwind support)
- **Fonts**: 
  - Inter (sans-serif fallback: `['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif']`)
  - Load via Google Fonts CDN in `index.html` or CSS `@import`

## 4. Development Scripts (from package.json)
```bash
npm install          # Install all dependencies
npm run dev          # Start dev server (vite)
npm run build        # Production build (vite build)
npm run lint         # Lint code (eslint)
npm run preview      # Preview production build (vite preview)
```

## 5. Installation Steps
1. `cd finance-dashboard-ui`
2. `npm install`
3. `npm run dev` (runs at http://localhost:5173)

## 6. Additional Runtime Dependencies (Inferred)
- **No external APIs** visible in file structure (uses local `src/utilities/transactions.js`, `categories.js`)
- **React Context**: Custom `FinanceContext.jsx` for state management
- **Local Storage** likely used for data persistence

## 7. Potential Peer Dependencies/Optional
- **TypeScript**: Supported via `@types/*` (add `typescript` if needed)
- **VS Code Extensions** (recommended): ESLint, Tailwind CSS IntelliSense, Vite

**Generated: BLACKBOXAI Analysis** | **Date: Current** | **Version: Based on package.json v0.0.0**

