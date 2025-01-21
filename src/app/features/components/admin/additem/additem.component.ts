import { Component, OnInit, Input, HostListener } from '@angular/core';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component'; 
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { MatDialogModule } from '@angular/material/dialog';
import { OrganizationDialogComponent } from '../organization-dialog/organization-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import { RouterModule } from '@angular/router';
export interface TableColumn {
  label: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'action'| 'qrcode';   // Constrained type values
  isSortable?: boolean;
  position?: 'right' | 'left';
  isChecked: boolean;
  index: number;
}

@Component({
  selector: 'app-additem',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent, 
    MatButtonModule,
    MatIconModule,
    FormFooterComponent,
    FormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCardModule,
    MatDialogModule,
    NgxDropzoneModule,
    LoaderComponent,
    RouterModule
  ],
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export default class AdditemComponent implements OnInit {  

  tableData: any[] = [];
  searchResults: any = [];
  searchQuery: string = '';
  isMobileView = false;
  currentDate: Date = new Date();
  @Input() containerPanelOpened: boolean = false;
  loader:boolean=true;

  displayColumns: TableColumn[] = [
    {
      label: "Image Data",
      name: "image",
      type: "image", 
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: 'Received Date',
      name: 'receivedDate',
      type: 'date',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 2,
    },
    {
      label: 'Category',
      name: 'name',
      type: 'text',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 3,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'text',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 4,
    },
    {
      label: 'QR Code',
      name: 'qrcode',
      type: 'qrcode',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 4,
    },
  ];
  public sortField: string = "foundDate";
  private defaultSearchQuery = {
    limit: 15,
    offset: 0,
    sortBy: "desc",
    sortId: "foundDate",
  };
  isOrganizationSelected: boolean = false; 
  selectedOrgId: string = '';
  files: any[] = []; 

  constructor(private service: ClaimitService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.checkViewport();
    this.fetchData();    
  }
  public handleSort(sortParams: any) {
    this.defaultSearchQuery.sortBy = sortParams.direction;
    this.defaultSearchQuery.sortId = sortParams.active;
  }
  
  onAddItemClick(): void {
    this.service.organizationList().subscribe(
      (res: any) => {
        const dialogRef = this.dialog.open(OrganizationDialogComponent, {
          width: '400px',
          data: { organizationList: res },
        });

        dialogRef.afterClosed().subscribe((selectedOrgId: string | undefined) => {
          this.fetchData();
          this.loader = true;
        });
      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }

  fetchData(): void {
    const query = this.searchQuery.trim();
    this.service.listOfItems(query).subscribe(
      (res: any) => {
        if (res?.data) {
          this.searchResults = res.data;
          this.tableData = res.data;
          this.loader = false
        } else {
          this.loader = false
          console.error('Unexpected API response format:', res);
          this.searchResults = [];
          this.tableData = [];
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }

  onUploadImage(): void {
    if (this.files.length > 0) {
      const formData = new FormData();
      formData.append('image', this.files[0].file); 
      formData.append('orgId', this.selectedOrgId);
  
      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
          this.isOrganizationSelected = false; 
          this.files = []; 
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    } else {
      console.warn('No file selected for upload.');
    }
  }

  onImportToExcel(): void {
   
  }
  
@HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
  }

  
  previewImage(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        requiredData: event,
        title: 'Preview Image'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
    });
  }
}