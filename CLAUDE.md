# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VTable is a high-performance multidimensional data analysis table component built on the VRender visual rendering engine. It's a monorepo managed by Rush that provides core table functionality along with React, Vue, and OpenInula framework integrations.

## Development Commands

### Setup and Dependencies
```bash
# Install Rush globally (required)
npm i --global @microsoft/rush

# Install all dependencies
rush update

# If you encounter dependency issues
rush purge
rush update
```

### Development
```bash
# Start VTable demo server (run from packages/vtable)
cd packages/vtable
rushx demo

# Start documentation development server (run from root)
rush docs

# Build all packages
rush build

# Run tests
rush test

# Run linting
rush eslint

# Type checking (run from specific package)
cd packages/vtable
rushx compile
```

### Git Workflow
```bash
# After making commits, update changelogs (run from root)
rush change-all

# Commit message format (Conventional Commits)
# <type>[optional scope]: <description>
# Types: docs, feat, fix, refactor, etc.
git commit -a -m "feat: add new pivot chart feature"
```

## High-Level Architecture

### Package Structure
```
packages/
├── vtable/           # Core table engine (BaseTable, ListTable, PivotTable, PivotChart)
├── vtable-gantt/     # Gantt chart component
├── vtable-editors/   # Cell editors (Input, Date, List, TextArea)
├── vtable-export/    # Export functionality (CSV, Excel)
├── vtable-search/    # Search capabilities
├── vtable-plugins/   # Plugin system
├── vtable-calendar/  # Calendar component
├── react-vtable/     # React wrapper
├── vue-vtable/       # Vue wrapper
└── openinula-vtable/ # OpenInula wrapper
```

### Core Architecture Layers
1. **Framework Layer** (React/Vue/OpenInula wrappers)
2. **API Layer** (ListTable, PivotTable, PivotChart classes)
3. **Core Engine Layer** (BaseTable abstract base class)
4. **Component/Service Layer** (Scenegraph, StateManager, EventManager, Layout Engine)
5. **Data Layer** (DataSource, Dataset, Data Statistics)
6. **Render Layer** (VRender Integration - Canvas/SVG/WebGL)

### Key Components

**BaseTable** (`/packages/vtable/src/core/BaseTable.ts`)
- Abstract foundation for all table types
- Manages canvas, events, themes, data sources, plugins
- ~169KB core logic

**Scenegraph** (`/packages/vtable/src/scenegraph/scenegraph.ts`)
- Manages visual scene tree and rendering
- Key groups: tableGroup, colHeaderGroup, rowHeaderGroup, bodyGroup, frozen groups

**StateManager** (`/packages/vtable/src/state/state.ts`)
- Manages cell selection, hover, sort, interaction states

**EventManager** (`/packages/vtable/src/event/event.ts`)
- Handles mouse, keyboard, touch events

### VRender Integration
VTable is built on VRender visual rendering engine:
- VRender registration: `/packages/vtable/src/vrender.ts`
- Uses Stage, Group, Rect, Text, Icon, Chart components
- Rendering pipeline: Data → Layout → Scenegraph → VRender

### Data Architecture
```
Raw Data → DataSource → Layout Engine → Scenegraph → VRender
```

Key data components:
- **DataSource**: Handles sort, filter, pagination
- **Dataset**: Pivot table data analysis
- **Layout Maps**: Convert data to visual layout (SimpleHeaderLayoutMap, PivotHeaderLayoutMap)

### Entry Points
- Main export: `/packages/vtable/src/index.ts`
- ListTable: `/packages/vtable/src/ListTable.ts`
- PivotTable: `/packages/vtable/src/PivotTable.ts`
- PivotChart: `/packages/vtable/src/PivotChart.ts`

## Key Development Patterns

### Branch Strategy
- Base branch: `develop`
- Feature branches: `feat/feature-name`
- Bug fix branches: `fix/bug-name`
- Documentation branches: `docs/doc-name`

### Testing
- Jest for unit tests
- Test files alongside source files
- Run specific package tests from package directory

### Code Style
- TypeScript with strict configuration
- ESLint for code quality
- Prettier for formatting
- Conventional Commits for commit messages

### Performance Considerations
- Designed for millions of data points with virtual scrolling
- Canvas-based rendering for performance
- Efficient data structures and algorithms

## Common Tasks

### Adding a New Feature
1. Create feature branch from `develop`
2. Implement in appropriate package (usually `packages/vtable`)
3. Add tests and examples
4. Update documentation if needed
5. Run `rush change-all` to update changelogs

### Running Examples
```bash
cd packages/vtable
rushx demo
# Navigate to http://localhost:3000 to view examples
```

### Debugging
- Use browser DevTools with demo examples
- Check console for VRender and VTable logs
- Use TypeScript source maps for debugging

## Important Notes

- Always use Rush for dependency management and builds
- The project uses VRender as the rendering engine - understand VRender for advanced features
- Performance is critical - test with large datasets
- Follow existing code patterns and conventions
- Update changelogs with `rush change-all` after commits