---
category: examples
group: search
title: Search Component
cover: https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/preview/list-table.png
link: search
---

# Search Component

Search Component

## Code Demo

```javascript livedemo template=vtable
let tableInstance;
fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_data.json')
  .then(res => res.json())
  .then(data => {
    const columns = [
      {
        field: 'Order ID',
        title: 'Order ID',
        width: 'auto'
      },
      {
        field: 'Customer ID',
        title: 'Customer ID',
        width: 'auto'
      },
      {
        field: 'Product Name',
        title: 'Product Name',
        width: 'auto'
      },
      {
        field: 'Category',
        title: 'Category',
        width: 'auto'
      },
      {
        field: 'Sub-Category',
        title: 'Sub-Category',
        width: 'auto'
      },
      {
        field: 'Region',
        title: 'Region',
        width: 'auto'
      },
      {
        field: 'City',
        title: 'City',
        width: 'auto'
      },
      {
        field: 'Order Date',
        title: 'Order Date',
        width: 'auto'
      },
      {
        field: 'Quantity',
        title: 'Quantity',
        width: 'auto'
      },
      {
        field: 'Sales',
        title: 'Sales',
        width: 'auto'
      },
      {
        field: 'Profit',
        title: 'Profit',
        width: 'auto'
      }
    ];

    const option = {
      records: data,
      columns,
      widthMode: 'standard'
    };
    const dom = document.getElementById(CONTAINER_ID);
    tableInstance = new VTable.ListTable(dom, option);
    window['tableInstance'] = tableInstance;

    const search = new SearchComponent({
      table: tableInstance,
      autoJump: true
    });
    window.search = search;

    const searchContainer = document.createElement('div');
    searchContainer.style.position = 'absolute';
    searchContainer.style.top = '0';
    searchContainer.style.right = '0';
    searchContainer.style.backgroundColor = '#FFF';
    const input = document.createElement('input');
    searchContainer.appendChild(input);
    const result = document.createElement('span');
    result.innerText = '0/0';
    searchContainer.appendChild(result);
    const searchBtn = document.createElement('button');
    searchBtn.innerText = 'search';
    searchContainer.appendChild(searchBtn);
    const nextBtn = document.createElement('button');
    nextBtn.innerText = 'next';
    searchContainer.appendChild(nextBtn);
    const prevBtn = document.createElement('button');
    prevBtn.innerText = 'prev';
    searchContainer.appendChild(prevBtn);
    searchBtn.addEventListener('click', () => {
      const searchResult = search.search(input.value);
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    prevBtn.addEventListener('click', () => {
      const searchResult = search.prev();
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    nextBtn.addEventListener('click', () => {
      const searchResult = search.next();
      result.innerText =
        searchResult.results.length === 0 ? '0/0' : `${searchResult.index + 1}/${searchResult.results.length}`;
    });
    dom.appendChild(searchContainer);
  });
```
