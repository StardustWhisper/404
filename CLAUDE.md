# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React + Vite application that displays a creative "404 - Page Not Found" page with dynamic content. The page fetches and displays:
- Random images from Unsplash API
- Current weather information
- Latest news headlines
- Daily inspirational quotes

## Build & Development Commands

### Development
```bash
npm run dev  # Start development server with hot reload
```

### Production Build
```bash
npm run build  # Build for production
npm run preview  # Preview production build locally
```

### Code Quality
```bash
npm run lint  # Run ESLint on all files
```

## Architecture

### Tech Stack
- **Frontend**: React 19 with JSX
- **Build Tool**: Vite with React plugin
- **UI Components**: Ant Design (antd)
- **HTTP Client**: Axios for API calls
- **Date Handling**: Day.js
- **Styling**: CSS with Ant Design integration

### Project Structure
```
src/
├── App.jsx      # Main application component
├── App.css      # Application styles with responsive design
├── main.jsx     # React entry point
└── index.css    # Global CSS variables and base styles
```

### Key Components

#### App.jsx (Main Component)
- **Purpose**: Primary component managing all dynamic data fetching and UI rendering
- **State Management**: Uses React hooks for loading state and data storage
- **API Integration**: Fetches data from multiple external APIs simultaneously
- **Layout**: Uses Ant Design Grid system (Row/Col) for responsive layout

#### External API Dependencies
The application requires API keys for the following services (currently placeholders in code):
- **Unsplash API**: Random images (`YOUR_UNSPLASH_API_KEY`)
- **WeatherAPI**: Current weather (`YOUR_WEATHER_API_KEY`)
- **NewsAPI**: Top headlines (`YOUR_NEWS_API_KEY`)

### Data Flow
1. Component mounts → Trigger useEffect
2. Fetch data from 4 different APIs in parallel
3. Update state with API responses
4. Render content using Ant Design cards and typography
5. Handle loading states and error cases

### Styling Approach
- **Responsive Design**: Mobile-first approach with Ant Design grid system
- **CSS Variables**: Defined in :root for consistent theming
- **Dark/Light Mode**: Automatic system preference detection
- **Hover Effects**: Interactive elements with smooth transitions
- **Card Layout**: Each data section displayed in separate cards

### Code Standards
- **ESLint Configuration**: Custom rules for React, hooks, and refresh
- **Linting**: Comprehensive static analysis with no-unused-vars rule
- **Naming Convention**: PascalCase for components, camelCase for functions/variables
- **TypeScript**: Not currently implemented but can be added via @types packages