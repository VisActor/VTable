import { menus } from './menu';
// import * as VTable from '../src';
import { default as MarkdownIt } from 'markdown-it';

// window.VTable = VTable;
// window.PivotTable = PivotTable;
// window.PivotTable = PivotTable;
// window.CONTAINER_ID = 'vTable';

const md = new MarkdownIt();

const ACTIVE_ITEM_CLS = 'menu-item-active';
const MENU_TITLE_CLS = 'menu-title';
const LOCAL_STORAGE_KEY = 'VTABLE_DEMO';

const evaluateCode = (code: string) => {
  // eslint-disable-next-line no-console
  if (!code) {
    return;
  }
  try {
    Function(code)(window);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error(err);
  }
};

const handleClick = (e: { target: any }, isInit?: boolean) => {
  const triggerNode = e.target;

  if (!triggerNode || triggerNode.classList.contains(MENU_TITLE_CLS)) {
    return;
  }

  if (triggerNode) {
    const path = triggerNode.dataset.path;
    const name = triggerNode.dataset.name;

    if (path && name) {
      const prevActiveItems = document.getElementsByClassName(ACTIVE_ITEM_CLS);

      if (prevActiveItems && prevActiveItems.length) {
        for (let i = 0; i < prevActiveItems.length; i++) {
          const element = prevActiveItems[i];

          element.classList.remove(ACTIVE_ITEM_CLS);
        }
      }
      triggerNode.classList.add(ACTIVE_ITEM_CLS);
      if (!isInit) {
        localStorage.setItem(LOCAL_STORAGE_KEY, name);
      }

      const issue5036Controls = document.getElementById('issue5036Controls');
      if (issue5036Controls) {
        (window as any).search?.clear?.();
        issue5036Controls.remove();
        document.getElementById('input-test')!.style.display = '';
        document.getElementById('textarea-test')!.style.display = '';
        document.getElementById('vTable')!.style.height = '90%';
        (window as any).search = undefined;
        (window as any).masterDetailPlugin = undefined;
      }

      if (window.tableInstance) {
        window.tableInstance.release();
        document.getElementById('vTable').innerHTML = null;
      }

      let fileType = 'ts';
      if (path === 'custom-layout-jsx') {
        fileType = 'tsx';
      }
      import(`./${path}/${name}.${fileType}`)
        .then(module => {
          // eslint-disable-next-line no-console
          console.info('%c %s', 'color: #1890ff;font-weight: bold', `当前 demo 路径：./examples/${path}/${name}.md`);
          // document.getElementById('article').innerHTML = module.html;
          // const jsCode = document.getElementsByClassName('language-ts')[0].innerHTML;
          // evaluateCode(md.utils.unescapeAll(jsCode));

          if (module.createTable) {
            module.createTable();
          }
        })
        .catch(err => {
          // eslint-disable-next-line no-console
          console.log(err);
        });
    }
  }
};

const initSidebarEvent = (node: HTMLDivElement) => {
  node.addEventListener('click', handleClick);
};

const createSidebar = (node: HTMLDivElement) => {
  const specsHtml = menus.map(entry => {
    if (entry.menu && entry.children && entry.children.length) {
      const childrenItems = entry.children.map(child => {
        return `<p class="menu-item" data-path="${child.path}" data-name="${child.name}">${child.name}</p>`;
      });

      return `<p class="menu-item menu-title">${entry.menu}</p>${childrenItems.join('')}`;
    }

    return `<p class="menu-item" data-path="${entry.path}" data-name="${entry.name}">${entry.name}</p>`;
  });

  node.innerHTML = `
    <div>
      <p class="sidebar-title"></p>
      <div class="menu-list">
        ${specsHtml.join('')}
      </div>
    </div>
  `;
};

const run = () => {
  const sidebarNode = document.querySelector<HTMLDivElement>('#sidebar')!;
  const prevActivePath =
    new URLSearchParams(window.location.search).get('demo') || localStorage.getItem(LOCAL_STORAGE_KEY);

  createSidebar(sidebarNode);
  initSidebarEvent(sidebarNode);

  const menuItemNodes = document.getElementsByClassName('menu-item');

  handleClick(
    {
      target:
        menuItemNodes &&
        menuItemNodes.length &&
        ([...menuItemNodes].find(node => {
          return prevActivePath && node.dataset.name === prevActivePath;
        }) ||
          menuItemNodes[0])
    },
    true
  );
};

run();
