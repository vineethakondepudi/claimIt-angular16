import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from 'src/app/features/crud/tablecolumn.interface';
import { Router } from '@angular/router';
import { DataPropertyGetterPipe } from '../../pipes/data-property-getter.pipe';
import { fadeInUp400ms } from '../../animations/fade-in-up.animation';
import { OverlayModule } from '@angular/cdk/overlay';
import { TooltipDirective } from '../../directives/tooltip.directive';
import { MatTooltipModule } from '@angular/material/tooltip';
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    DataPropertyGetterPipe,
    CommonModule,
    HttpClientModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    MatCheckboxModule, MatTooltipModule,
    OverlayModule,
    TooltipDirective],
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  providers: [DatePipe],
  animations: [fadeInUp400ms],
})
export class DataTableComponent<T> {
  displayedColumns1: Array<string> = [];
  filteredColumns: Array<TableColumn> = [];
  @Input() isPageable = false;
  @Input() serverSidePagination = false;
  @Input() paginationSizes: number[] = [5, 10, 15];
  @Input() defaultPageSize = 10;
  @Output() rowData: EventEmitter<T> = new EventEmitter();
  indexValue!: number;
  slicedSkills: any;
  @Input() set tableData(data: T[]) {
    this.setTableDataSource(data);
  }
  searchKeyword!: string;
  enableFilter = false;
  dataSource: any; // Variable to hold JSON data
  @ViewChild(MatSort, { static: true }) sort!: MatSort;
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @Input() pageSizeOptions: number[] = [5, 10, 15];
  @Input() tableColumns: Array<TableColumn> = [];
  @Input() showExport = false;
  @Output() exportData = new EventEmitter();
  displayedColumns: Array<string> = [];
  isOpen = false;
  constructor(public readonly router: Router, private datePipe: DatePipe) { }
  ngOnInit() {
    this.displayedColumns = this.tableColumns.map((col) => col.name);
    console.log(this.tableColumns, this.displayedColumns);

    this.filteredColumns = this.tableColumns.filter((col: TableColumn) => {
      return col.isChecked === true;
    });
    const columnNames = this.filteredColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    this.displayedColumns = columnNames;
  }

  setTableDataSource(data: T[]) {
    this.dataSource = new MatTableDataSource<T>(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }
  setPagination(tableData: T[] | undefined) {
    this.dataSource = new MatTableDataSource<T>(tableData);
    this.dataSource.paginator = this.paginator;
  }

  handlePage(params: PageEvent) {
    console.log(params);
  }

  applyFilter() {
    this.dataSource.filter = this.searchKeyword.trim().toLowerCase();
  }

  public handleToggleColumns(col: TableColumn) {
    const isChecked = col.isChecked;
    if (isChecked) {
      col.isChecked = !isChecked;
      this.filteredColumns = this.filteredColumns.filter((c) => {
        return c.label !== col.label;
      });
    } else {
      col.isChecked = !isChecked;
      this.filteredColumns = [...this.filteredColumns, col].sort(
        (a, b) => a.index - b.index
      );
    }
    const columnNames = this.filteredColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    this.displayedColumns = columnNames;
  }
  formatDate(dateString: string) {
    return dateString ? this.datePipe.transform(dateString, 'M/dd/YYYY') : '';
  }
  handleRowClick(row: any) {
    this.rowData.emit(row);
  }
  showSkills(data: any, i: number) {
    this.indexValue = i;
    this.slicedSkills = data.skills.split(',').slice(2);
  }
  formatSkills(data: any) {
    if (data.skills.split(',').length > 2) {
      return data.skills.split(',').slice(0, 2).concat('...')
    } else {
      return data.skills.split(',').slice(0, 2)
    }
  }
  getColor(element: any, columnName: string): string {
    const value = this.dataPropertyGetter(element, columnName);
    if (value === 'Inbound') {
      return '#219C90'
    }
    else {
      return '#EE4E4E';
    }
  }
  dataPropertyGetter(element: any, property: string) {
    return element[property];
  }
}
