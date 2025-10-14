---
category: examples
group: gantt
title: Gantt Chart Smart Zoom Feature
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/gantt-zoom.gif
link: gantt/zoom-scale
option: Gantt#zoomScale
---

# Gantt Chart Smart Zoom Feature

The Gantt chart smart zoom feature provides multi-level timeline display schemes that can automatically switch between different time scale combinations based on zoom levels, allowing users to get the optimal viewing experience at different time granularities. This feature supports trackpad zooming, mouse wheel zooming, and API zooming.

## Key Configuration

- `timelineHeader.zoomScale.enabled`: Enable smart zoom functionality
- `timelineHeader.zoomScale.levels`: Configure multi-level time scale combinations
- Mouse wheel zooming: Hold `Ctrl` key and scroll mouse wheel to zoom
- API get current zoom state: Use methods provided by `getCurrentZoomState`
- API set current zoom state: Use methods provided by `setZoomPosition`
- API zooming: Use zoom methods provided by `zoomScaleManager`

## Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

// Force cleanup of all possible existing zoom control panels
// First try to call any previously existing global cleanup function
if (typeof window.cleanupControls === 'function') {
  window.cleanupControls();
}

const existingControls = document.getElementById('zoom-controls');
if (existingControls) {
  existingControls.remove();
}

// Additional cleanup: find all possible zoom control panels
const allZoomControls = document.querySelectorAll('[id*="zoom-control"], .zoom-controls, [class*="zoom-control"]');
allZoomControls.forEach(element => {
  if (element && element.parentNode) {
    element.parentNode.removeChild(element);
  }
});

// Clean up possible floating elements remaining in body
const floatingElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
floatingElements.forEach(element => {
  // Check if it contains zoom-related text content
  if (
    element.textContent &&
    (element.textContent.includes('Zoom') ||
      element.textContent.includes('zoom') ||
      element.textContent.includes('In') ||
      element.textContent.includes('Out'))
  ) {
    element.remove();
  }
});

const records = [
  {
    id: 8,
    title: 'User Research',
    start: '2024-06-15',
    end: '2024-07-10',
    progress: 100
  },
  {
    id: 9,
    title: 'Competitive Analysis',
    start: '2024-06-20',
    end: '2024-07-15',
    progress: 100
  },
  {
    id: 10,
    title: 'Technical Research',
    start: '2024-06-25',
    end: '2024-07-20',
    progress: 90
  },
  {
    id: 11,
    title: 'Risk Assessment',
    start: '2024-07-10',
    end: '2024-07-25',
    progress: 85
  },
  {
    id: 1,
    title: 'Project Initiation',
    start: '2024-07-01',
    end: '2024-07-05',
    progress: 100,
    children: [
      {
        id: 11,
        title: 'Project Kickoff Meeting',
        start: '2024-07-01',
        type: 'milestone',
        progress: 100
      },
      {
        id: 12,
        title: 'Requirements Gathering',
        start: '2024-07-02',
        end: '2024-07-04',
        progress: 100
      },
      {
        id: 13,
        title: 'Project Planning',
        start: '2024-07-03',
        end: '2024-07-05',
        progress: 100
      }
    ]
  },
  {
    id: 2,
    title: 'Design Phase',
    start: '2024-07-08',
    end: '2024-08-02',
    progress: 85,
    children: [
      {
        id: 21,
        title: 'Prototype Design',
        start: '2024-07-08',
        end: '2024-07-18',
        progress: 100
      },
      {
        id: 22,
        title: 'UI/UX Design',
        start: '2024-07-15',
        end: '2024-07-28',
        progress: 90
      },
      {
        id: 23,
        title: 'Technical Architecture Design',
        start: '2024-07-22',
        end: '2024-08-02',
        progress: 75
      },
      {
        id: 24,
        title: 'Design Review',
        start: '2024-08-02',
        type: 'milestone',
        progress: 100
      }
    ]
  },
  {
    id: 3,
    title: 'Development Phase',
    start: '2024-08-05',
    end: '2024-09-20',
    progress: 45,
    children: [
      {
        id: 31,
        title: 'Frontend Development',
        start: '2024-08-05',
        end: '2024-09-10',
        progress: 60,
        children: [
          {
            id: 311,
            title: 'Framework Setup',
            start: '2024-08-05',
            end: '2024-08-12',
            progress: 100
          },
          {
            id: 312,
            title: 'Component Development',
            start: '2024-08-13',
            end: '2024-08-28',
            progress: 80
          },
          {
            id: 313,
            title: 'Page Integration',
            start: '2024-08-29',
            end: '2024-09-10',
            progress: 30
          }
        ]
      },
      {
        id: 32,
        title: 'Backend Development',
        start: '2024-08-05',
        end: '2024-09-15',
        progress: 55,
        children: [
          {
            id: 321,
            title: 'Database Design',
            start: '2024-08-05',
            end: '2024-08-10',
            progress: 100
          },
          {
            id: 322,
            title: 'API Development',
            start: '2024-08-11',
            end: '2024-09-05',
            progress: 70
          },
          {
            id: 323,
            title: 'Business Logic Implementation',
            start: '2024-08-20',
            end: '2024-09-15',
            progress: 40
          }
        ]
      },
      {
        id: 33,
        title: 'Mobile Development',
        start: '2024-08-12',
        end: '2024-09-20',
        progress: 25,
        children: [
          {
            id: 331,
            title: 'Android Development',
            start: '2024-08-12',
            end: '2024-09-18',
            progress: 30
          },
          {
            id: 332,
            title: 'iOS Development',
            start: '2024-08-15',
            end: '2024-09-20',
            progress: 20
          }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Testing Phase',
    start: '2024-09-16',
    end: '2024-10-10',
    progress: 15,
    children: [
      {
        id: 41,
        title: 'Unit Testing',
        start: '2024-09-16',
        end: '2024-09-25',
        progress: 40
      },
      {
        id: 42,
        title: 'Integration Testing',
        start: '2024-09-23',
        end: '2024-10-02',
        progress: 20
      },
      {
        id: 43,
        title: 'User Acceptance Testing',
        start: '2024-09-30',
        end: '2024-10-08',
        progress: 0
      },
      {
        id: 44,
        title: 'Performance Testing',
        start: '2024-10-01',
        end: '2024-10-05',
        progress: 0
      },
      {
        id: 45,
        title: 'Security Testing',
        start: '2024-10-03',
        end: '2024-10-07',
        progress: 0
      },
      {
        id: 46,
        title: 'Testing Complete',
        start: '2024-10-10',
        type: 'milestone',
        progress: 0
      }
    ]
  },
  {
    id: 5,
    title: 'Deployment & Launch',
    start: '2024-10-11',
    end: '2024-10-25',
    progress: 0,
    children: [
      {
        id: 51,
        title: 'Staging Environment Deployment',
        start: '2024-10-11',
        end: '2024-10-15',
        progress: 0
      },
      {
        id: 52,
        title: 'Production Environment Preparation',
        start: '2024-10-14',
        end: '2024-10-18',
        progress: 0
      },
      {
        id: 53,
        title: 'Data Migration',
        start: '2024-10-16',
        end: '2024-10-20',
        progress: 0
      },
      {
        id: 54,
        title: 'Production Launch',
        start: '2024-10-21',
        end: '2024-10-22',
        progress: 0
      },
      {
        id: 55,
        title: 'Launch Monitoring',
        start: '2024-10-22',
        end: '2024-10-25',
        progress: 0
      },
      {
        id: 56,
        title: 'Project Delivery',
        start: '2024-10-25',
        type: 'milestone',
        progress: 0
      }
    ]
  },
  {
    id: 6,
    title: 'Maintenance & Support',
    start: '2024-10-26',
    end: '2024-11-25',
    progress: 0,
    children: [
      {
        id: 61,
        title: 'System Maintenance',
        start: '2024-10-26',
        end: '2024-11-15',
        progress: 0
      },
      {
        id: 62,
        title: 'User Training',
        start: '2024-10-28',
        end: '2024-11-05',
        progress: 0
      },
      {
        id: 63,
        title: 'Documentation Organization',
        start: '2024-11-01',
        end: '2024-11-10',
        progress: 0
      },
      {
        id: 64,
        title: 'Project Retrospective',
        start: '2024-11-20',
        end: '2024-11-25',
        progress: 0
      }
    ]
  },
  {
    id: 7,
    title: 'Marketing Campaign',
    start: '2024-09-01',
    end: '2024-11-30',
    progress: 35
  },
  {
    id: 8,
    title: 'User Research',
    start: '2024-06-15',
    end: '2024-07-10',
    progress: 100
  },
  {
    id: 9,
    title: 'Competitive Analysis',
    start: '2024-06-20',
    end: '2024-07-15',
    progress: 100
  },
  {
    id: 10,
    title: 'Technical Research',
    start: '2024-06-25',
    end: '2024-07-20',
    progress: 90
  },
  {
    id: 11,
    title: 'Risk Assessment',
    start: '2024-07-10',
    end: '2024-07-25',
    progress: 85
  },
  {
    id: 12,
    title: 'Resource Planning',
    start: '2024-07-05',
    end: '2024-07-30',
    progress: 95
  },
  {
    id: 13,
    title: 'Team Training',
    start: '2024-08-01',
    end: '2024-08-15',
    progress: 70
  },
  {
    id: 14,
    title: 'Development Environment Setup',
    start: '2024-07-28',
    end: '2024-08-05',
    progress: 100
  },
  {
    id: 15,
    title: 'Code Standards Definition',
    start: '2024-08-03',
    end: '2024-08-08',
    progress: 100
  },
  {
    id: 16,
    title: 'Third-party Service Integration',
    start: '2024-08-20',
    end: '2024-09-10',
    progress: 60
  },
  {
    id: 17,
    title: 'Data Backup Strategy',
    start: '2024-09-05',
    end: '2024-09-20',
    progress: 40
  },
  {
    id: 18,
    title: 'Monitoring System Deployment',
    start: '2024-09-25',
    end: '2024-10-15',
    progress: 20
  },
  {
    id: 19,
    title: 'Customer Feedback Collection',
    start: '2024-10-20',
    end: '2024-11-10',
    progress: 0
  },
  {
    id: 20,
    title: 'Version Iteration Planning',
    start: '2024-11-01',
    end: '2024-11-30',
    progress: 0
  }
];

const columns = [
  {
    field: 'title',
    title: 'Task Name',
    width: 250,
    tree: true
  },
  {
    field: 'start',
    title: 'Start Date',
    width: 120
  },
  {
    field: 'end',
    title: 'End Date',
    width: 120
  },
  {
    field: 'progress',
    title: 'Progress (%)',
    width: 100
  }
];

const option = {
  records,
  taskListTable: {
    columns,
    tableWidth: 200,
    minTableWidth: 200,
    maxTableWidth: 600
  },
  // Timeline configuration
  timelineHeader: {
    colWidth: 60,
    backgroundColor: '#f8f9fa',
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#e9ecef'
    },
    verticalLine: {
      lineWidth: 1,
      lineColor: '#e9ecef'
    },
    // Smart zoom configuration
    zoomScale: {
      enabled: true,
      levels: [
        // Level 0: Month-Week combination (coarsest)
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          }
        ],
        // Level 1: Month-Day combination
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 4,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // Level 2: Month-Week-Day combination
        [
          {
            unit: 'month',
            step: 1,
            format: date => {
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${monthNames[date.startDate.getMonth()]} ${date.startDate.getFullYear()}`;
            }
          },
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => date.startDate.getDate().toString()
          }
        ],
        // Level 3: Week-Day-Hour combination (12 hours)
        [
          {
            unit: 'week',
            step: 1,
            format: date => {
              const weekNum = Math.ceil(
                (date.startDate.getDate() +
                  new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) /
                  7
              );
              return `Week ${weekNum}`;
            }
          },
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 12,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // Subtract 1 hour from end time, then show 59 minutes
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // Level 4: Day-Hour combination (6 hours)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 6,
            format: date => {
              const startHour = date.startDate.getHours();
              const endHour = date.endDate.getHours() - 1; // Subtract 1 hour from end time, then show 59 minutes
              return `${startHour.toString().padStart(2, '0')}:00~${(endHour + 1).toString().padStart(2, '0')}:59`;
            }
          }
        ],
        // Level 5: Day-Hour combination (1 hour)
        [
          {
            unit: 'day',
            step: 1,
            format: date => {
              const day = date.startDate.getDate();
              const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              return `${day} ${monthNames[date.startDate.getMonth()]}`;
            }
          },
          {
            unit: 'hour',
            step: 1,
            format: date => {
              const hour = date.startDate.getHours();
              return `${hour.toString().padStart(2, '0')}:00`;
            }
          }
        ]
      ]
    }
  },
  taskBar: {
    startDateField: 'start',
    endDateField: 'end',
    progressField: 'progress',
    labelText: '{title}',
    labelTextStyle: {
      fontSize: 14,
      textAlign: 'left'
    },
    barStyle: {
      width: 24,
      barColor: '#4CAF50',
      completedBarColor: '#81C784',
      cornerRadius: 4
    }
  },
  frame: {
    outerFrameStyle: {
      borderLineWidth: 1,
      borderColor: '#dee2e6',
      cornerRadius: 4
    },
    verticalSplitLineMoveable: true,
    verticalSplitLine: {
      lineColor: '#dee2e6',
      lineWidth: 2
    }
  },
  grid: {
    verticalLine: {
      lineWidth: 1,
      lineColor: '#f1f3f4'
    },
    horizontalLine: {
      lineWidth: 1,
      lineColor: '#f1f3f4'
    }
  },
  headerRowHeight: 50,
  rowHeight: 40,
  overscrollBehavior: 'none'
};

ganttInstance = new VTableGantt.Gantt(document.getElementById(CONTAINER_ID), option);
window['ganttInstance'] = ganttInstance;

/**
 * Create zoom control buttons
 */
function createZoomControls(ganttInstance) {
  // Create button container
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'zoom-controls';
  controlsContainer.style.cssText = `
    position: fixed;
    bottom: 0px;
    left: 130px;
    display: flex;
    gap: 8px;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.95);
    padding: 12px;
    border-radius: 6px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    font-family: Arial, sans-serif;
    min-width: 140px;
    max-height: 80vh;
    overflow-y: auto;
  `;

  // Create title
  const title = document.createElement('div');
  title.textContent = 'Zoom Controls';
  title.style.cssText = `
    font-weight: bold;
    font-size: 13px;
    margin-bottom: 8px;
    color: #333;
    text-align: center;
  `;
  controlsContainer.appendChild(title);

  // Create button container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 6px;
    margin-bottom: 8px;
  `;

  // Zoom in 10% button
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = 'Zoom In 10%';
  zoomInBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomInBtn.onmouseover = () => {
    zoomInBtn.style.background = '#45a049';
  };
  zoomInBtn.onmouseout = () => {
    zoomInBtn.style.background = '#4CAF50';
  };
  zoomInBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(10);
      updateStatusDisplay();
    } else {
      console.warn('ZoomScaleManager not enabled');
    }
  };

  // Zoom out 10% button
  const zoomOutBtn = document.createElement('button');
  zoomOutBtn.textContent = 'Zoom Out 10%';
  zoomOutBtn.style.cssText = `
    flex: 1;
    padding: 6px 8px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
    font-size: 11px;
    transition: background-color 0.2s;
  `;
  zoomOutBtn.onmouseover = () => {
    zoomOutBtn.style.background = '#da190b';
  };
  zoomOutBtn.onmouseout = () => {
    zoomOutBtn.style.background = '#f44336';
  };
  zoomOutBtn.onclick = () => {
    if (ganttInstance.zoomScaleManager) {
      ganttInstance.zoomScaleManager.zoomByPercentage(-10);
      updateStatusDisplay();
    } else {
      console.warn('ZoomScaleManager not enabled');
    }
  };

  buttonsContainer.appendChild(zoomInBtn);
  buttonsContainer.appendChild(zoomOutBtn);
  controlsContainer.appendChild(buttonsContainer);

  // Zoom level selector area
  if (ganttInstance.zoomScaleManager) {
    const levelSelectorContainer = document.createElement('div');
    levelSelectorContainer.style.cssText = `
      background: #f9f9f9;
      padding: 8px;
      border-radius: 3px;
      margin-bottom: 8px;
      border: 1px solid #ddd;
    `;

    const levelTitle = document.createElement('div');
    levelTitle.textContent = 'Zoom Level Selection:';
    levelTitle.style.cssText = `
      font-weight: bold;
      font-size: 11px;
      margin-bottom: 6px;
      color: #333;
    `;
    levelSelectorContainer.appendChild(levelTitle);

    // Get level configuration
    const levels = ganttInstance.zoomScaleManager.config.levels;

    const radioGroup = document.createElement('div');
    radioGroup.style.cssText = `
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
    `;

    levels.forEach((level, index) => {
      const minUnit = ganttInstance.zoomScaleManager?.findMinTimeUnit(level);

      const radioContainer = document.createElement('label');
      radioContainer.style.cssText = `
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 10px;
        padding: 1px 3px;
        border-radius: 2px;
        transition: background-color 0.2s;
      `;
      radioContainer.onmouseover = () => {
        radioContainer.style.backgroundColor = '#e8f4fd';
      };
      radioContainer.onmouseout = () => {
        radioContainer.style.backgroundColor = 'transparent';
      };

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'zoomLevel';
      radio.value = index.toString();
      radio.style.cssText = `
        margin-right: 4px;
        transform: scale(0.8);
      `;

      // Check current level
      if (index === ganttInstance.zoomScaleManager?.getCurrentLevel()) {
        radio.checked = true;
      }

      radio.onchange = () => {
        if (radio.checked) {
          // Switch to the middle state of the corresponding level
          ganttInstance.zoomScaleManager?.setZoomPosition({
            levelNum: index
          });
          updateStatusDisplay();
        }
      };

      const label = document.createElement('span');
      label.textContent = `L${index}: ${minUnit?.unit}×${minUnit?.step}`;
      label.style.cssText = `
        color: #555;
        user-select: none;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      `;

      radioContainer.appendChild(radio);
      radioContainer.appendChild(label);
      radioGroup.appendChild(radioContainer);
    });

    levelSelectorContainer.appendChild(radioGroup);
    controlsContainer.appendChild(levelSelectorContainer);

    // Listen to zoom events and update radio button status
    ganttInstance.on('zoom', () => {
      const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel();
      const radios = radioGroup.querySelectorAll('input[name="zoomLevel"]');
      radios.forEach((radio, index) => {
        radio.checked = index === currentLevel;
      });
    });
  }

  // Status display area
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'zoom-status';
  statusDisplay.style.cssText = `
    background: #f5f5f5;
    padding: 8px;
    border-radius: 3px;
    font-size: 10px;
    line-height: 1.3;
    color: #666;
    border: 1px solid #ddd;
  `;
  controlsContainer.appendChild(statusDisplay);

  // Update status display function
  function updateStatusDisplay() {
    const currentMillisecondsPerPixel = ganttInstance.getCurrentMillisecondsPerPixel();
    const scale = ganttInstance.parsedOptions.reverseSortedTimelineScales[0];
    const zoomConfig = ganttInstance.parsedOptions.zoom;

    let zoomScaleInfo = '';
    if (ganttInstance.zoomScaleManager) {
      const state = ganttInstance.zoomScaleManager.getCurrentZoomState();
      const currentLevel = ganttInstance.zoomScaleManager.getCurrentLevel();
      zoomScaleInfo = `
        <strong>ZoomScale Status:</strong><br>
        • Current Level: ${currentLevel}<br>
        • Min Unit: ${state?.minUnit} × ${state?.step}<br>
        • Column Width: ${state?.currentColWidth}px<br>
      `;
    }

    const currentLevel = ganttInstance.zoomScaleManager?.getCurrentLevel() ?? 'N/A';

    statusDisplay.innerHTML = `
      <strong>Status:</strong><br>
      • Timeline Column Width: ${ganttInstance.parsedOptions.timelineColWidth.toFixed(1)}px<br>
      • Current Time Unit: ${scale?.unit} × ${scale?.step}<br>
      • Current Level: ${currentLevel}<br>
      • MillisecondsPerPixel: ${currentMillisecondsPerPixel.toFixed(0)}<br>
      • Zoom Range: ${zoomConfig?.minMillisecondsPerPixel?.toFixed(0)} ~ ${zoomConfig?.maxMillisecondsPerPixel?.toFixed(
      0
    )}
    `;
  }

  // Initialize status display
  updateStatusDisplay();

  // Listen to zoom events and auto-update status
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  // Add control panel to page
  document.body.appendChild(controlsContainer);

  // Return control panel element for subsequent operations
  return controlsContainer;
}

// Create zoom control interface
const zoomControlsContainer = createZoomControls(ganttInstance);

// Global cleanup function
const cleanup = () => {
  // Clean up our created control panel
  if (zoomControlsContainer && zoomControlsContainer.parentNode) {
    zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
  }

  // Additional safety: clean up all possible remaining elements again
  const allControls = document.querySelectorAll('#zoom-controls, [id*="zoom-control"]');
  allControls.forEach(el => el.remove());

  // Clean up floating elements
  const floatingElements = document.querySelectorAll('div[style*="position: fixed"][style*="bottom"][style*="right"]');
  floatingElements.forEach(element => {
    if (
      element.textContent &&
      (element.textContent.includes('Zoom') ||
        element.textContent.includes('zoom') ||
        element.textContent.includes('In') ||
        element.textContent.includes('Out'))
    ) {
      element.remove();
    }
  });
};

// Multiple cleanup safeguards
window.addEventListener('beforeunload', cleanup);
window.addEventListener('pagehide', cleanup);

// Override release method to ensure cleanup
const originalRelease = ganttInstance.release.bind(ganttInstance);
ganttInstance.release = function () {
  cleanup();
  window.removeEventListener('beforeunload', cleanup);
  window.removeEventListener('pagehide', cleanup);
  originalRelease();
};

// Store cleanup function globally for other calls
window.cleanupControls = cleanup;
```
