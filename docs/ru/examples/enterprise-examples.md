# Корпоративные примеры и продвинутые случаи использования

Это руководство демонстрирует корпоративные реализации VTable в реальных бизнес-сценариях, показывая продвинутые функции, сложную обработку данных и профессиональные решения.

## Финансовая торговая панель

Полная реализация торговой панели в реальном времени с обновлениями данных в режиме реального времени, продвинутой фильтрацией и профессиональным стилизованием.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Financial Trading Dashboard</title>
    <script src="https://unpkg.com/@visactor/vtable@latest/build/index.min.js"></script>
    <style>
        body { font-family: 'Segoe UI', sans-serif; margin: 0; background: #f5f6fa; }
        .dashboard { display: flex; height: 100vh; }
        .sidebar { width: 300px; background: #2c3e50; color: white; padding: 20px; }
        .main-content { flex: 1; padding: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 20px; }
        .metric-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-value { font-size: 2em; font-weight: bold; color: #27ae60; }
        .metric-label { color: #7f8c8d; font-size: 0.9em; }
        .table-container { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
        .btn-primary { background: #3498db; color: white; }
        .btn-success { background: #27ae60; color: white; }
        .btn-danger { background: #e74c3c; color: white; }
        .status-indicator { display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; }
        .status-up { background: #27ae60; }
        .status-down { background: #e74c3c; }
        .status-neutral { background: #f39c12; }
    </style>
</head>
<body>
    <div class="dashboard">
        <div class="sidebar">
            <h2>Trading Dashboard</h2>
            <div class="filters">
                <h3>Filters</h3>
                <div>
                    <label>Market:</label>
                    <select id="marketFilter">
                        <option value="">All Markets</option>
                        <option value="NYSE">NYSE</option>
                        <option value="NASDAQ">NASDAQ</option>
                        <option value="LSE">LSE</option>
                    </select>
                </div>
                <div>
                    <label>Sector:</label>
                    <select id="sectorFilter">
                        <option value="">All Sectors</option>
                        <option value="Technology">Technology</option>
                        <option value="Finance">Finance</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Energy">Energy</option>
                    </select>
                </div>
                <div>
                    <label>Min Volume:</label>
                    <input type="number" id="volumeFilter" placeholder="0">
                </div>
            </div>
            
            <div class="watchlist">
                <h3>Watchlist</h3>
                <div id="watchlistItems"></div>
            </div>
        </div>
        
        <div class="main-content">
            <div class="metrics-grid">
                <div class="metric-card">
                    <div class="metric-value" id="totalValue">$2.4M</div>
                    <div class="metric-label">Portfolio Value</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="dayChange">+$12.5K</div>
                    <div class="metric-label">Day Change</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="activePositions">47</div>
                    <div class="metric-label">Active Positions</div>
                </div>
                <div class="metric-card">
                    <div class="metric-value" id="volumeTraded">1.2M</div>
                    <div class="metric-label">Volume Traded</div>
                </div>
            </div>
            
            <div class="table-container">
                <div class="toolbar">
                    <h3>Live Market Data</h3>
                    <div>
                        <button class="btn btn-primary" onclick="refreshData()">Refresh</button>
                        <button class="btn btn-success" onclick="exportData()">Export</button>
                        <button class="btn btn-danger" onclick="clearAlerts()">Clear Alerts</button>
                    </div>
                </div>
                <div id="tradingTable" style="height: 500px;"></div>
            </div>
        </div>
    </div>

    <script>
        // Financial data simulation
        class MarketDataSimulator {
            constructor() {
                this.stocks = [
                    { symbol: 'AAPL', name: 'Apple Inc.', market: 'NASDAQ', sector: 'Technology', price: 150.25, volume: 45670000 },
                    { symbol: 'GOOGL', name: 'Alphabet Inc.', market: 'NASDAQ', sector: 'Technology', price: 2745.15, volume: 1234000 },
                    { symbol: 'MSFT', name: 'Microsoft Corp.', market: 'NASDAQ', sector: 'Technology', price: 305.80, volume: 28450000 },
                    { symbol: 'TSLA', name: 'Tesla Inc.', market: 'NASDAQ', sector: 'Technology', price: 695.50, volume: 18750000 },
                    { symbol: 'JPM', name: 'JPMorgan Chase', market: 'NYSE', sector: 'Finance', price: 145.75, volume: 12340000 },
                    { symbol: 'BAC', name: 'Bank of America', market: 'NYSE', sector: 'Finance', price: 42.80, volume: 38920000 },
                    { symbol: 'JNJ', name: 'Johnson & Johnson', market: 'NYSE', sector: 'Healthcare', price: 165.30, volume: 8760000 },
                    { symbol: 'PFE', name: 'Pfizer Inc.', market: 'NYSE', sector: 'Healthcare', price: 45.90, volume: 24680000 },
                ];
                
                this.updateInterval = null;
            }
            
            generateRealTimeData() {
                return this.stocks.map(stock => {
                    const change = (Math.random() - 0.5) * 10;
                    const changePercent = (change / stock.price) * 100;
                    const newPrice = Math.max(0.01, stock.price + change);
                    
                    stock.price = newPrice;
                    stock.volume += Math.floor(Math.random() * 100000);
                    
                    return {
                        ...stock,
                        price: parseFloat(newPrice.toFixed(2)),
                        change: parseFloat(change.toFixed(2)),
                        changePercent: parseFloat(changePercent.toFixed(2)),
                        volume: stock.volume,
                        marketCap: parseFloat((newPrice * 1000000000).toFixed(0)),
                        lastUpdate: new Date().toLocaleTimeString(),
                        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
                        high52w: parseFloat((newPrice * (1 + Math.random() * 0.5)).toFixed(2)),
                        low52w: parseFloat((newPrice * (1 - Math.random() * 0.3)).toFixed(2)),
                        pe: parseFloat((15 + Math.random() * 20).toFixed(2)),
                        dividend: parseFloat((Math.random() * 3).toFixed(2))
                    };
                });
            }
            
            startRealTimeUpdates(callback) {
                this.updateInterval = setInterval(() => {
                    callback(this.generateRealTimeData());
                }, 2000);
            }
            
            stopRealTimeUpdates() {
                if (this.updateInterval) {
                    clearInterval(this.updateInterval);
                    this.updateInterval = null;
                }
            }
        }
        
        // Initialize market data
        const marketSim = new MarketDataSimulator();
        let tradingTable;
        
        // Table configuration
        const columns = [
            {
                field: 'symbol',
                caption: 'Symbol',
                width: 100,
                style: {
                    fontWeight: 'bold',
                    color: '#2c3e50'
                },
                customRender: (args) => {
                    const { value, record } = args;
                    return `<div style="display: flex; align-items: center;">
                        <span class="status-indicator status-${record.trend}"></span>
                        <strong>${value}</strong>
                    </div>`;
                }
            },
            {
                field: 'name',
                caption: 'Company Name',
                width: 200,
                style: {
                    textAlign: 'left'
                }
            },
            {
                field: 'price',
                caption: 'Price',
                width: 120,
                formatter: (value) => `$${value.toFixed(2)}`,
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold'
                }
            },
            {
                field: 'change',
                caption: 'Change',
                width: 100,
                formatter: (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}`,
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: (args) => {
                        const value = args.value;
                        return value > 0 ? '#27ae60' : value < 0 ? '#e74c3c' : '#7f8c8d';
                    }
                }
            },
            {
                field: 'changePercent',
                caption: 'Change %',
                width: 100,
                formatter: (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`,
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: (args) => {
                        const value = args.value;
                        return value > 0 ? '#27ae60' : value < 0 ? '#e74c3c' : '#7f8c8d';
                    },
                    bgColor: (args) => {
                        const value = args.value;
                        return value > 2 ? '#d5f4e6' : value < -2 ? '#fdf2f2' : '#ffffff';
                    }
                }
            },
            {
                field: 'volume',
                caption: 'Volume',
                width: 120,
                formatter: (value) => {
                    if (value >= 1000000) {
                        return `${(value / 1000000).toFixed(1)}M`;
                    }
                    return `${(value / 1000).toFixed(0)}K`;
                },
                style: {
                    textAlign: 'right'
                }
            },
            {
                field: 'marketCap',
                caption: 'Market Cap',
                width: 130,
                formatter: (value) => {
                    if (value >= 1000000000000) {
                        return `$${(value / 1000000000000).toFixed(2)}T`;
                    } else if (value >= 1000000000) {
                        return `$${(value / 1000000000).toFixed(2)}B`;
                    }
                    return `$${(value / 1000000).toFixed(2)}M`;
                },
                style: {
                    textAlign: 'right'
                }
            },
            {
                field: 'pe',
                caption: 'P/E Ratio',
                width: 100,
                formatter: (value) => value.toFixed(2),
                style: {
                    textAlign: 'right'
                }
            },
            {
                field: 'dividend',
                caption: 'Dividend',
                width: 100,
                formatter: (value) => `${value.toFixed(2)}%`,
                style: {
                    textAlign: 'right'
                }
            },
            {
                field: 'lastUpdate',
                caption: 'Last Update',
                width: 120,
                style: {
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            {
                field: 'actions',
                caption: 'Actions',
                width: 150,
                customRender: (args) => {
                    const { record } = args;
                    return `
                        <div style="display: flex; gap: 4px;">
                            <button onclick="buyStock('${record.symbol}')" style="padding: 2px 8px; background: #27ae60; color: white; border: none; border-radius: 3px; cursor: pointer;">Buy</button>
                            <button onclick="sellStock('${record.symbol}')" style="padding: 2px 8px; background: #e74c3c; color: white; border: none; border-radius: 3px; cursor: pointer;">Sell</button>
                            <button onclick="addToWatchlist('${record.symbol}')" style="padding: 2px 8px; background: #3498db; color: white; border: none; border-radius: 3px; cursor: pointer;">Watch</button>
                        </div>
                    `;
                }
            }
        ];
        
        // Initialize table
        function initializeTable() {
            const initialData = marketSim.generateRealTimeData();
            
            tradingTable = new VTable.ListTable({
                container: document.getElementById('tradingTable'),
                columns: columns,
                records: initialData,
                defaultRowHeight: 45,
                defaultHeaderRowHeight: 50,
                
                theme: {
                    defaultStyle: {
                        borderColor: '#e1e8ed',
                        borderWidth: 1,
                        bgColor: '#ffffff',
                        color: '#14171a',
                        fontSize: 13,
                        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
                    },
                    headerStyle: {
                        borderColor: '#e1e8ed',
                        borderWidth: 1,
                        bgColor: '#f7f9fa',
                        color: '#536471',
                        fontSize: 13,
                        fontWeight: '600'
                    },
                    frameStyle: {
                        borderColor: '#cfd9de',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                
                select: {
                    enableRowSelect: true,
                    enableMultiSelect: true,
                    highlightMode: 'row'
                },
                
                sort: {
                    enableSort: true,
                    sortMode: 'multiple'
                },
                
                scroll: {
                    enableHorizontalScroll: true,
                    enableVerticalScroll: true
                },
                
                animationAppear: {
                    duration: 300,
                    easing: 'ease-out'
                }
            });
            
            // Add event listeners
            tradingTable.on('click_cell', (event) => {
                if (event.field === 'symbol') {
                    showStockDetails(event.record);
                }
            });
            
            tradingTable.on('selection_changed', (event) => {
                updateMetrics(event.selectedRows);
            });
            
            // Start real-time updates
            marketSim.startRealTimeUpdates((newData) => {
                updateTableData(newData);
                updateDashboardMetrics(newData);
            });
        }
        
        // Update table data
        function updateTableData(newData) {
            tradingTable.updateOption({ records: newData });
        }
        
        // Update dashboard metrics
        function updateDashboardMetrics(data) {
            const totalValue = data.reduce((sum, stock) => sum + (stock.price * 1000), 0);
            const totalChange = data.reduce((sum, stock) => sum + (stock.change * 1000), 0);
            const totalVolume = data.reduce((sum, stock) => sum + stock.volume, 0);
            
            document.getElementById('totalValue').textContent = `$${(totalValue / 1000000).toFixed(1)}M`;
            document.getElementById('dayChange').textContent = `${totalChange >= 0 ? '+' : ''}$${(totalChange / 1000).toFixed(1)}K`;
            document.getElementById('activePositions').textContent = data.length;
            document.getElementById('volumeTraded').textContent = `${(totalVolume / 1000000).toFixed(1)}M`;
            
            // Update change color
            const changeElement = document.getElementById('dayChange');
            changeElement.style.color = totalChange >= 0 ? '#27ae60' : '#e74c3c';
        }
        
        // Stock actions
        function buyStock(symbol) {
            console.log(`Buy order placed for ${symbol}`);
            alert(`Buy order placed for ${symbol}`);
        }
        
        function sellStock(symbol) {
            console.log(`Sell order placed for ${symbol}`);
            alert(`Sell order placed for ${symbol}`);
        }
        
        function addToWatchlist(symbol) {
            console.log(`${symbol} added to watchlist`);
            const watchlistItems = document.getElementById('watchlistItems');
            const item = document.createElement('div');
            item.innerHTML = `<div style="padding: 4px 0; border-bottom: 1px solid #34495e;">${symbol}</div>`;
            watchlistItems.appendChild(item);
        }
        
        function showStockDetails(stock) {
            const details = `
                Stock: ${stock.name} (${stock.symbol})
                Current Price: $${stock.price}
                Change: ${stock.change >= 0 ? '+' : ''}${stock.change} (${stock.changePercent}%)
                Volume: ${stock.volume.toLocaleString()}
                Market Cap: ${stock.marketCap}
                P/E Ratio: ${stock.pe}
                52W High: $${stock.high52w}
                52W Low: $${stock.low52w}
            `;
            alert(details);
        }
        
        // Toolbar functions
        function refreshData() {
            const newData = marketSim.generateRealTimeData();
            updateTableData(newData);
            updateDashboardMetrics(newData);
        }
        
        function exportData() {
            const data = tradingTable.getAllRecords();
            const csv = convertToCSV(data);
            downloadFile(csv, 'trading-data.csv', 'text/csv');
        }
        
        function clearAlerts() {
            console.log('Alerts cleared');
        }
        
        // Utility functions
        function convertToCSV(data) {
            const headers = Object.keys(data[0]).filter(key => key !== 'actions');
            const csvRows = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => {
                        let value = row[header];
                        if (typeof value === 'string' && value.includes(',')) {
                            value = `"${value.replace(/"/g, '""')}"`;
                        }
                        return value;
                    }).join(',')
                )
            ];
            return csvRows.join('\n');
        }
        
        function downloadFile(content, filename, contentType) {
            const blob = new Blob([content], { type: contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', initializeTable);
        
        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (marketSim) {
                marketSim.stopRealTimeUpdates();
            }
            if (tradingTable) {
                tradingTable.release();
            }
        });
    </script>
</body>
</html>
```

## E-commerce Product Management System

Advanced product catalog management with inventory tracking, bulk operations, and real-time updates.

```javascript
// E-commerce Product Management Implementation
class EcommerceProductManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.products = [];
        this.categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Beauty'];
        this.suppliers = ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'];
        this.table = null;
        
        this.initializeTable();
        this.loadSampleData();
    }
    
    initializeTable() {
        const columns = [
            {
                field: 'select',
                caption: '',
                width: 50,
                cellType: 'checkbox',
                headerType: 'checkbox',
                style: {
                    textAlign: 'center'
                }
            },
            {
                field: 'image',
                caption: 'Image',
                width: 80,
                cellType: 'image',
                style: {
                    imageWidth: 60,
                    imageHeight: 60,
                    imageRadius: 8,
                    imageFit: 'cover'
                }
            },
            {
                field: 'sku',
                caption: 'SKU',
                width: 120,
                sort: true,
                style: {
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                }
            },
            {
                field: 'name',
                caption: 'Product Name',
                width: 250,
                sort: true,
                editor: 'input',
                validation: {
                    required: true,
                    minLength: 3,
                    maxLength: 100
                },
                customRender: (args) => {
                    const { value, record } = args;
                    return `
                        <div style="line-height: 1.4;">
                            <div style="font-weight: bold; color: #2c3e50;">${value}</div>
                            <div style="font-size: 12px; color: #7f8c8d;">${record.description || 'No description'}</div>
                        </div>
                    `;
                }
            },
            {
                field: 'category',
                caption: 'Category',
                width: 130,
                sort: true,
                editor: 'select',
                editorOptions: {
                    values: this.categories
                },
                style: {
                    bgColor: (args) => {
                        const categoryColors = {
                            'Electronics': '#e3f2fd',
                            'Clothing': '#f3e5f5',
                            'Books': '#e8f5e8',
                            'Home & Garden': '#fff3e0',
                            'Sports': '#fce4ec',
                            'Beauty': '#f1f8e9'
                        };
                        return categoryColors[args.value] || '#ffffff';
                    }
                }
            },
            {
                field: 'price',
                caption: 'Price',
                width: 100,
                sort: true,
                editor: 'input',
                editorOptions: {
                    type: 'number',
                    min: 0,
                    step: 0.01
                },
                formatter: (value) => `$${parseFloat(value).toFixed(2)}`,
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#27ae60'
                }
            },
            {
                field: 'cost',
                caption: 'Cost',
                width: 100,
                sort: true,
                editor: 'input',
                editorOptions: {
                    type: 'number',
                    min: 0,
                    step: 0.01
                },
                formatter: (value) => `$${parseFloat(value).toFixed(2)}`,
                style: {
                    textAlign: 'right',
                    color: '#e74c3c'
                }
            },
            {
                field: 'margin',
                caption: 'Margin',
                width: 80,
                formatter: (value, record) => {
                    const margin = ((record.price - record.cost) / record.price * 100);
                    return `${margin.toFixed(1)}%`;
                },
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: (args) => {
                        const record = args.record;
                        const margin = ((record.price - record.cost) / record.price * 100);
                        return margin > 30 ? '#27ae60' : margin > 15 ? '#f39c12' : '#e74c3c';
                    }
                }
            },
            {
                field: 'stock',
                caption: 'Stock',
                width: 80,
                sort: true,
                editor: 'input',
                editorOptions: {
                    type: 'number',
                    min: 0
                },
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: (args) => {
                        const stock = args.value;
                        return stock > 50 ? '#27ae60' : stock > 10 ? '#f39c12' : '#e74c3c';
                    },
                    bgColor: (args) => {
                        const stock = args.value;
                        return stock <= 5 ? '#fdf2f2' : stock <= 20 ? '#fff8e1' : '#ffffff';
                    }
                }
            },
            {
                field: 'stockStatus',
                caption: 'Stock Status',
                width: 120,
                customRender: (args) => {
                    const stock = args.record.stock;
                    let status, color, icon;
                    
                    if (stock > 50) {
                        status = 'In Stock';
                        color = '#27ae60';
                        icon = '✓';
                    } else if (stock > 10) {
                        status = 'Low Stock';
                        color = '#f39c12';
                        icon = '⚠';
                    } else if (stock > 0) {
                        status = 'Very Low';
                        color = '#e67e22';
                        icon = '!';
                    } else {
                        status = 'Out of Stock';
                        color = '#e74c3c';
                        icon = '✗';
                    }
                    
                    return `<span style="color: ${color}; font-weight: bold;">${icon} ${status}</span>`;
                }
            },
            {
                field: 'supplier',
                caption: 'Supplier',
                width: 120,
                sort: true,
                editor: 'select',
                editorOptions: {
                    values: this.suppliers
                }
            },
            {
                field: 'rating',
                caption: 'Rating',
                width: 100,
                customRender: (args) => {
                    const rating = args.value || 0;
                    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
                    return `<span style="color: #f39c12;">${stars}</span> (${rating.toFixed(1)})`;
                }
            },
            {
                field: 'sales',
                caption: 'Units Sold',
                width: 100,
                sort: true,
                formatter: (value) => value.toLocaleString(),
                style: {
                    textAlign: 'right'
                }
            },
            {
                field: 'revenue',
                caption: 'Revenue',
                width: 120,
                formatter: (value, record) => {
                    const revenue = record.price * record.sales;
                    return `$${revenue.toLocaleString()}`;
                },
                style: {
                    textAlign: 'right',
                    fontWeight: 'bold',
                    color: '#27ae60'
                }
            },
            {
                field: 'lastUpdated',
                caption: 'Last Updated',
                width: 130,
                formatter: (value) => {
                    return new Date(value).toLocaleDateString();
                },
                style: {
                    textAlign: 'center',
                    fontSize: '12px',
                    color: '#7f8c8d'
                }
            },
            {
                field: 'actions',
                caption: 'Actions',
                width: 200,
                customRender: (args) => {
                    const { record, row } = args;
                    return `
                        <div class="action-buttons" style="display: flex; gap: 4px;">
                            <button onclick="productManager.editProduct(${row})" class="btn-edit" title="Edit">✏️</button>
                            <button onclick="productManager.duplicateProduct(${row})" class="btn-duplicate" title="Duplicate">📋</button>
                            <button onclick="productManager.viewAnalytics(${row})" class="btn-analytics" title="Analytics">📊</button>
                            <button onclick="productManager.deleteProduct(${row})" class="btn-delete" title="Delete">🗑️</button>
                        </div>
                    `;
                }
            }
        ];
        
        this.table = new VTable.ListTable({
            container: this.container,
            columns: columns,
            records: this.products,
            defaultRowHeight: 70,
            defaultHeaderRowHeight: 50,
            
            theme: {
                defaultStyle: {
                    borderColor: '#e1e8ed',
                    borderWidth: 1,
                    bgColor: '#ffffff',
                    color: '#14171a',
                    fontSize: 13,
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
                },
                headerStyle: {
                    borderColor: '#e1e8ed',
                    borderWidth: 1,
                    bgColor: '#f7f9fa',
                    color: '#536471',
                    fontSize: 13,
                    fontWeight: '600'
                }
            },
            
            select: {
                enableRowSelect: true,
                enableMultiSelect: true,
                highlightMode: 'row'
            },
            
            sort: {
                enableSort: true,
                sortMode: 'multiple'
            },
            
            edit: {
                enableCellEdit: true,
                editTrigger: 'doubleclick'
            },
            
            menu: {
                contextMenuItems: [
                    { text: 'Edit Product', menuKey: 'edit', icon: 'edit' },
                    { text: 'Duplicate Product', menuKey: 'duplicate', icon: 'copy' },
                    { text: 'Delete Product', menuKey: 'delete', icon: 'delete' },
                    { text: 'View Analytics', menuKey: 'analytics', icon: 'chart' },
                    { text: 'Export Selection', menuKey: 'export', icon: 'download' }
                ]
            }
        });
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.table.on('after_cell_edit', (event) => {
            this.handleCellEdit(event);
        });
        
        this.table.on('selection_changed', (event) => {
            this.updateBulkActionButtons(event.selectedRows);
        });
        
        this.table.on('dropdown_menu_click', (event) => {
            this.handleContextMenu(event);
        });
    }
    
    loadSampleData() {
        this.products = [
            {
                id: 1,
                sku: 'EL001',
                name: 'Wireless Bluetooth Headphones',
                description: 'Premium noise-canceling wireless headphones',
                category: 'Electronics',
                price: 199.99,
                cost: 89.99,
                stock: 45,
                supplier: 'Supplier A',
                rating: 4.5,
                sales: 1250,
                image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 2,
                sku: 'CL002',
                name: 'Cotton T-Shirt',
                description: '100% organic cotton casual t-shirt',
                category: 'Clothing',
                price: 29.99,
                cost: 12.99,
                stock: 120,
                supplier: 'Supplier B',
                rating: 4.2,
                sales: 2350,
                image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=100&h=100&fit=crop',
                lastUpdated: new Date().toISOString()
            },
            {
                id: 3,
                sku: 'BK003',
                name: 'Programming Book',
                description: 'Complete guide to modern web development',
                category: 'Books',
                price: 49.99,
                cost: 19.99,
                stock: 8,
                supplier: 'Supplier C',
                rating: 4.8,
                sales: 567,
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
                lastUpdated: new Date().toISOString()
            }
        ];
        
        this.table.updateOption({ records: this.products });
    }
    
    handleCellEdit(event) {
        const { row, field, newValue, record } = event;
        
        // Validate the edit
        if (field === 'price' && newValue <= 0) {
            this.table.updateCellValue(row, event.col, event.oldValue);
            alert('Price must be greater than 0');
            return;
        }
        
        if (field === 'stock' && newValue < 0) {
            this.table.updateCellValue(row, event.col, event.oldValue);
            alert('Stock cannot be negative');
            return;
        }
        
        // Update the record
        this.products[row] = { ...record, [field]: newValue, lastUpdated: new Date().toISOString() };
        
        // Auto-save
        this.saveProduct(this.products[row]);
    }
    
    addProduct() {
        const newProduct = {
            id: Date.now(),
            sku: `NEW${Date.now()}`,
            name: 'New Product',
            description: '',
            category: this.categories[0],
            price: 0,
            cost: 0,
            stock: 0,
            supplier: this.suppliers[0],
            rating: 0,
            sales: 0,
            image: 'https://via.placeholder.com/100x100',
            lastUpdated: new Date().toISOString()
        };
        
        this.products.push(newProduct);
        this.table.addRecord(newProduct);
    }
    
    editProduct(rowIndex) {
        const product = this.products[rowIndex];
        this.openProductModal(product, rowIndex);
    }
    
    duplicateProduct(rowIndex) {
        const product = this.products[rowIndex];
        const duplicated = {
            ...product,
            id: Date.now(),
            sku: product.sku + '_COPY',
            name: product.name + ' (Copy)',
            sales: 0
        };
        
        this.products.push(duplicated);
        this.table.addRecord(duplicated);
    }
    
    deleteProduct(rowIndex) {
        if (confirm('Are you sure you want to delete this product?')) {
            this.products.splice(rowIndex, 1);
            this.table.deleteRecord(rowIndex);
        }
    }
    
    viewAnalytics(rowIndex) {
        const product = this.products[rowIndex];
        this.showAnalyticsModal(product);
    }
    
    bulkDelete(selectedRows) {
        if (confirm(`Delete ${selectedRows.length} selected products?`)) {
            // Sort in descending order to delete from end
            selectedRows.sort((a, b) => b - a);
            
            selectedRows.forEach(rowIndex => {
                this.products.splice(rowIndex, 1);
                this.table.deleteRecord(rowIndex);
            });
        }
    }
    
    bulkUpdatePrice(selectedRows, percentage) {
        selectedRows.forEach(rowIndex => {
            const product = this.products[rowIndex];
            const newPrice = product.price * (1 + percentage / 100);
            product.price = Math.round(newPrice * 100) / 100;
            this.table.updateRecord(rowIndex, { price: product.price });
        });
    }
    
    exportProducts(selectedRows = null) {
        const dataToExport = selectedRows ? 
            selectedRows.map(i => this.products[i]) : 
            this.products;
            
        const csv = this.convertToCSV(dataToExport);
        this.downloadFile(csv, 'products.csv', 'text/csv');
    }
    
    convertToCSV(data) {
        const headers = ['sku', 'name', 'category', 'price', 'cost', 'stock', 'supplier', 'rating', 'sales'];
        const csvRows = [
            headers.join(','),
            ...data.map(product => 
                headers.map(header => {
                    let value = product[header];
                    if (typeof value === 'string' && value.includes(',')) {
                        value = `"${value.replace(/"/g, '""')}"`;
                    }
                    return value;
                }).join(',')
            )
        ];
        return csvRows.join('\n');
    }
    
    downloadFile(content, filename, contentType) {
        const blob = new Blob([content], { type: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    saveProduct(product) {
        // Simulate API call
        console.log('Saving product:', product);
        // In real app: fetch('/api/products/' + product.id, { method: 'PUT', body: JSON.stringify(product) })
    }
    
    updateBulkActionButtons(selectedRows) {
        const hasSelection = selectedRows.length > 0;
        
        // Update bulk action buttons if they exist
        const deleteBtn = document.getElementById('bulk-delete');
        const exportBtn = document.getElementById('bulk-export');
        const priceBtn = document.getElementById('bulk-price');
        
        if (deleteBtn) deleteBtn.disabled = !hasSelection;
        if (exportBtn) exportBtn.disabled = !hasSelection;
        if (priceBtn) priceBtn.disabled = !hasSelection;
    }
    
    handleContextMenu(event) {
        switch (event.menuKey) {
            case 'edit':
                this.editProduct(event.row);
                break;
            case 'duplicate':
                this.duplicateProduct(event.row);
                break;
            case 'delete':
                this.deleteProduct(event.row);
                break;
            case 'analytics':
                this.viewAnalytics(event.row);
                break;
            case 'export':
                this.exportProducts([event.row]);
                break;
        }
    }
}

// Initialize the product manager
const productManager = new EcommerceProductManager('productTable');
```

This comprehensive guide demonstrates enterprise-level VTable implementations with advanced features, real-time updates, professional styling, and complex business logic suitable for production applications.