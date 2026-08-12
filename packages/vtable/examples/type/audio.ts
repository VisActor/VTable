import * as VTable from '../../src';

const ListTable = VTable.ListTable;
const CONTAINER_ID = 'vTable';

const audioUrls = [
  'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/vtable-demo-bright-melody.mp3',
  'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/vtable-demo-soft-loop.mp3',
  'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/demo/vtable-demo-calm-theme.mp3'
];
const TOOLBAR_ID = 'audio-demo-theme-toolbar';

type DemoTheme = 'light' | 'dark';

const themeMap = {
  light: VTable.themes.DEFAULT.extends({
    underlayBackgroundColor: '#ffffff',
    defaultStyle: {
      bgColor: '#ffffff',
      color: '#111827',
      borderColor: '#E5E7EB'
    },
    headerStyle: {
      bgColor: '#F3F6F9',
      color: '#111827',
      borderColor: '#E5E7EB'
    },
    bodyStyle: {
      bgColor: '#ffffff',
      color: '#111827',
      borderColor: '#E5E7EB'
    },
    frameStyle: {
      borderColor: '#E5E7EB',
      borderLineWidth: 1
    },
    selectionStyle: {
      cellBorderColor: '#2563EB',
      cellBorderLineWidth: 3,
      cellBgColor: 'rgba(37, 99, 235, 0.08)'
    }
  }),
  dark: VTable.themes.DEFAULT.extends({
    underlayBackgroundColor: '#111827',
    defaultStyle: {
      bgColor: '#111827',
      color: '#E5E7EB',
      borderColor: '#374151'
    },
    headerStyle: {
      bgColor: '#1F2937',
      color: '#F9FAFB',
      borderColor: '#374151'
    },
    bodyStyle: {
      bgColor: '#111827',
      color: '#E5E7EB',
      borderColor: '#374151'
    },
    frameStyle: {
      borderColor: '#374151',
      borderLineWidth: 1
    },
    selectionStyle: {
      cellBorderColor: '#60A5FA',
      cellBorderLineWidth: 3,
      cellBgColor: 'rgba(96, 165, 250, 0.18)'
    }
  })
};

function applyPageTheme(theme: DemoTheme) {
  const isDark = theme === 'dark';
  const container = document.getElementById(CONTAINER_ID);
  if (container) {
    container.style.background = isDark ? '#111827' : '#ffffff';
    container.parentElement?.style.setProperty('background', isDark ? '#0F172A' : '#ffffff');
  }
}

function clearPageTheme() {
  const container = document.getElementById(CONTAINER_ID);
  if (container) {
    container.style.background = '';
    container.parentElement?.style.removeProperty('background');
  }
}

function createToolbar(instance: VTable.ListTable, currentTheme: DemoTheme) {
  document.getElementById(TOOLBAR_ID)?.remove();

  const toolbar = document.createElement('div');
  toolbar.id = TOOLBAR_ID;
  toolbar.style.display = 'flex';
  toolbar.style.gap = '8px';
  toolbar.style.alignItems = 'center';
  toolbar.style.margin = '8px 0 12px 30px';
  toolbar.style.fontFamily = 'sans-serif';

  const setActiveButton = (theme: DemoTheme) => {
    toolbar.querySelectorAll('button').forEach(button => {
      const active = button.dataset.theme === theme;
      button.style.background = active ? '#2563EB' : '#F3F4F6';
      button.style.color = active ? '#FFFFFF' : '#111827';
      button.style.borderColor = active ? '#2563EB' : '#D1D5DB';
    });
  };

  const switchTheme = (theme: DemoTheme) => {
    currentTheme = theme;
    applyPageTheme(theme);
    instance.updateTheme(themeMap[theme]);
    setActiveButton(currentTheme);
  };

  [
    { theme: 'light' as DemoTheme, label: '亮色主题' },
    { theme: 'dark' as DemoTheme, label: '暗黑主题' }
  ].forEach(item => {
    const button = document.createElement('button');
    button.dataset.theme = item.theme;
    button.textContent = item.label;
    button.style.height = '32px';
    button.style.padding = '0 14px';
    button.style.border = '1px solid #D1D5DB';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    button.onclick = () => switchTheme(item.theme);
    toolbar.appendChild(button);
  });

  const root = document.getElementById(CONTAINER_ID);
  root?.parentNode?.insertBefore(toolbar, root);
  setActiveButton(currentTheme);
}

export function createTable() {
  const currentTheme: DemoTheme = 'light';
  applyPageTheme(currentTheme);

  const records = [
    {
      id: 1,
      name: 'audio cell',
      type: 'cellType: audio',
      audio: audioUrls[0]
    },
    {
      id: 2,
      name: 'video fallback',
      type: 'cellType: video + audio url',
      audio: audioUrls[1]
    },
    {
      id: 3,
      name: 'audio with query',
      type: 'audio url with query',
      audio: `${audioUrls[2]}?from=vtable-demo`
    }
  ];

  const option: VTable.ListTableConstructorOptions = {
    container: document.getElementById(CONTAINER_ID),
    columns: [
      {
        field: 'id',
        title: 'ID',
        width: 80
      },
      {
        field: 'name',
        title: 'Name',
        width: 180
      },
      {
        field: 'type',
        title: 'Case',
        width: 220
      },
      {
        field: 'audio',
        title: 'Audio',
        cellType: 'audio',
        width: 180,
        style: {
          padding: 8
        }
      },
      {
        field: 'audio',
        title: 'Video Cell Fallback',
        cellType: 'video',
        width: 220,
        keepAspectRatio: true,
        style: {
          padding: 8
        }
      }
    ],
    records,
    widthMode: 'standard',
    theme: themeMap[currentTheme],
    hover: {
      highlightMode: 'cross'
    }
  };

  const instance = new ListTable(option);
  createToolbar(instance, currentTheme);

  const release = instance.release.bind(instance);
  instance.release = () => {
    document.getElementById(TOOLBAR_ID)?.remove();
    clearPageTheme();
    release();
  };

  VTable.bindDebugTool(instance.scenegraph.stage as any, {
    customGrapicKeys: ['role', '_updateTag']
  });

  window.tableInstance = instance;
}
