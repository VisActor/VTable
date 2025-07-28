# Корпоративные примеры и продвинутые случаи использования

Это руководство демонстрирует корпоративные реализации VTable в реальных бизнес-сценариях, показывая продвинутые функции, сложную обработку данных и профессиональные решения.

## Финансовая торговая панель

Полная реализация торговой панели в реальном времени с обновлениями данных в режиме реального времени, продвинутой фильтрацией и профессиональным стилизованием.

```html
<!DOCTYPE html>
<html>
<head>
    <title>Financial Trading Dashboard</title>
    <script src="https://unpkg.com/@visactor/VTable@latest/build/index.min.js"></script>
    <style>
        body { шрифт-family: 'Segoe UI', sans-serif; отступ: 0; фон: #f5f6fa; }
        .dashboard { display: flex; высота: 100vh; }
        .sidebar { ширина: 300px; фон: #2c3e50; цвет: white; заполнение: 20px; }
        .main-content { flex: 1; заполнение: 20px; }
        .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; отступ-низ: 20px; }
        .metric-card { фон: white; заполнение: 20px; граница-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .metric-значение { шрифт-размер: 2em; шрифт-weight: bold; цвет: #27ae60; }
        .metric-label { цвет: #7f8c8d; шрифт-размер: 0.9em; }
        .table-container { фон: white; граница-radius: 8px; заполнение: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .toolbar { display: flex; justify-content: space-between; align-items: центр; отступ-низ: 20px; }
        .btn { заполнение: 8px 16px; граница: никто; граница-radius: 4px; cursor: pointer; шрифт-размер: 14px; }
        .btn-primary { фон: #3498db; цвет: white; }
        .btn-успех { фон: #27ae60; цвет: white; }
        .btn-danger { фон: #e74c3c; цвет: white; }
        .status-indicator { display: inline-block; ширина: 8px; высота: 8px; граница-radius: 50%; отступ-право: 8px; }
        .status-up { фон: #27ae60; }
        .status-down { фон: #e74c3c; }
        .status-neutral { фон: #f39c12; }
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
                    <выбрать id="marketFilter">
                        <option значение="">все Markets</option>
                        <option значение="NYSE">NYSE</option>
                        <option значение="NASDAQ">NASDAQ</option>
                        <option значение="LSE">LSE</option>
                    </выбрать>
                </div>
                <div>
                    <label>Sector:</label>
                    <выбрать id="sectorFilter">
                        <option значение="">все Sectors</option>
                        <option значение="Technology">Technology</option>
                        <option значение="Finance">Finance</option>
                        <option значение="Healthcare">Healthcare</option>
                        <option значение="Energy">Energy</option>
                    </выбрать>
                </div>
                <div>
                    <label>Min Volume:</label>
                    <ввод тип="число" id="volumeFilter" placeholder="0">
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
                    <div class="metric-значение" id="totalValue">$2.4M</div>
                    <div class="metric-label">Portfolio значение</div>
                </div>
                <div class="metric-card">
                    <div class="metric-значение" id="dayChange">+$12.5K</div>
                    <div class="metric-label">Day Change</div>
                </div>
                <div class="metric-card">
                    <div class="metric-значение" id="activePositions">47</div>
                    <div class="metric-label">активный Positions</div>
                </div>
                <div class="metric-card">
                    <div class="metric-значение" id="volumeTraded">1.2M</div>
                    <div class="metric-label">Volume Traded</div>
                </div>
            </div>
            
            <div class="table-container">
                <div class="toolbar">
                    <h3>Live Market Data</h3>
                    <div>
                        <кнопка class="btn btn-primary" onclick="refreshData()">Refresh</кнопка>
                        <кнопка class="btn btn-успех" onclick="exportData()">Export</кнопка>
                        <кнопка class="btn btn-danger" onclick="clearAlerts()">Clear Alerts</кнопка>
                    </div>
                </div>
                <div id="tradingTable" style="высота: 500px;"></div>
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
                    { symbol: 'BAC', name: 'Bank из America', market: 'NYSE', sector: 'Finance', price: 42.80, volume: 38920000 },
                    { symbol: 'JNJ', name: 'Johnson & Johnson', market: 'NYSE', sector: 'Healthcare', price: 165.30, volume: 8760000 },
                    { symbol: 'PFE', name: 'Pfizer Inc.', market: 'NYSE', sector: 'Healthcare', price: 45.90, volume: 24680000 },
                ];
                
                this.updateInterval = null;
            }
            
            generateRealTimeData() {
                возврат this.stocks.map(stock => {
                    const change = (Math.random() - 0.5) * 10;
                    const changePercent = (change / stock.price) * 100;
                    const newPrice = Math.max(0.01, stock.price + change);
                    
                    stock.price = newPrice;
                    stock.volume += Math.floor(Math.random() * 100000);
                    
                    возврат {
                        ...stock,
                        price: parseFloat(newPrice.toFixed(2)),
                        change: parseFloat(change.toFixed(2)),
                        changePercent: parseFloat(changePercent.toFixed(2)),
                        volume: stock.volume,
                        marketCap: parseFloat((newPrice * 1000000000).toFixed(0)),
                        lastUpdate: новый Date().toLocaleTimeString(),
                        trend: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
                        high52w: parseFloat((newPrice * (1 + Math.random() * 0.5)).toFixed(2)),
                        low52w: parseFloat((newPrice * (1 - Math.random() * 0.3)).toFixed(2)),
                        pe: parseFloat((15 + Math.random() * 20).toFixed(2)),
                        dividend: parseFloat((Math.random() * 3).toFixed(2))
                    };
                });
            }
            
            startRealTimeUpdates(обратный вызов) {
                this.updateInterval = setInterval(() => {
                    обратный вызов(this.generateRealTimeData());
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
        const marketSim = новый MarketDataSimulator();
        let tradingTable;
        
        // Table configuration
        const columns = [
            {
                field: 'symbol',
                caption: 'Symbol',
                ширина: 100,
                style: {
                    fontWeight: 'bold',
                    цвет: '#2c3e50'
                },
                customRender: (args) => {
                    const { значение, record } = args;
                    возврат `<div style="display: flex; align-items: центр;">
                        <span class="status-indicator status-${record.trend}"></span>
                        <strong>${значение}</strong>
                    </div>`;
                }
            },
            {
                field: 'name',
                caption: 'Company Name',
                ширина: 200,
                style: {
                    textAlign: 'лево'
                }
            },
            {
                field: 'price',
                caption: 'Price',
                ширина: 120,
                formatter: (значение) => `$${значение.toFixed(2)}`,
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold'
                }
            },
            {
                field: 'change',
                caption: 'Change',
                ширина: 100,
                formatter: (значение) => `${значение >= 0 ? '+' : ''}${значение.toFixed(2)}`,
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: (args) => {
                        const значение = args.значение;
                        возврат значение > 0 ? '#27ae60' : значение < 0 ? '#e74c3c' : '#7f8c8d';
                    }
                }
            },
            {
                field: 'changePercent',
                caption: 'Change %',
                ширина: 100,
                formatter: (значение) => `${значение >= 0 ? '+' : ''}${значение.toFixed(2)}%`,
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: (args) => {
                        const значение = args.значение;
                        возврат значение > 0 ? '#27ae60' : значение < 0 ? '#e74c3c' : '#7f8c8d';
                    },
                    bgColor: (args) => {
                        const значение = args.значение;
                        возврат значение > 2 ? '#d5f4e6' : значение < -2 ? '#fdf2f2' : '#ffffff';
                    }
                }
            },
            {
                field: 'volume',
                caption: 'Volume',
                ширина: 120,
                formatter: (значение) => {
                    if (значение >= 1000000) {
                        возврат `${(значение / 1000000).toFixed(1)}M`;
                    }
                    возврат `${(значение / 1000).toFixed(0)}K`;
                },
                style: {
                    textAlign: 'право'
                }
            },
            {
                field: 'marketCap',
                caption: 'Market Cap',
                ширина: 130,
                formatter: (значение) => {
                    if (значение >= 1000000000000) {
                        возврат `$${(значение / 1000000000000).toFixed(2)}T`;
                    } else if (значение >= 1000000000) {
                        возврат `$${(значение / 1000000000).toFixed(2)}B`;
                    }
                    возврат `$${(значение / 1000000).toFixed(2)}M`;
                },
                style: {
                    textAlign: 'право'
                }
            },
            {
                field: 'pe',
                caption: 'P/E Ratio',
                ширина: 100,
                formatter: (значение) => значение.toFixed(2),
                style: {
                    textAlign: 'право'
                }
            },
            {
                field: 'dividend',
                caption: 'Dividend',
                ширина: 100,
                formatter: (значение) => `${значение.toFixed(2)}%`,
                style: {
                    textAlign: 'право'
                }
            },
            {
                field: 'lastUpdate',
                caption: 'последний Update',
                ширина: 120,
                style: {
                    textAlign: 'центр',
                    fontSize: '12px',
                    цвет: '#7f8c8d'
                }
            },
            {
                field: 'actions',
                caption: 'Actions',
                ширина: 150,
                customRender: (args) => {
                    const { record } = args;
                    возврат `
                        <div style="display: flex; gap: 4px;">
                            <кнопка onclick="buyStock('${record.symbol}')" style="заполнение: 2px 8px; фон: #27ae60; цвет: white; граница: никто; граница-radius: 3px; cursor: pointer;">Buy</кнопка>
                            <кнопка onclick="sellStock('${record.symbol}')" style="заполнение: 2px 8px; фон: #e74c3c; цвет: white; граница: никто; граница-radius: 3px; cursor: pointer;">Sell</кнопка>
                            <кнопка onclick="addToWatchlist('${record.symbol}')" style="заполнение: 2px 8px; фон: #3498db; цвет: white; граница: никто; граница-radius: 3px; cursor: pointer;">Watch</кнопка>
                        </div>
                    `;
                }
            }
        ];
        
        // Initialize table
        функция initializeTable() {
            const initialData = marketSim.generateRealTimeData();
            
            tradingTable = новый VTable.ListTable({
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
                        цвет: '#14171a',
                        fontSize: 13,
                        fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
                    },
                    headerStyle: {
                        borderColor: '#e1e8ed',
                        borderWidth: 1,
                        bgColor: '#f7f9fa',
                        цвет: '#536471',
                        fontSize: 13,
                        fontWeight: '600'
                    },
                    frameStyle: {
                        borderColor: '#cfd9de',
                        borderWidth: 1,
                        cornerRadius: 8
                    }
                },
                
                выбрать: {
                    enableRowSelect: true,
                    enableMultiSelect: true,
                    highlightMode: 'row'
                },
                
                sort: {
                    enableSort: true,
                    sortMode: 'multiple'
                },
                
                прокрутка: {
                    enableHorizontalScroll: true,
                    enableVerticalScroll: true
                },
                
                animationAppear: {
                    duration: 300,
                    easing: 'ease-out'
                }
            });
            
            // Add event listeners
            tradingTable.на('click_cell', (event) => {
                if (event.field === 'symbol') {
                    showStockDetails(event.record);
                }
            });
            
            tradingTable.на('selection_changed', (event) => {
                updateMetrics(event.selectedRows);
            });
            
            // начало real-time updates
            marketSim.startRealTimeUpdates((newData) => {
                updateTableData(newData);
                updateDashboardMetrics(newData);
            });
        }
        
        // Update table data
        функция updateTableData(newData) {
            tradingTable.updateOption({ records: newData });
        }
        
        // Update dashboard metrics
        функция updateDashboardMetrics(data) {
            const totalValue = data.reduce((sum, stock) => sum + (stock.price * 1000), 0);
            const totalChange = data.reduce((sum, stock) => sum + (stock.change * 1000), 0);
            const totalVolume = data.reduce((sum, stock) => sum + stock.volume, 0);
            
            document.getElementById('totalValue').textContent = `$${(totalValue / 1000000).toFixed(1)}M`;
            document.getElementById('dayChange').textContent = `${totalChange >= 0 ? '+' : ''}$${(totalChange / 1000).toFixed(1)}K`;
            document.getElementById('activePositions').textContent = data.length;
            document.getElementById('volumeTraded').textContent = `${(totalVolume / 1000000).toFixed(1)}M`;
            
            // Update change цвет
            const changeElement = document.getElementById('dayChange');
            changeElement.style.цвет = totalChange >= 0 ? '#27ae60' : '#e74c3c';
        }
        
        // Stock actions
        функция buyStock(symbol) {
            console.log(`Buy order placed для ${symbol}`);
            предупреждение(`Buy order placed для ${symbol}`);
        }
        
        функция sellStock(symbol) {
            console.log(`Sell order placed для ${symbol}`);
            предупреждение(`Sell order placed для ${symbol}`);
        }
        
        функция addToWatchlist(symbol) {
            console.log(`${symbol} added к watchlist`);
            const watchlistItems = document.getElementById('watchlistItems');
            const item = document.createElement('div');
            item.innerHTML = `<div style="заполнение: 4px 0; граница-низ: 1px solid #34495e;">${symbol}</div>`;
            watchlistItems.appendChild(item);
        }
        
        функция showStockDetails(stock) {
            const details = `
                Stock: ${stock.name} (${stock.symbol})
                текущий Price: $${stock.price}
                Change: ${stock.change >= 0 ? '+' : ''}${stock.change} (${stock.changePercent}%)
                Volume: ${stock.volume.toLocaleString()}
                Market Cap: ${stock.marketCap}
                P/E Ratio: ${stock.pe}
                52W High: $${stock.high52w}
                52W Low: $${stock.low52w}
            `;
            предупреждение(details);
        }
        
        // Toolbar functions
        функция refreshData() {
            const newData = marketSim.generateRealTimeData();
            updateTableData(newData);
            updateDashboardMetrics(newData);
        }
        
        функция exportData() {
            const data = tradingTable.getAllRecords();
            const csv = convertToCSV(data);
            downloadFile(csv, 'trading-data.csv', 'текст/csv');
        }
        
        функция clearAlerts() {
            console.log('Alerts cleared');
        }
        
        // Utility functions
        функция convertToCSV(data) {
            const headers = объект.keys(data[0]).filter(key => key !== 'actions');
            const csvRows = [
                headers.join(','),
                ...data.map(row => 
                    headers.map(header => {
                        let значение = row[header];
                        if (typeof значение === 'строка' && значение.includes(',')) {
                            значение = `"${значение.replace(/"/g, '""')}"`;
                        }
                        возврат значение;
                    }).join(',')
                )
            ];
            возврат csvRows.join('\n');
        }
        
        функция downloadFile(content, filename, contentType) {
            const blob = новый Blob([content], { тип: contentType });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.нажать();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        // Initialize the dashboard
        document.addEventListener('DOMContentLoaded', initializeTable);
        
        // Cleanup на page unload
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

Advanced product catalog management с inventory tracking, bulk operations, и real-time updates.

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
                field: 'выбрать',
                caption: '',
                ширина: 50,
                cellType: 'флажок',
                headerType: 'флажок',
                style: {
                    textAlign: 'центр'
                }
            },
            {
                field: 'image',
                caption: 'Image',
                ширина: 80,
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
                ширина: 120,
                sort: true,
                style: {
                    fontFamily: 'monospace',
                    fontWeight: 'bold'
                }
            },
            {
                field: 'name',
                caption: 'Product Name',
                ширина: 250,
                sort: true,
                editor: 'ввод',
                validation: {
                    обязательный: true,
                    minLength: 3,
                    maxLength: 100
                },
                customRender: (args) => {
                    const { значение, record } = args;
                    возврат `
                        <div style="line-высота: 1.4;">
                            <div style="шрифт-weight: bold; цвет: #2c3e50;">${значение}</div>
                            <div style="шрифт-размер: 12px; цвет: #7f8c8d;">${record.description || 'No description'}</div>
                        </div>
                    `;
                }
            },
            {
                field: 'category',
                caption: 'Category',
                ширина: 130,
                sort: true,
                editor: 'выбрать',
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
                        возврат categoryColors[args.значение] || '#ffffff';
                    }
                }
            },
            {
                field: 'price',
                caption: 'Price',
                ширина: 100,
                sort: true,
                editor: 'ввод',
                editorOptions: {
                    тип: 'число',
                    min: 0,
                    step: 0.01
                },
                formatter: (значение) => `$${parseFloat(значение).toFixed(2)}`,
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: '#27ae60'
                }
            },
            {
                field: 'cost',
                caption: 'Cost',
                ширина: 100,
                sort: true,
                editor: 'ввод',
                editorOptions: {
                    тип: 'число',
                    min: 0,
                    step: 0.01
                },
                formatter: (значение) => `$${parseFloat(значение).toFixed(2)}`,
                style: {
                    textAlign: 'право',
                    цвет: '#e74c3c'
                }
            },
            {
                field: 'отступ',
                caption: 'отступ',
                ширина: 80,
                formatter: (значение, record) => {
                    const отступ = ((record.price - record.cost) / record.price * 100);
                    возврат `${отступ.toFixed(1)}%`;
                },
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: (args) => {
                        const record = args.record;
                        const отступ = ((record.price - record.cost) / record.price * 100);
                        возврат отступ > 30 ? '#27ae60' : отступ > 15 ? '#f39c12' : '#e74c3c';
                    }
                }
            },
            {
                field: 'stock',
                caption: 'Stock',
                ширина: 80,
                sort: true,
                editor: 'ввод',
                editorOptions: {
                    тип: 'число',
                    min: 0
                },
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: (args) => {
                        const stock = args.значение;
                        возврат stock > 50 ? '#27ae60' : stock > 10 ? '#f39c12' : '#e74c3c';
                    },
                    bgColor: (args) => {
                        const stock = args.значение;
                        возврат stock <= 5 ? '#fdf2f2' : stock <= 20 ? '#fff8e1' : '#ffffff';
                    }
                }
            },
            {
                field: 'stockStatus',
                caption: 'Stock Status',
                ширина: 120,
                customRender: (args) => {
                    const stock = args.record.stock;
                    let status, цвет, icon;
                    
                    if (stock > 50) {
                        status = 'в Stock';
                        цвет = '#27ae60';
                        icon = '✓';
                    } else if (stock > 10) {
                        status = 'Low Stock';
                        цвет = '#f39c12';
                        icon = '⚠';
                    } else if (stock > 0) {
                        status = 'Very Low';
                        цвет = '#e67e22';
                        icon = '!';
                    } else {
                        status = 'Out из Stock';
                        цвет = '#e74c3c';
                        icon = '✗';
                    }
                    
                    возврат `<span style="цвет: ${цвет}; шрифт-weight: bold;">${icon} ${status}</span>`;
                }
            },
            {
                field: 'supplier',
                caption: 'Supplier',
                ширина: 120,
                sort: true,
                editor: 'выбрать',
                editorOptions: {
                    values: this.suppliers
                }
            },
            {
                field: 'rating',
                caption: 'Rating',
                ширина: 100,
                customRender: (args) => {
                    const rating = args.значение || 0;
                    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
                    возврат `<span style="цвет: #f39c12;">${stars}</span> (${rating.toFixed(1)})`;
                }
            },
            {
                field: 'sales',
                caption: 'Units Sold',
                ширина: 100,
                sort: true,
                formatter: (значение) => значение.toLocaleString(),
                style: {
                    textAlign: 'право'
                }
            },
            {
                field: 'revenue',
                caption: 'Revenue',
                ширина: 120,
                formatter: (значение, record) => {
                    const revenue = record.price * record.sales;
                    возврат `$${revenue.toLocaleString()}`;
                },
                style: {
                    textAlign: 'право',
                    fontWeight: 'bold',
                    цвет: '#27ae60'
                }
            },
            {
                field: 'lastUpdated',
                caption: 'последний Updated',
                ширина: 130,
                formatter: (значение) => {
                    возврат новый Date(значение).toLocaleDateString();
                },
                style: {
                    textAlign: 'центр',
                    fontSize: '12px',
                    цвет: '#7f8c8d'
                }
            },
            {
                field: 'actions',
                caption: 'Actions',
                ширина: 200,
                customRender: (args) => {
                    const { record, row } = args;
                    возврат `
                        <div class="action-buttons" style="display: flex; gap: 4px;">
                            <кнопка onclick="productManager.editProduct(${row})" class="btn-edit" title="Edit">✏️</кнопка>
                            <кнопка onclick="productManager.duplicateProduct(${row})" class="btn-duplicate" title="Duplicate">📋</кнопка>
                            <кнопка onclick="productManager.viewAnalytics(${row})" class="btn-analytics" title="Analytics">📊</кнопка>
                            <кнопка onclick="productManager.deleteProduct(${row})" class="btn-delete" title="Delete">🗑️</кнопка>
                        </div>
                    `;
                }
            }
        ];
        
        this.table = новый VTable.ListTable({
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
                    цвет: '#14171a',
                    fontSize: 13,
                    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif'
                },
                headerStyle: {
                    borderColor: '#e1e8ed',
                    borderWidth: 1,
                    bgColor: '#f7f9fa',
                    цвет: '#536471',
                    fontSize: 13,
                    fontWeight: '600'
                }
            },
            
            выбрать: {
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
                    { текст: 'Edit Product', menuKey: 'edit', icon: 'edit' },
                    { текст: 'Duplicate Product', menuKey: 'duplicate', icon: 'copy' },
                    { текст: 'Delete Product', menuKey: 'delete', icon: 'delete' },
                    { текст: 'View Analytics', menuKey: 'analytics', icon: 'chart' },
                    { текст: 'Export Selection', menuKey: 'export', icon: 'download' }
                ]
            }
        });
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.table.на('after_cell_edit', (event) => {
            this.handleCellEdit(event);
        });
        
        this.table.на('selection_changed', (event) => {
            this.updateBulkActionButtons(event.selectedRows);
        });
        
        this.table.на('dropdown_menu_click', (event) => {
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
                lastUpdated: новый Date().toISOString()
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
                lastUpdated: новый Date().toISOString()
            },
            {
                id: 3,
                sku: 'BK003',
                name: 'Programming Book',
                description: 'Complete guide к modern web development',
                category: 'Books',
                price: 49.99,
                cost: 19.99,
                stock: 8,
                supplier: 'Supplier C',
                rating: 4.8,
                sales: 567,
                image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=100&h=100&fit=crop',
                lastUpdated: новый Date().toISOString()
            }
        ];
        
        this.table.updateOption({ records: this.products });
    }
    
    handleCellEdit(event) {
        const { row, field, newValue, record } = event;
        
        // Validate the edit
        if (field === 'price' && newValue <= 0) {
            this.table.updateCellValue(row, event.col, event.oldValue);
            предупреждение('Price must be greater than 0');
            возврат;
        }
        
        if (field === 'stock' && newValue < 0) {
            this.table.updateCellValue(row, event.col, event.oldValue);
            предупреждение('Stock cannot be negative');
            возврат;
        }
        
        // Update the record
        this.products[row] = { ...record, [field]: newValue, lastUpdated: новый Date().toISOString() };
        
        // Auto-save
        this.saveProduct(this.products[row]);
    }
    
    addProduct() {
        const newProduct = {
            id: Date.now(),
            sku: `новый${Date.now()}`,
            name: 'новый Product',
            description: '',
            category: this.categories[0],
            price: 0,
            cost: 0,
            stock: 0,
            supplier: this.suppliers[0],
            rating: 0,
            sales: 0,
            image: 'https://via.placeholder.com/100x100',
            lastUpdated: новый Date().toISOString()
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
        if (confirm('Are you sure you want к delete this product?')) {
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
            // Sort в descending order к delete от конец
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
        this.downloadFile(csv, 'products.csv', 'текст/csv');
    }
    
    convertToCSV(data) {
        const headers = ['sku', 'name', 'category', 'price', 'cost', 'stock', 'supplier', 'rating', 'sales'];
        const csvRows = [
            headers.join(','),
            ...data.map(product => 
                headers.map(header => {
                    let значение = product[header];
                    if (typeof значение === 'строка' && значение.includes(',')) {
                        значение = `"${значение.replace(/"/g, '""')}"`;
                    }
                    возврат значение;
                }).join(',')
            )
        ];
        возврат csvRows.join('\n');
    }
    
    downloadFile(content, filename, contentType) {
        const blob = новый Blob([content], { тип: contentType });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.нажать();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
    
    saveProduct(product) {
        // Simulate API call
        console.log('Saving product:', product);
        // в real app: fetch('/api/products/' + product.id, { method: 'PUT', body: JSON.stringify(product) })
    }
    
    updateBulkActionButtons(selectedRows) {
        const hasSelection = selectedRows.length > 0;
        
        // Update bulk action buttons if they exist
        const deleteBtn = document.getElementById('bulk-delete');
        const exportBtn = document.getElementById('bulk-export');
        const priceBtn = document.getElementById('bulk-price');
        
        if (deleteBtn) deleteBtn.отключен = !hasSelection;
        if (exportBtn) exportBtn.отключен = !hasSelection;
        if (priceBtn) priceBtn.отключен = !hasSelection;
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
const productManager = новый EcommerceProductManager('productTable');
```

This comprehensive guide demonstrates enterprise-level VTable implementations с advanced features, real-time updates, professional styling, и complex business logic suitable для production applications.