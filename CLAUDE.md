# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VTable is a high-performance multidimensional data analysis table component built on the VRender canvas engine. This is a Rush monorepo containing the core VTable library and related packages.

## Essential Commands

### Development Setup
```bash
# Install dependencies (required first time and after package.json changes)
rush update

# Build all packages
rush build

# Start development server for core vtable package
cd packages/vtable && rushx demo

# Start documentation site
rush docs

# Run tests
rush test

# Run linting
rush eslint

# Fix dependency issues
rush purge && rush update
```

### Working with Individual Packages
```bash
# Build specific package
cd packages/[package-name] && rushx build

# Run tests for specific package
cd packages/[package-name] && rushx test

# Start demo for specific package
cd packages/[package-name] && rushx demo
```

### Git Workflow
```bash
# After making changes, update changelogs before committing
rush change-all

# Commit with conventional message format
git commit -m "type: description"
```

## Architecture Overview

### Package Structure
- **packages/vtable**: Core VTable library with ListTable, PivotTable, and PivotChart components
- **packages/vtable-gantt**: Gantt chart component
- **packages/vtable-editors**: Table editor components
- **packages/vtable-plugins**: Plugin system for extending functionality
- **packages/vtable-export**: Export functionality (Excel, CSV, etc.)
- **packages/vtable-search**: Search capabilities
- **packages/vtable-calendar**: Calendar component
- **packages/vtable-sheet**: Spreadsheet functionality (current development branch)
- **packages/react-vtable**: React wrapper
- **packages/vue-vtable**: Vue wrapper
- **packages/openinula-vtable**: OpenInula wrapper

### Core Architecture
The library is built on a canvas-based rendering system using VRender:

1. **Table Types**:
   - `ListTable`: Basic table with columns and rows
   - `PivotTable`: Multi-dimensional data analysis
   - `PivotChart`: Chart integration with tables

2. **Rendering Pipeline**:
   - Scenegraph-based rendering in `src/scenegraph/`
   - Canvas-based graphics using VRender engine
   - Custom layout system in `src/render/layout/`

3. **Data Management**:
   - Data source abstraction in `src/data/`
   - Statistics and aggregation in `src/dataset/`
   - Event system for data updates

4. **Extension Points**:
   - Plugin system for custom functionality
   - Theme system for styling
   - Custom cell renderers and editors

### Testing Strategy
- **Framework**: Jest with ts-jest preset
- **Environment**: jest-electron for DOM/canvas testing
- **Coverage Requirements**: 60% minimum for all metrics
- **Test Location**: `__tests__/` directories within each package

### Key Dependencies
- **@visactor/vrender-***: Canvas rendering engine (v1.0.14)
- **@visactor/vutils**: Utility functions (~0.19.1)
- **lodash**: Utility library (4.17.21)

### Development Notes
- This is a Rush monorepo - always use `rush` commands instead of npm/yarn directly
- Current branch: `feat/vtable-sheet` (spreadsheet functionality)
- Main branches: `main`, `develop`
- Node.js versions supported: 14.15.0+, 16.13.0+, 18.15.0+
- to memorize