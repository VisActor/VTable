// js转ts测试版
interface TableCell {
  value: string;
  editable: boolean;
}

interface TableData {
  rows: TableCell[][];
}

class EditableTable {
  private tableData: TableData;
  private tableElement: HTMLTableElement;
  private activeCell: HTMLTableCellElement | null = null;
  private activeTextarea: HTMLTextAreaElement | null = null;

  constructor(tableData: TableData, tableElement: HTMLTableElement) {
    this.tableData = tableData;
    this.tableElement = tableElement;
    this.renderTable();
  }

  private renderTable(): void {
    this.tableElement.innerHTML = '';
    for (const row of this.tableData.rows) {
      const tr = document.createElement('tr');
      for (const cell of row) {
        const td = document.createElement('td');
        td.textContent = cell.value;
        if (cell.editable) {
          td.classList.add('editable');
          td.addEventListener('click', () => this.editCell(td));
        }
        tr.appendChild(td);
      }
      this.tableElement.appendChild(tr);
    }
  }

  private editCell(cell: HTMLTableCellElement): void {
    if (this.activeCell) {
      this.saveActiveCell();
    }
    this.activeCell = cell;
    const value = cell.textContent || '';
    const textarea = document.createElement('textarea');
    textarea.value = value;
    textarea.rows = 3;
    cell.innerHTML = '';
    cell.appendChild(textarea);
    this.activeTextarea = textarea;
    textarea.focus();
    textarea.addEventListener('blur', () => this.saveActiveCell());
  }

  private saveActiveCell(): void {
    if (!this.activeCell || !this.activeTextarea) return;
    const value = this.activeTextarea.value.replace(/\n/g, '<br>');
    this.activeCell.innerHTML = value;
    this.activeCell = null;
    this.activeTextarea = null;
  }
}