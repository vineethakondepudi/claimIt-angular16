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
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
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
    {
      label: "Remove",
      name: "remove",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
  ];

 
  constructor(private service: ClaimitService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchData();
  }



  fetchData(): void {
    const query = this.searchQuery.trim();
    this.service.listOfItems(query).subscribe((res: any) => {
      this.searchResults = res;
      this.tableData = res; 
      console.log(res,106);
      
    },
    (error) => {
      console.error('Error fetching data:', error);
    });
  }


  confirmRemove(event: any) {
    console.log(116, event.itemId); 
  
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to remove this item?',
        title: 'Remove'
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      console.log('confirmed', confirmed);
      if (confirmed === 'yes') {
        // Use itemId here instead of claimId
        const params = {
          itemId: event.itemId // Pass itemId to the service
        };
  
        this.loader = true;
        this.service.adminRemoveItem(params.itemId).subscribe((res: any) => {
          this.loader = false;
          const dialogRef = this.dialog.open(FormSubmissionModalComponent, {
            width: "500px",
            data: {
              status: 'Success',
              msg: 'Item unclaimed successfully',
              btnName: "OK",
            },
          });
          dialogRef.afterClosed().subscribe(() => {
            // Reset the loader or handle any post-modal actions here
            this.loader = false;
          });
        }, (error) => {
          this.loader = false;
          console.error('Error removing item:', error);
        });
      }
    });
  }
  
}

