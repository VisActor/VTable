// export function generateGanttChartColumns(
//   scales: {
//     unit: 'day' | 'week' | 'month' | 'quarter' | 'year';
//     step: number;
//     format: (date: Date) => string;
//   }[],
//   minDate: string,
//   maxDate: string
// ) {
//   const startDate = new Date(minDate);
//   const endDate = new Date(maxDate);
//   const columns = [];

//   // Iterate over each scale
//   for (const scale of scales) {
//     const { unit, step, format } = scale;
//     const column: any = {
//       title: '',
//       columns: []
//     };

//     // Generate the top-level column title
//     if (unit === 'month') {
//       column.title = startDate.toLocaleString('default', { year: 'numeric', month: 'long' });
//     } else if (unit === 'day') {
//       column.title = startDate.toLocaleString('default', { year: 'numeric', month: 'long' });
//     }

//     // Generate the sub-columns for each step within the scale
//     const currentDate = new Date(startDate);
//     while (currentDate <= endDate) {
//       const subColumn = {
//         title: format(currentDate)
//       };
//       column.columns.push(subColumn);
//       currentDate.setDate(currentDate.getDate() + step);
//     }

//     columns.push(column);
//   }

//   return columns;
// }

// export function generateGanttChartColumns(scales, minDate, maxDate) {
// const startDate = new Date(minDate);
// const endDate = new Date(maxDate);
// const columns = [];
// const currentDate = new Date(startDate);
// while (currentDate <= endDate) {
//   const dateColumns = {};
//   for (const scale of scales) {
//     const { unit, step, format } = scale;
//     const formattedDate = format(currentDate);
//     const columnTitle = formattedDate || currentDate.getDate().toString().padStart(2, '0');
//     if (unit === 'month') {
//       const monthColumn = columns.find(column => column.title === columnTitle);
//       if (!monthColumn) {
//         dateColumns.title = columnTitle;
//         dateColumns.columns = [];
//         columns.push(dateColumns);
//       }
//     } else if (unit === 'day') {
//       const monthColumn = columns.find(column => column.title === scales[0].format(currentDate));
//       if (monthColumn) {
//         monthColumn.columns.push({ title: columnTitle });
//       }
//     }
//     currentDate.setDate(currentDate.getDate() + step);
//   }
// }
// return columns;
// }
