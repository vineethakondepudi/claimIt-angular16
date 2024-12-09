import { Component, OnInit, Input } from '@angular/core';
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

interface TableData {
  image: string;
  foundDate: string;
  status: string;
}

export interface TableColumn {
  label: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'action';  // Constrained type values
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
  ],
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export default class AdditemComponent implements OnInit {  

  tableData: any[] = [];
  searchResults: any = [];
  searchQuery: string = '';
  currentDate: Date = new Date();
  @Input() containerPanelOpened: boolean = false;

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
      label: 'Found Date',
      name: 'foundDate',
      type: 'date',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'text',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
  ];

  isOrganizationSelected: boolean = false; 
  selectedOrgId: string = '';

  constructor(private service: ClaimitService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchData();
  }

  onAddItemClick(): void {
    this.service.organizationList().subscribe(
      (res: any) => {
        const dialogRef = this.dialog.open(OrganizationDialogComponent, {
          width: '400px',
          data: { organizationList: res },
        });

        dialogRef.afterClosed().subscribe((selectedOrgId: string | undefined) => {
          if (selectedOrgId) {
            console.log('Selected Organization ID:', selectedOrgId);
            this.selectedOrgId = selectedOrgId; 
            this.isOrganizationSelected = true; 
          } else {
            console.log('Dialog closed without selection.');
            this.isOrganizationSelected = false; 
          }
        });
      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }

  fetchData(): void {
    const query = this.searchQuery.trim();
    this.service.listOfItems(query).subscribe((res: any) => {
      this.searchResults = res;
      this.tableData = res; 
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
    
      
      const formData = new FormData();
      formData.append('image', file);
      formData.append('orgId', this.selectedOrgId);

      // Call the service method to upload the file
      this.service.adminUploadItem(this.selectedOrgId, formData).subscribe(
        (response) => {
          console.log('File uploaded successfully:', response);
          // Hide the file input after successful upload
          this.isOrganizationSelected = false;
        },
        (error) => {
          console.error('Error uploading file:', error);
        }
      );
    }
  }

  
}
