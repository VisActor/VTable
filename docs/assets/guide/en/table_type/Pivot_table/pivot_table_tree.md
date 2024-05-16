## Pivot table tree structure

By default, the row headers of a pivot table are displayed tiled. If the row headers contain multiple levels, it may be difficult to see the relationship between the different levels. The pivot table tree structure displays functions that can help you better manage and analyze data. It has the following advantages:

- Clear structure: The tree structure manages the data hierarchically, making the relationship between the data more clear;
- Easy to analyze: The nodes of the tree structure can be expanded and folded freely, which is convenient for users to perform data analytics for different levels;

## configuration item

The main configuration parameters displayed by the pivot table tree structure:

- indicatorsAsCol: Whether the indicator is displayed as the column header. The default is true. Note: Under the tree display setting, only true is supported here, that is, the indicator must be displayed as columns;
- rowHierarchyType: Set the display form of the row header hierarchy Dimension structure, and set it to'tree 'to realize tree display;
- rowExpandLevel: Set the default Expand level;
- rowHierarchyIndent: Sets the indent distance of the child-level Dimension value compared to the position of the parent-level Dimension value in the cell.
- rowHierarchyTextStartAlignment: whether the nodes at the same level are aligned as text, such as the text of the nodes without collapse and expansion icons is aligned with the text of the nodes with icons. The default value is false.
- HierarchyState: Sets the collapsed state of the node, which is configured in the node of rowTree or columnTree.
- extensionRows: special tree structure display, set this tree when you need to display a multi-column tree structure. have to be aware of is:
  - rowExpandLevel only works on the outer main tree rowTree, and does not take effect on the trees in extensionRows.
  - For this kind of multi-column tree structure, the ability to drag and move the header is not supported.
  - After updateOption is called, maintenance of the collapsed and expanded state of non-rowTree nodes is not supported.

## Basic usage example

Let's configure the key parameters of the pivot table tree display one by one:

1.  First set rowHierarchyType to'tree ', indicating that the row header adopts a tree structure;
2.  Set rowExpandLevel to 2, indicating that the default Expand is two layers;
3.  Set rowHierarchyIndent to 20, which means that the indent distance of each layer is 20 pixels;
4.  If there are special node status requirements, you can set the hierarchyState of a node attribute in rowTree to'expand 'or'collapse'.

Then, the following is the complete configuration example code and effects:

```javascript livedemo   template=vtable
const data = [
  {
    10002: '36004.12287902832',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '36004.12287902832',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1646.5089945793152',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1646.5089945793152',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Bookcases'
  },
  {
    10002: '10899.361869812012',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '10899.361869812012',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '1339.4909970760345',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1339.4909970760345',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Bookcases'
  },
  {
    10002: '24157.178108215332',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '24157.178108215332',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1997.9050402641296',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1997.9050402641296',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Bookcases'
  },
  {
    10002: '43819.33399963379',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43819.33399963379',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '-1167.6339691877365',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-1167.6339691877365',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Bookcases'
  },
  {
    10002: '101781.32774353027',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '101781.32774353027',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '4027.58094894886',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '4027.58094894886',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Chairs'
  },
  {
    10002: '45176.44617843628',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '45176.44617843628',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '6612.087041854858',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6612.087041854858',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Chairs'
  },
  {
    10002: '85230.64583206177',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '85230.64583206177',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '6592.718985438347',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '6592.718985438347',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Chairs'
  },
  {
    10002: '96260.68257522583',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '96260.68257522583',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '9357.765951037407',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '9357.765951037407',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Chairs'
  },
  {
    10002: '30072.729959964752',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '30072.729959964752',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '7641.274031370878',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '7641.274031370878',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Furnishings'
  },
  {
    10002: '17306.68389749527',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '17306.68389749527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '3442.686985105276',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '3442.686985105276',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Furnishings'
  },
  {
    10002: '15254.369949698448',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '15254.369949698448',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '-3906.223020374775',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3906.223020374775',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Furnishings'
  },
  {
    10002: '29071.379935264587',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '29071.379935264587',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '5881.414980173111',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '5881.414980173111',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Furnishings'
  },
  {
    10002: '84754.5619468689',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '84754.5619468689',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '1482.6120259165764',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '1482.6120259165764',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Tables'
  },
  {
    10002: '43916.19310760498',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '43916.19310760498',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '-4623.056034088135',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-4623.056034088135',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Tables'
  },
  {
    10002: '39154.970703125',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39154.970703125',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '-3559.6519879102707',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-3559.6519879102707',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Tables'
  },
  {
    10002: '39139.806856155396',
    10003: '230627170530019',
    230627170530016: 'Furniture',
    230627170530019: '39139.806856155396',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '-11025.375987529755',
    10003: '230627170530022',
    230627170530016: 'Furniture',
    230627170530022: '-11025.375987529755',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Tables'
  },
  {
    10002: '30236.3359644413',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '30236.3359644413',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '8261.27197098732',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8261.27197098732',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Appliances'
  },
  {
    10002: '19525.326094150543',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '19525.326094150543',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '4123.939019560814',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '4123.939019560814',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Appliances'
  },
  {
    10002: '23582.032926678658',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '23582.032926678658',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '-2638.6159623861313',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-2638.6159623861313',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Appliances'
  },
  {
    10002: '34188.466317892075',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '34188.466317892075',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '8391.413984239101',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '8391.413984239101',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Appliances'
  },
  {
    10002: '9212.066044569016',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '9212.066044569016',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '2374.101003214717',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2374.101003214717',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Art'
  },
  {
    10002: '4655.6219692230225',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4655.6219692230225',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '1058.5850008130074',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1058.5850008130074',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Art'
  },
  {
    10002: '5765.340019583702',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5765.340019583702',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '1195.1630011796951',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1195.1630011796951',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Art'
  },
  {
    10002: '7485.764034986496',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '7485.764034986496',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '1899.942004531622',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1899.942004531622',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Art'
  },
  {
    10002: '55961.11282122135',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '55961.11282122135',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '16096.799980849028',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '16096.799980849028',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Binders'
  },
  {
    10002: '37030.34099626541',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '37030.34099626541',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '3900.6622482538223',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '3900.6622482538223',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Binders'
  },
  {
    10002: '56923.28208118677',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '56923.28208118677',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '-1043.632896721363',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '-1043.632896721363',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Binders'
  },
  {
    10002: '53497.99653959274',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '53497.99653959274',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '11267.932148218155',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '11267.932148218155',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Binders'
  },
  {
    10002: '4118.099995136261',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4118.099995136261',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1908.761996269226',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1908.761996269226',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Envelopes'
  },
  {
    10002: '3345.555993080139',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '3345.555993080139',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1465.4750101566315',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1465.4750101566315',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4636.871988296509',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4636.871988296509',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1777.5259877443314',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1777.5259877443314',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Envelopes'
  },
  {
    10002: '4375.874011039734',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '4375.874011039734',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '1812.4089943170547',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1812.4089943170547',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Envelopes'
  },
  {
    10002: '923.2159950733185',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '923.2159950733185',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '275.19199895858765',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '275.19199895858765',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Fasteners'
  },
  {
    10002: '503.3160014152527',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '503.3160014152527',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '173.71899946779013',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '173.71899946779013',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Fasteners'
  },
  {
    10002: '778.0299946069717',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '778.0299946069717',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '236.6199992671609',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '236.6199992671609',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Fasteners'
  },
  {
    10002: '819.7179999351501',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '819.7179999351501',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '263.98999811708927',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '263.98999811708927',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Fasteners'
  },
  {
    10002: '5078.726016759872',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '5078.726016759872',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2303.1279985904694',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '2303.1279985904694',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Labels'
  },
  {
    10002: '2353.179967880249',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2353.179967880249',
    230627170530056: 'Sales',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '1040.771997153759',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1040.771997153759',
    230627170530056: 'Profit',
    230627170530059: 'South',
    230627170530068: 'Labels'
  },
  {
    10002: '2451.4719779491425',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2451.4719779491425',
    230627170530056: 'Sales',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '1073.0799936652184',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1073.0799936652184',
    230627170530056: 'Profit',
    230627170530059: 'Central',
    230627170530068: 'Labels'
  },
  {
    10002: '2602.934000492096',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '2602.934000492096',
    230627170530056: 'Sales',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '1129.2839995622635',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '1129.2839995622635',
    230627170530056: 'Profit',
    230627170530059: 'East',
    230627170530068: 'Labels'
  },
  {
    10002: '26663.717969417572',
    10003: '230627170530019',
    230627170530016: 'Office Supplies',
    230627170530019: '26663.717969417572',
    230627170530056: 'Sales',
    230627170530059: 'West',
    230627170530068: 'Paper'
  },
  {
    10002: '12119.230026364326',
    10003: '230627170530022',
    230627170530016: 'Office Supplies',
    230627170530022: '12119.230026364326',
    230627170530056: 'Profit',
    230627170530059: 'West',
    230627170530068: 'Paper'
  }
];
const option = {
  container: document.getElementById(CONTAINER_ID),
  records: data,
  rowTree: [
    {
      dimensionKey: '230627170530016',
      value: 'Furniture',
      hierarchyState: 'expand',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Bookcases',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Chairs',
          hierarchyState: 'collapse'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Furnishings'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Tables'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Office Supplies',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Appliances'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Art'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Binders'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Envelopes'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Fasteners'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Labels'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Paper'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Storage'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Supplies'
        }
      ]
    },
    {
      dimensionKey: '230627170530016',
      value: 'Technology',
      children: [
        {
          dimensionKey: '230627170530068',
          value: 'Accessories'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Copiers'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Machines'
        },
        {
          dimensionKey: '230627170530068',
          value: 'Phones'
        }
      ]
    }
  ],
  columnTree: [
    {
      dimensionKey: '230627170530059',
      value: 'West',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'South',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'Central',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    },
    {
      dimensionKey: '230627170530059',
      value: 'East',
      children: [
        {
          dimensionKey: '230627170530056',
          value: 'Sales',
          indicatorKey: '230627170530019'
        },
        {
          dimensionKey: '230627170530056',
          value: 'Profit',
          indicatorKey: '230627170530022'
        }
      ]
    }
  ],
  rows: [
    {
      dimensionKey: '230627170530016',
      title: 'Catogery',
      width: 'auto'
    },
    {
      dimensionKey: '230627170530068',
      title: 'Sub-Catogery',
      width: 'auto'
    }
  ],
  columns: [
    {
      dimensionKey: '230627170530059',
      title: 'Region',
      headerStyle: {
        textStick: true
      },
      width: 'auto'
    }
  ],
  indicators: [
    {
      indicatorKey: '230627170530019',
      title: 'Sales',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    },
    {
      indicatorKey: '230627170530022',
      title: 'Profit',
      width: 'auto',
      showSort: false,
      headerStyle: {
        fontWeight: 'normal'
      },
      format: value => {
        if (value) return '$' + Number(value).toFixed(2);
        return '';
      },
      style: {
        padding: [16, 28, 16, 28],
        color(args) {
          if (args.dataValue >= 0) return 'black';
          return 'red';
        }
      }
    }
  ],
  corner: {
    titleOnDimension: 'row',
    headerStyle: {
      textStick: true
    }
  },
  rowHierarchyType: 'tree',
  widthMode: 'standard',
  rowHierarchyIndent: 20,
  rowHierarchyTextStartAlignment: true
};
const tableInstance = new VTable.PivotTable(option);
```

It can be seen that the pivot table tree structure display function can clearly present the hierarchical relationship of data, which is convenient for users to perform data analytics.

## Specify the collapse or expansion state of a node in the table header

In the above example, you can set the `hierarchyState` of the data node to specify the collapsed or expanded state of the node, and its value is `expand` or `collapse`.

For example, to specify a node in rowTree as expanded, you can use hierarchyState: 'expand'.

```javascript
const option = {
  rowTree: [
    {
      dimensionKey: '230627170530016',
      value: 'Furniture',
      hierarchyState: 'expand',
      children: [
        // ...
      ]
    }
  ]
};
```

## Subnode data lazy loading usage

If you do not want to provide all data at initialization, but want to load data when the node is expanded, you can use it as follows.

**Limitation: Lazy loading currently only supports custom header structures. For custom header structures, please refer to: https://visactor.io/vtable/guide/table_type/Pivot_table/custom_header**

There are two important working points for lazy loading:

1. Organize `rowTree` and `columnTree`. If lazy loading is required, the `children` attribute value is `true`, otherwise it is an array child node.

as follows:

```javascript
rowTree: [
  {
    dimensionKey: 'region',
    value: 'Central South',
    children: true
  },
  {
    dimensionKey: 'region',
    value: 'East China',
    children: true
  }
];
```

2. In the `tree_hierarchy_state_change` event callback, request data based on the currently expanded node, and set it to the `children` property of the corresponding node in the current `rowTree` through the `setTreeNodeChildren` interface, And add the indicator data records to the table.

```javascript
tableInstance.on(tree_hierarchy_state_change, args => {
  if (args.hierarchyState === VTable.TYPES.HierarchyState.expand && args.originData.children === true) {
    tableInstance.setTreeNodeChildren(newChildren, newData, args.col, args.row);
  }
});
```

For specific demo, please refer to: https://visactor.io/vtable/demo/table-type/pivot-table-tree-lazy-load

## Multi-columns tree structure configuration code example

A common requirement for pivot tables is a one-layer tree structure, but some special businesses want a multi-layer structure to present data, such as the desire to see the sales of different regions under different categories.

Key Configurations items:

```
    extensionRows: [
      //The expanded row header dimension group, because it may be expanded to multiple, so here is an array form
      {
        rows: [
          {
            dimensionKey: 'region',
            title: 'region',
            headerStyle: { color: 'red', textStick: true },
            width: '200'
          },
          { dimensionKey: 'province', title: 'province', headerStyle: { color: 'purple' }, width: 300 }
        ],
        rowTree: [
          {
            dimensionKey: 'region',
            value: '东北',
            children: [
              { dimensionKey: 'province', value: '黑龙江' },
              { dimensionKey: 'province', value: '吉林' }
            ]
          },
          {
            dimensionKey: 'region',
            value: '华北',
            children: [{ dimensionKey: 'province', value: '河北' }]
          }
        ]
      },
      {
        rows: [
          { dimensionKey: 'year', title: 'year', headerStyle: { color: 'pink' }, width: 'auto' },
          'quarter'
        ],
        rowTree(args) {
          if (args[1]?.value === '黑龙江') {
            return [
              {
                dimensionKey: 'year',
                value: '2019',
                children: [
                  { dimensionKey: 'quarter', value: '2019Q2' },
                  { dimensionKey: 'quarter', value: '2019Q3' }
                ]
              }
            ];
          }
          return [
            {
              dimensionKey: 'year',
              value: '2018',
              children: [
                { dimensionKey: 'quarter', value: '2018Q1' },
                { dimensionKey: 'quarter', value: '2018Q2' }
              ]
            }
          ];
        }
      }
    ],
```

The results are presented as follows:

![image](https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/guide/multi-tree.jpeg)

This tutorial ends here, I hope it can help you better master the use of the pivot table tree structure exhibition function!
