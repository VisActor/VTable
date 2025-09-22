# Data Persistence

VTable-Sheet provides state persistence capabilities, allowing users to save and restore various table states, including filter conditions, selection areas, active sheets, and more. This chapter explains how to implement table state persistence.

## Basic Concepts

Data persistence refers to saving the current state of a table (including data and user operations) so that it can be restored to the same state in subsequent use. This is particularly useful when you need to retain user operation history or implement auto-save functionality.

## Saving Table State

VTableSheet provides a `saveToConfig` method that can export the current table state as a configuration object (using localStorage as an example):

```typescript
// Get the complete configuration of the current table (including all states)
const currentConfig = sheetInstance.saveToConfig();

// Convert the configuration object to a JSON string
const configJson = JSON.stringify(currentConfig);

// Save to localStorage or a backend API
localStorage.setItem('vtable-sheet-state', configJson);
```

## Restoring Table State

You can recreate the table using the saved configuration to restore the previous state (using localStorage as an example):

```javascript
// Get the saved configuration from localStorage or from a backend API
const savedConfigJson = localStorage.getItem('vtable-sheet-state');

if (savedConfigJson) {
  try {
    // Parse the JSON string into a configuration object
    const savedConfig = JSON.parse(savedConfigJson);
    
    // Create a new table instance using the saved configuration
    const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), savedConfig);
  } catch (error) {
    console.error('Failed to restore table state:', error);
    // Use default configuration
    const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), defaultConfig);
  }
} else {
  // No saved state, use default configuration
  const sheetInstance = new VTableSheet.VTableSheet(document.getElementById(CONTAINER_ID), defaultConfig);
}
```

## Saved State Content

The `saveToConfig` method can save the following states:

- Data for each worksheet
- Filter conditions
- Currently active worksheet
- Formula settings
- Merged cell states
- Frozen rows and columns

States to be implemented in future development:

- Cell selection state
- Table structure configuration (row heights, column widths, etc.)

## Usage Example: Simple Persistence Functionality

Here is a simple example of table state persistence:

```javascript livedemo template=vtable
// Create persistence helper functions
const SheetPersistence = {
  // Save table state
  saveState: (sheetInstance, key = 'vtable-sheet-state') => {
    try {
      const config = sheetInstance.saveToConfig();
      localStorage.setItem(key, JSON.stringify(config));
      return true;
    } catch (error) {
      console.error('Failed to save table state:', error);
      return false;
    }
  },
  
  // Load table state
  loadState: (container, key = 'vtable-sheet-state', defaultConfig = null) => {
    try {
      const savedJson = localStorage.getItem(key);
      
      if (savedJson) {
        const config = JSON.parse(savedJson);
        return new VTableSheet.VTableSheet(container, config);  
      } else if (defaultConfig) {
        return new VTableSheet.VTableSheet(container, defaultConfig);
      }
    } catch (error) {
      console.error('Failed to load table state:', error);
      if (defaultConfig) {
        return new VTableSheet.VTableSheet(container, defaultConfig);
      }
    }
    return null;
  },
  
  // Clear saved state
  clearState: (key = 'vtable-sheet-state') => {
    localStorage.removeItem(key);
  }
};

// Usage example
const defaultConfig = {
  sheets: [
    {
      sheetKey: 'sheet1',
      sheetTitle: 'Sheet 1',
      data: [
        ['Name', 'Age', 'Department'],
        ['John', 28, 'Engineering'],
        ['Lisa', 32, 'Marketing']
      ],
      active: true
    }
  ]
};

const container = document.getElementById(CONTAINER_ID);
// Try to load the saved state, if none exists use the default configuration
const sheetInstance = SheetPersistence.loadState(container, 'my-sheet', defaultConfig);
window.sheetInstance = sheetInstance;

  // Create simple control buttons
  const createControls = () => {
    // Clean up existing control panel to avoid duplication
    const existingControls = document.getElementById('simple-controls');
    if (existingControls) {
      existingControls.remove();
      console.log('Cleaned up existing control panel');
    }

    const controlsHtml = `
      <div id="simple-controls" style="
        position: absolute;
        top: 20px;
        right: 20px;
        background: white;
        padding: 16px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        font-family: Arial, sans-serif;
        z-index: 1000;
        min-width: 200px;
      ">
        <h4 style="margin: 0 0 12px 0; color: #333;">Control Panel</h4>

        <button id="save-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #007bff;
          background: #007bff;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">Manual Save</button>

        <button id="reload-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #28a745;
          background: #28a745;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">Reload</button>

        <button id="clear-btn" style="
          width: 100%;
          margin: 4px 0;
          padding: 8px 12px;
          border: 1px solid #dc3545;
          background: #dc3545;
          color: white;
          border-radius: 4px;
          cursor: pointer;
        ">Clear Data</button>

        <div id="status" style="
          margin-top: 12px;
          padding: 8px;
          background: #f8f9fa;
          border-radius: 4px;
          font-size: 12px;
          color: #666;
        ">Status: Loaded</div>

        <div style="
          margin-top: 12px;
          padding: 8px;
          background: #e7f3ff;
          border-radius: 4px;
          font-size: 11px;
          color: #0066cc;
        ">
          Right-click to set merge, then click manual save, then reload to verify the effect
        </div>
      </div>
    `;

   container.insertAdjacentHTML('beforeend', controlsHtml);

    // Bind events
    document.getElementById('save-btn')?.addEventListener('click', () => {
      if (SheetPersistence.saveState(sheetInstance, 'my-sheet')) {
        alert('Table state has been saved');
      } else {
        alert('Save failed');
      }
    });


    document.getElementById('reload-btn')?.addEventListener('click', () => {
      // window.location.reload();
      debugger;
       window.sheetInstance?.release?.();
      const sheetInstance = SheetPersistence.loadState(container, 'my-sheet', defaultConfig);
      window.sheetInstance = sheetInstance;
    });
    document.getElementById('clear-btn')?.addEventListener('click', () => {
     SheetPersistence.clearState('my-sheet');
      alert('Cleared the saved table state in cache, click reload to restore default state');
    });
  };

  // Create control panel
  createControls();


```