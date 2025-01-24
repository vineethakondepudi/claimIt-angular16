import { Component, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
import { QRCodeModule } from 'angularx-qrcode';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from '../confirmation-modal/confirmation-modal.component';
import { QrcodeDialogComponent } from '../qrcode-dialog/qrcode-dialog.component';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { LoaderComponent } from '../loader/loader.component';
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    DataPropertyGetterPipe,
    CommonModule,
    QRCodeModule,
    HttpClientModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    MatMenuModule,
    LoaderComponent,
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
  @Input() set tableData(data: []) {
    this.setTableDataSource(data);
  }
  @Input() showUnClaim: boolean = false
  @Input() removeArchive: boolean = false
  @Input() adminActions: boolean = false
  @Output() unClaim = new EventEmitter()
  @Output() ClaimItem = new EventEmitter()
  @Output() remove = new EventEmitter()
  @Output() previewImage = new EventEmitter()
  @Output() approveClaim = new EventEmitter()
  @Output() rejectClaim = new EventEmitter()
  @Output() markClaimed = new EventEmitter()
  searchKeyword!: string;
  enableFilter = false;
  dataSource: any; // Variable to hold JSON data
  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    this.dataSource.paginator = value;
  }
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (!this.dataSource.sort) {
      this.dataSource.sort = sort
    }
  }
  @Input() pageSizeOptions: number[] = [5, 10, 15];
  @Input() tableColumns: Array<TableColumn> = [];
  @Input() showExport = false;
  selectedImage: string | null = null;
  showImagePreview: boolean = false;
  isLoading: boolean = false;
  @Output() exportData = new EventEmitter();
  displayedColumns: Array<string> = [];
  isOpen = false;
  isMobileView = false;
  searchQuery: string = '';
  addItemSearchResults: any
  currentRoute: any
  getData: any
  constructor(public router: Router, private datePipe: DatePipe, private dialog: MatDialog, private service: ClaimitService) { }
  ngOnInit() {
    this.currentRoute = this.router.url;
    console.log(this.currentRoute);
    this.currentRoute.includes("/addItem")
    this.getData = this.currentRoute.includes("/addItem")

    this.displayedColumns = this.tableColumns.map((col) => col.name);
    this.filteredColumns = this.tableColumns.filter((col: TableColumn) => {
      return col.isChecked === true;
    });
    const columnNames = this.filteredColumns.map(
      (tableColumn: TableColumn) => tableColumn.name
    );
    this.displayedColumns = columnNames;

    this.checkViewport();
    if(this.isMobileView){
      this.addItem()
     }
     console.log(this.dataSource.data, 'datasource')
  }
  addItem() {
    this.isLoading = true
    const query = this.searchQuery.trim();
    this.service.listOfItemsAddItem(query).subscribe(
      (res: any) => {
        this.addItemSearchResults = Object.keys(res).map((key) => ({
          date: key.split(":")[1], // Extract the date part from "date:YYYY/MM/DD"
          items: res[key]
        }));
        console.log(this.addItemSearchResults);
        this.isLoading = false
      },
      (error) => {
        this.isLoading = false
        console.error('Error fetching data:', error);
      }
    );

  }
 
  setTableDataSource(data: T[]) {
    this.dataSource = new MatTableDataSource<T>(data);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.matSort
  }
  setPagination(tableData: T[] | undefined) {
    this.dataSource = new MatTableDataSource<T>(tableData);
    this.dataSource.paginator = this.paginator;
  }

  handlePage(params: PageEvent) {
  }
  openImagePreview(imageSrc: string) {
    this.selectedImage = imageSrc;
    this.showImagePreview = true;
  }

  // Method to close the image preview modal
  closeImagePreview() {
    this.selectedImage = null;
    this.showImagePreview = false;
  }
  generateQrCodeData(element: any): string {
    return JSON.stringify({
      id: element.uniqueId,
      name: element.name,
      status: element.status,
      verificationLink: `http://localhost:4200/assets/verification.html?itemId=${element.itemId}`
    });
  }

  openQrDialog(element: any): void {
    const dialogRef = this.dialog.open(QrcodeDialogComponent, {
      width: "300px",
      data: {
        requiredData: element,
        title: 'qrcode'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    });
  }

  applyFilter() {
    this.dataSource.filter = this.searchKeyword.trim().toLowerCase();
  }
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
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
  getColor(element: any, columnName: string): { backgroundColor: string, textColor: string } {
    const value = this.dataPropertyGetter(element, columnName);

    switch (value) {
        case 'CLAIMED':
            return { backgroundColor: '#B2EDE8', textColor: '#13776F' }; // Teal
        case 'PENDING_PICKUP':
            return { backgroundColor: '#FEE9E9', textColor: '#A33333' }; // Red
        case 'OPEN':
            return { backgroundColor: '#FEFCE5', textColor: '#A69B00' }; // Yellow
        case 'UNCLAIMED':
            return { backgroundColor: '#FCA5A5', textColor: '#B91C1C' }; // Red
        case 'Archived':
            return { backgroundColor: '#A7C8A1', textColor: '#4A683E' }; // Green
        case 'PENDING_APPROVAL':
            return { backgroundColor: '#FAF9E1', textColor: '#857C00' }; // Yellow
        case 'REJECTED':
            return { backgroundColor: '#FFCCCC', textColor: '#991B1B' }; // Red
        default:
            return { backgroundColor: '#F8A8A8', textColor: '#B91C1C' }; // Default Red
    }
}

  dataPropertyGetter(element: any, property: string) {
    return element[property];
  }
  unClaimItem(data: any) {
    this.unClaim.emit(data)
  }
  createClaimItem(data: any) {
    this.ClaimItem.emit(data)
  }
  removeItem(data: any) {
    this.remove.emit(data)
  }
  approveClaimReq(data: any) {
    this.approveClaim.emit(data)
  }
  rejectClaimReq(data: any) {
    this.rejectClaim.emit(data)
  }
  markAsClaimed(data: any) {
    this.markClaimed.emit(data)
  }
  openPreviewImage(data: any) {
    this.previewImage.emit(data)
  }
}
