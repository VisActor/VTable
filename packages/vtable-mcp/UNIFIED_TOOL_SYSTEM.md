# VTable MCP Unified Tool System

## Overview

The VTable MCP (Model Context Protocol) unified tool system provides a centralized, consistent way to define and manage MCP tools across all VTable packages. This eliminates duplication and ensures consistency between CLI packages, server packages, and external MCP configurations.

## Architecture

### Core Components

1. **McpToolRegistry** (`packages/vtable-mcp/src/mcp-tool-registry.ts`)
   - Centralized registry for all MCP tool definitions
   - Handles tool name mappings between client and server
   - Manages parameter transformations
   - Provides JSON schema generation for external configurations

2. **MCP Configuration Export** (`packages/vtable-mcp/src/mcp-config.ts`)
   - Provides ready-to-use MCP tool definitions for `mcp.json`
   - Exports configuration helpers for external tools

3. **Refactored Packages**
   - **CLI Package** (`packages/vtable-mcp-cli/`): Uses unified registry instead of hardcoded mappings
   - **Server Package** (`packages/vtable-mcp-server/`): Uses unified registry for tool definitions and transformations

## Benefits

### 1. **Eliminates Code Duplication**
- No more hardcoded tool mappings in multiple files
- Single source of truth for all MCP tool definitions
- Consistent parameter transformations across packages

### 2. **Simplified Maintenance**
- Add new tools in one place: `McpToolRegistry`
- Automatic propagation to all packages
- Centralized tool categorization and metadata

### 3. **External Configuration Support**
- Ready-to-use tool definitions for `mcp.json`
- JSON schema generation for MCP clients
- Clear documentation and examples

### 4. **Type Safety**
- Full TypeScript support
- Zod schema validation
- Compile-time error checking

## Usage Examples

### For Package Developers

```typescript
// Register a new tool
import { mcpToolRegistry } from '@visactor/vtable-mcp';

mcpToolRegistry.registerTool({
  name: 'my_new_tool',
  description: 'Description of my new tool',
  inputSchema: z.object({
    param1: z.string(),
    param2: z.number().optional(),
  }),
  category: 'data',
  serverName: 'server_side_tool_name',
  exportable: true,
});
```

### For CLI Package

```typescript
// Before: Hardcoded mappings and transformations
// After: Automatic from unified registry
import { mcpToolRegistry, MCP_TOOL_MAPPINGS } from '@visactor/vtable-mcp';

const tools = mcpToolRegistry.getExportableTools().map(tool => ({
  name: MCP_TOOL_MAPPINGS.getServerToolName(tool.name),
  description: tool.description,
  inputSchema: mcpToolRegistry.getJsonSchemaTools().find(t => t.name === tool.name)?.inputSchema,
}));
```

### For Server Package

```typescript
// Before: Manual tool definitions and parameter mapping
// After: Unified registry integration
import { mcpToolRegistry, MCP_TOOL_MAPPINGS } from '@visactor/vtable-mcp';

// Tool definitions from registry
const tools = mcpToolRegistry.getExportableTools().map(tool => ({...}));

// Automatic parameter transformation
const serverParams = MCP_TOOL_MAPPINGS.transformParameters(clientName, clientParams);
```

### For End Users (mcp.json)

```json
{
  "mcpServers": {
    "vtable": {
      "command": "node",
      "args": ["./node_modules/@visactor/vtable-mcp-cli/bin/vtable-mcp.js"],
      "env": {
        "VTABLE_API_URL": "http://localhost:3000/mcp",
        "VTABLE_SESSION_ID": "default"
      }
    }
  }
}
```

## Tool Categories

- **cell**: Cell operations (get/set values)
- **style**: Style operations (get/set cell styles)
- **table**: Table-level operations (info, configuration)
- **data**: Data operations (import, export, manipulation)

## Migration Guide

### From Hardcoded Mappings

1. **Remove hardcoded tool definitions** from CLI and server packages
2. **Use `mcpToolRegistry.getExportableTools()`** for tool lists
3. **Use `MCP_TOOL_MAPPINGS.getServerToolName()`** for name mapping
4. **Use `MCP_TOOL_MAPPINGS.transformParameters()`** for parameter transformation

### Adding New Tools

1. **Add tool definition** to `McpToolRegistry.initializeDefaultTools()`
2. **Add parameter transformation** if needed
3. **Mark as exportable** if it should be available in mcp.json
4. **Test** in both CLI and server packages

## File Structure

```
vtable-mcp/
├── src/
│   ├── mcp-tool-registry.ts      # Core unified registry
│   ├── mcp-config.ts             # External configuration exports
│   └── index.ts                  # Main exports
├── mcp.json.example              # Example configuration
└── README.md                     # This file
```

## Future Enhancements

- [ ] Plugin system for dynamic tool registration
- [ ] Tool versioning and compatibility checking
- [ ] Advanced parameter validation and transformation
- [ ] Tool usage analytics and monitoring
- [ ] Custom tool definition loading from external files