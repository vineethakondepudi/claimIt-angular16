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
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

export interface TableColumn {
  label: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'action';  
  isSortable?: boolean;
  position?: 'right' | 'left';
  isChecked: boolean;
  index: number;
}
@Component({
  selector: 'app-remove-or-archive',
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
    MatSnackBarModule,
    LoaderComponent,
  ],
  templateUrl: './remove-or-archive.component.html',
  styleUrls: ['./remove-or-archive.component.scss']
})
export default class RemoveOrArchiveComponent implements OnInit {  

  tableData: any[] = [];
  searchResults: any = [];
  searchQuery: string = '';
  currentDate: Date = new Date();
  loader:boolean=true;
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
    // {
    //   label: 'Found Date',
    //   name: 'foundDate',
    //   type: 'date',  
    //   isSortable: true,
    //   position: "left",
    //   isChecked: true,
    //   index: 1,
    // },
    {
      label: 'Status',
      name: 'status',
      type: 'text',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Action",
      name: "remove",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
  ];

 
  constructor(private service: ClaimitService, private dialog: MatDialog, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.fetchData();
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
          console.error('Unexpected API response format:', res);
          this.searchResults = [];
          this.tableData = [];
        }
      },
      (error) => {
        this.loader = false;
          this.showSnackBar('Failed to Load data. Please try again.');
      }
    );
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  confirmRemove(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to remove this expired item?',
        title: 'Remove'
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        const params = {
          itemId: event.itemId 
        };
  
        this.loader = true;
        this.service.adminRemoveItem(params.itemId).subscribe((res: any) => {
          this.fetchData();
          this.loader = false;
        }, (error) => {
          this.loader = false;
          this.showSnackBar('Failed to Remove item. Please try again.');
        });
      }
    });
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

