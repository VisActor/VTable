import * as VTable from '@visactor/vtable';
// @ts-ignore - workspace 源码别名场景下可能没有完整类型产物
import { MCPClient, VTableToolRegistry } from '@visactor/vtable-mcp';

let tableInstance: VTable.ListTable | null = null;
let mcpConnected = false;
let mcpClient: MCPClient | null = null;
let toolRegistry: VTableToolRegistry | null = null;

function log(message: string, type: 'info' | 'success' | 'error' = 'info') {
  const logOutput = document.getElementById('logOutput');
  if (logOutput) {
    const timestamp = new Date().toLocaleTimeString();
    const color = type === 'error' ? '#ff6b6b' : type === 'success' ? '#51cf66' : '#74c0fc';
    logOutput.innerHTML += `<span style="color:${color}">[${timestamp}] ${message}</span>\n`;
    logOutput.scrollTop = logOutput.scrollHeight;
  }
  // eslint-disable-next-line no-console
  console.log(`[${type}] ${message}`);
}

function updateStatus(message: string, connected: boolean) {
  const statusElement = document.getElementById('status');
  if (statusElement) {
    statusElement.textContent = message;
    statusElement.className = `status ${connected ? 'connected' : 'disconnected'}`;
  }
  mcpConnected = connected;
}

function updateTableInfo() {
  if (!tableInstance) return;
  document.getElementById('rowCount')!.textContent = tableInstance.rowCount.toString();
  document.getElementById('colCount')!.textContent = tableInstance.colCount.toString();
}

function createTableData() {
  const records: any[] = [];
  for (let i = 0; i < 1000; i++) {
    records.push({
      id: i + 1,
      name: `产品 ${i + 1}`,
      category: ['电子产品', '服装', '食品', '图书', '家居'][i % 5],
      price: Math.floor(Math.random() * 1000) + 100,
      stock: Math.floor(Math.random() * 100) + 10,
      status: Math.random() > 0.3 ? '有库存' : '缺货'
    });
  }
  return records;
}

function initVTable() {
  const records = createTableData();
  const columns = [
    { field: 'id', title: 'ID', width: 80 },
    { field: 'name', title: '产品名称', width: 200 },
    { field: 'category', title: '分类', width: 150 },
    { field: 'price', title: '价格', width: 120 },
    { field: 'stock', title: '库存', width: 100 },
    { field: 'status', title: '状态', width: 120 }
  ];

  const option: VTable.ListTableConstructorOptions = {
    records,
    columns,
    widthMode: 'standard',
    heightMode: 'standard',
    defaultRowHeight: 40,
    defaultHeaderRowHeight: 45,
    autoWrapText: true,
    select: {
      disableSelect: false,
      disableHeaderSelect: false
    }
  };

  tableInstance = new VTable.ListTable(document.getElementById('tableContainer')!, option);
  (window as any).__vtable_instance = tableInstance;

  tableInstance.on('click_cell', args => {
    const { row, col } = args;
    const cellValue = tableInstance!.getCellValue(row, col);
    document.getElementById('selectedCell')!.textContent = `(${row}, ${col}): ${cellValue}`;
    log(`选中单元格: (${row}, ${col}) = "${cellValue}"`, 'info');
  });

  log('VTable实例创建成功', 'success');
  updateTableInfo();
}

async function connectToMCP() {
  try {
    if (!tableInstance) {
      log('请先初始化表格', 'error');
      return;
    }

    const mcpServerUrl = (document.getElementById('mcpServer') as HTMLInputElement).value;
    const sessionId = (document.getElementById('sessionId') as HTMLInputElement).value;
    log(`正在连接到MCP服务器: ${mcpServerUrl}`, 'info');

    mcpClient = new MCPClient({
      serverUrl: mcpServerUrl,
      sessionId,
      onStatusChange: (connected, message) => updateStatus(message, connected),
      onLog: (message, type) => log(message, type)
    });

    toolRegistry = new VTableToolRegistry(mcpClient);
    toolRegistry.onInit(tableInstance);
    await mcpClient.onInit(tableInstance);

    log('插件系统初始化完成', 'success');
  } catch (error) {
    updateStatus(`连接失败: ${error}`, false);
    log(`连接失败: ${error}`, 'error');
  }
}

function disconnectFromMCP() {
  if (mcpClient) {
    mcpClient.disconnect();
    mcpClient = null;
    toolRegistry = null;
  }
  updateStatus('已断开MCP服务器连接', false);
  log('已断开MCP服务器连接', 'info');
}

async function callMCPTool(toolName: string, params: any): Promise<any> {
  if (!mcpClient || !mcpConnected) throw new Error('未连接到MCP服务器');
  return await mcpClient.callTool(toolName, params);
}

async function getTableInfo() {
  try {
    log('正在获取表格信息', 'info');
    const result = await callMCPTool('get_table_info', {});
    log(`✓ 表格信息: ${JSON.stringify(result, null, 2)}`, 'success');
  } catch (error: any) {
    log(`获取失败: ${error.message || error}`, 'error');
  }
}

function clearTableData() {
  if (!tableInstance) return;
  tableInstance.setRecords([]);
  log('✓ 表格数据已清空', 'success');
  updateTableInfo();
}

function resetTableData() {
  if (!tableInstance) return;
  tableInstance.setRecords(createTableData());
  log('✓ 表格数据已重置', 'success');
  updateTableInfo();
}

(window as any).connectToMCP = connectToMCP;
(window as any).disconnectFromMCP = disconnectFromMCP;

(window as any).getTableInfo = getTableInfo;
(window as any).clearTableData = clearTableData;
(window as any).resetTableData = resetTableData;

window.addEventListener('DOMContentLoaded', () => {
  log('VTable MCP 测试页面已加载', 'info');
  try {
    initVTable();
    log('VTable实例初始化完成', 'success');
  } catch (error) {
    log(`初始化失败: ${error}`, 'error');
  }
});
