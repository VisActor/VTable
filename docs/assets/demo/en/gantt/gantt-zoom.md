---
category: examples
group: gantt
title: Gantt Chart Smart Zoom Feature
cover:
link: gantt/zoom-scale
option: Gantt#zoomScale
---

# Gantt Chart Smart Zoom Feature

The Gantt chart smart zoom feature provides multi-level timeline display schemes that can automatically switch between different time scale combinations based on zoom levels, allowing users to get the optimal viewing experience at different time granularities. This feature supports trackpad zooming, mouse wheel zooming, and API zooming.

## Key Configuration

- `zoomScale.enabled`: Enable smart zoom functionality
- `zoomScale.levels`: Configure multi-level time scale combinations
- Mouse wheel zooming: Hold `Ctrl` key and scroll mouse wheel to zoom
- API get current zoom state: Use methods provided by `getCurrentZoomState`
- API set current zoom state: Use methods provided by `setZoomPosition`
- API zooming: Use zoom methods provided by `zoomScaleManager`

## Demo

```javascript livedemo template=vtable
// import * as VTableGantt from '@visactor/vtable-gantt';
let ganttInstance;

const records = [
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
    tableWidth: 400,
    minTableWidth: 300,
    maxTableWidth: 600
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
    position: relative;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
    align-items: flex-start;
    background: #f8f9fa;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid #e9ecef;
    margin-bottom: 16px;
    font-family: Arial, sans-serif;
  `;

  // Create title
  const title = document.createElement('div');
  title.textContent = 'Zoom Controls';
  title.style.cssText = `
    font-weight: bold;
    font-size: 14px;
    color: #333;
    margin-right: 16px;
    align-self: center;
    min-width: 100px;
  `;
  controlsContainer.appendChild(title);

  // Create button container
  const buttonsContainer = document.createElement('div');
  buttonsContainer.style.cssText = `
    display: flex;
    gap: 8px;
    align-items: center;
  `;

  // Zoom in 10% button
  const zoomInBtn = document.createElement('button');
  zoomInBtn.textContent = 'Zoom In 10%';
  zoomInBtn.style.cssText = `
    padding: 8px 12px;
    background: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background-color 0.2s;
    min-width: 100px;
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
    padding: 8px 12px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
    font-weight: 500;
    transition: background-color 0.2s;
    min-width: 100px;
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
      display: flex;
      align-items: center;
      gap: 8px;
      flex-wrap: wrap;
    `;

    const levelTitle = document.createElement('div');
    levelTitle.textContent = 'Level:';
    levelTitle.style.cssText = `
      font-weight: 500;
      font-size: 12px;
      color: #333;
      min-width: 50px;
    `;
    levelSelectorContainer.appendChild(levelTitle);

    // Get level configuration
    const levels = ganttInstance.zoomScaleManager.config.levels;

    const radioGroup = document.createElement('div');
    radioGroup.style.cssText = `
      display: flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items: center;
    `;

    levels.forEach((level, index) => {
      const minUnit = ganttInstance.zoomScaleManager?.findMinTimeUnit(level);

      const radioContainer = document.createElement('label');
      radioContainer.style.cssText = `
        display: flex;
        align-items: center;
        cursor: pointer;
        font-size: 12px;
        padding: 4px 8px;
        border-radius: 4px;
        border: 1px solid #ddd;
        background: white;
        transition: all 0.2s;
        white-space: nowrap;
      `;
      radioContainer.onmouseover = () => {
        radioContainer.style.backgroundColor = '#f0f8ff';
        radioContainer.style.borderColor = '#2196F3';
      };
      radioContainer.onmouseout = () => {
        const radio = radioContainer.querySelector('input[type="radio"]');
        if (radio.checked) {
          radioContainer.style.backgroundColor = '#e3f2fd';
          radioContainer.style.borderColor = '#2196F3';
        } else {
          radioContainer.style.backgroundColor = 'white';
          radioContainer.style.borderColor = '#ddd';
        }
      };

      const radio = document.createElement('input');
      radio.type = 'radio';
      radio.name = 'zoomLevel';
      radio.value = index.toString();
      radio.style.cssText = `
        margin-right: 6px;
      `;

      // Check current level
      if (index === ganttInstance.zoomScaleManager?.getCurrentLevel()) {
        radio.checked = true;
        radioContainer.style.backgroundColor = '#e3f2fd';
        radioContainer.style.borderColor = '#2196F3';
      }

      radio.onchange = () => {
        if (radio.checked) {
          // Update all container styles
          const allContainers = radioGroup.querySelectorAll('label');
          allContainers.forEach(container => {
            container.style.backgroundColor = 'white';
            container.style.borderColor = '#ddd';
          });
          radioContainer.style.backgroundColor = '#e3f2fd';
          radioContainer.style.borderColor = '#2196F3';

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
        color: #333;
        user-select: none;
        font-weight: 500;
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
      const containers = radioGroup.querySelectorAll('label');

      radios.forEach((radio, index) => {
        radio.checked = index === currentLevel;
        const container = containers[index];
        if (index === currentLevel) {
          container.style.backgroundColor = '#e3f2fd';
          container.style.borderColor = '#2196F3';
        } else {
          container.style.backgroundColor = 'white';
          container.style.borderColor = '#ddd';
        }
      });
    });
  }

  // Status display area
  const statusDisplay = document.createElement('div');
  statusDisplay.id = 'zoom-status';
  statusDisplay.style.cssText = `
    background: white;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.4;
    color: #333;
    border: 1px solid #ddd;
    margin-top: 12px;
    font-family: monospace;
  `;
  controlsContainer.appendChild(statusDisplay);

  // Update status display function
  function updateStatusDisplay() {
    const currentTimePerPixel = ganttInstance.getCurrentTimePerPixel();
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
      <strong>Status:</strong> 
      Timeline Column Width: ${ganttInstance.parsedOptions.timelineColWidth.toFixed(1)}px | 
      Current Time Unit: ${scale?.unit} × ${scale?.step} | 
      Current Level: ${currentLevel} | 
      TimePerPixel: ${currentTimePerPixel.toFixed(0)} | 
      Zoom Range: ${zoomConfig?.minTimePerPixel?.toFixed(0)} ~ ${zoomConfig?.maxTimePerPixel?.toFixed(0)}
    `;
  }

  // Initialize status display
  updateStatusDisplay();

  // Listen to zoom events and auto-update status
  ganttInstance.on('zoom', () => {
    updateStatusDisplay();
  });

  // Add control panel before gantt container
  const ganttContainer = document.getElementById(CONTAINER_ID);
  ganttContainer.parentNode.insertBefore(controlsContainer, ganttContainer);

  // Return control panel element for subsequent operations
  return controlsContainer;
}

// Create zoom control interface
const zoomControlsContainer = createZoomControls(ganttInstance);

// Cleanup when page unloads
const cleanup = () => {
  if (zoomControlsContainer && zoomControlsContainer.parentNode) {
    zoomControlsContainer.parentNode.removeChild(zoomControlsContainer);
  }
};

window.addEventListener('beforeunload', cleanup);

// Override release method to ensure cleanup
const originalRelease = ganttInstance.release.bind(ganttInstance);
ganttInstance.release = function () {
  cleanup();
  window.removeEventListener('beforeunload', cleanup);
  originalRelease();
};
```

## Zoom Methods

Users can zoom through the following methods after enabling the `zoomScale` feature:

- **Zoom In**: Hold `Ctrl` key and scroll mouse wheel up or pinch to zoom in
- **Zoom Out**: Hold `Ctrl` key and scroll mouse wheel down or pinch to zoom out
- **Zoom Center**: Zooming will be centered at the mouse pointer position

## Configuration Details

### zoomScale Configuration Structure

```typescript
interface IZoomScale {
  enabled: boolean; // Whether to enable smart zoom
  levels: ITimelineScale[][]; // Multi-level time scale configuration
}
```

### Level Configuration Description

Each level is an array of time scales, arranged from coarse to fine granularity:

- **Level 0**: Month-Week combination (coarsest, suitable for viewing long-term projects)
- **Level 1**: Month-Week-Day combination (suitable for viewing monthly plans)

```typescript
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
          (date.startDate.getDate() + new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) / 7
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
          (date.startDate.getDate() + new Date(date.startDate.getFullYear(), date.startDate.getMonth(), 1).getDay()) / 7
        );
        return `Week ${weekNum}`;
      }
    },
    {
      unit: 'day',
      step: 4,
      format: date => date.startDate.getDate().toString()
    }
  ]
];
```

## API Usage

### Get Zoom Manager

```javascript
const zoomManager = ganttInstance.zoomScaleManager;
```

### Get Zoom State

#### 1. Get Detailed Zoom State - `getCurrentZoomState()`

Get detailed information about the current zoom state.

```javascript
const state = zoomManager.getCurrentZoomState();
console.log('Current Level:', state.levelNum); // Level index
console.log('Min Time Unit:', state.minUnit); // Minimum time unit
console.log('Time Step:', state.step); // Step size
console.log('Column Width:', state.currentColWidth); // Current column width
```

**Return Type:**

```typescript
interface ZoomState {
  levelNum: number; // Current level index
  minUnit: string; // Minimum time unit
  step: number; // Time step
  currentColWidth: number; // Current column width
}
```

#### 2. Get Current Level - `getCurrentLevel()`

Get only the current level index.

```javascript
const currentLevel = zoomManager.getCurrentLevel();
console.log('Current Level:', currentLevel); // Returns number like 0, 1, 2...
```

### Zoom Operation Methods

#### 1. Zoom by Percentage - `zoomByPercentage(percentage, center?, centerX?)`

Zoom based on a percentage of the global zoom range, automatically selecting the appropriate level.

```javascript
// Basic usage
zoomManager.zoomByPercentage(10); // Zoom in 10%
zoomManager.zoomByPercentage(-10); // Zoom out 10%

// Specify zoom center
zoomManager.zoomByPercentage(15, true, 300); // Zoom in 15% centered at X coordinate 300
```

**Parameter Description:**

- `percentage` (number): Zoom percentage, positive for zoom in, negative for zoom out
- `center` (boolean, optional): Whether to maintain view center, default is true
- `centerX` (number, optional): X coordinate of zoom center, default is view center

#### 2. Set Zoom State - `setZoomPosition(params)`

Precisely set to a specific zoom state, supporting multiple parameter combinations.

```javascript
// Method 1: Set by level number and column width
zoomManager.setZoomPosition({
  levelNum: 2, // Switch to level 2
  colWidth: 60 // Set column width to 60px
});

// Method 2: Set by time unit and step
zoomManager.setZoomPosition({
  minUnit: 'day', // Minimum time unit is day
  step: 1, // Step size is 1
  colWidth: 80 // Set column width to 80px (optional)
});

// Method 3: Switch level only (use middle state of level)
zoomManager.setZoomPosition({
  levelNum: 3
});
```

**Parameter Description:**

- `levelNum` (number, optional): Target level index
- `minUnit` (string, optional): Minimum time unit ('year', 'month', 'week', 'day', 'hour', 'minute', 'second')
- `step` (number, optional): Time step
- `colWidth` (number, optional): Target column width, uses level's middle state if not specified

**Return Value:** boolean - Whether the operation was successful

## Best Practices

### 1. Level Design Principles

- **Coarse to Fine**: Level 0 should be the coarsest time scale, higher levels should be more refined
- **Reasonable Transitions**: Time granularity differences between adjacent levels should not be too large
- **Practical Priority**: Design appropriate time scale combinations based on actual scenarios
- **Reasonable Level Count**: Recommend controlling to 3-6 levels

### 2. Performance Optimization

- **Appropriate Column Width**: Recommend minimum time unit column width between 40-100px for each level
- **Efficient Rendering**: Avoid too many levels that might impact performance

### 3. User Experience

- **Provide Zoom Hints**: Inform users they can use Ctrl+scroll wheel to zoom
- **Status Feedback**: Display current zoom status and level information in real-time
- **Smooth Transitions**: Avoid abrupt jumps during zooming

## Notes

1. **Enabling Condition**: Smart zoom functionality only works when `zoomScale.enabled` is `true`
2. **Mouse Wheel**: Need to hold `Ctrl` key and scroll mouse wheel to zoom
3. **Level Switching**: System automatically selects the most appropriate level based on current `timePerPixel` value
4. **Compatibility**: Smart zoom functionality overrides `timelineHeader.scales` configuration
5. **Event Listening**: Can listen to `zoom` events to get zoom status changes

By properly configuring the smart zoom functionality, users can get the optimal Gantt chart viewing experience at different time dimensions.
