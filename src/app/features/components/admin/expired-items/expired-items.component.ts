import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UpdateDateDialogComponent } from '../update-date-dialog/update-date-dialog.component';

@Component({
  selector: 'app-expired-items',
   standalone: true,
    imports: [CommonModule,
      DataTableComponent,
      MatCardModule,
      MatIconModule,
      MatSelectModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      DataTableComponent,
      MatExpansionModule,
      MatSidenavModule,
      MatDialogModule,
      FormFooterComponent,
      MatTooltipModule,
      MatFormFieldModule,
      LoaderComponent,
      MatDatepickerModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatIconModule,
      FormsModule,
      RouterModule], 
  templateUrl: './expired-items.component.html',
  styleUrls: ['./expired-items.component.scss'],
   providers: [DatePipe],
})
export class ExpiredItemsComponent {
  @Input() containerPanelOpened: boolean = false;
  isLoading :boolean =  false;

  displaycoloums: any = [
    {
      label: "Item Id",
      name: "itemId",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Image",
      name: "image",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Item Name",
      name: "title",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Status",
      name: "status",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Received Date",
      name: "receivedDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    }
    ,
    {
      label: "Expiration Date",
      name: "expirationDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    }
    ,
  ]
  startDate: Date | null = null;
  endDate: Date | null = null;
  searchResults: any = [];
  searchPerformed = false;
  selectedOrganization: string | null =null;
  initalData:any = []
  constructor(private dialog: MatDialog,private http: HttpClient) {}
  ngOnInit() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.http.get('https://100.28.242.219.nip.io/api/admin/archived')
      .subscribe(response => {
        this.initalData = response
      }, error => {
        console.error('Error fetching initial data', error);
      });
  }

  search() {
    if ((this.startDate && this.endDate) || this.selectedOrganization) {
      this.searchPerformed = true;
      const fromDate = this.formatDate(this.startDate);
      const toDate = this.formatDate(this.endDate);
      const orgID = this.selectedOrganization
      const params = new HttpParams()
        .set('fromDate', fromDate)
        .set('toDate', toDate)
        .set('orgId', 'Miracle');
        this.isLoading = true
      this.http.get('https://100.28.242.219.nip.io/api/admin/archived', { params })
        .subscribe(response => {
          console.log('Search Results:', response);
          this.searchResults = response
          this.isLoading = false
        }, error => {
          this.isLoading = false
          console.error('Error fetching data', error);
        });
    } else {
      alert('Please select a valid date range.');
    }
  }
  openUpdateDialog() {
    const dialogRef = this.dialog.open(UpdateDateDialogComponent);

    dialogRef.afterClosed().subscribe((selectedDate: Date | null) => {
      if (selectedDate) {
        this.updateExpirationDate(selectedDate);
      }
      this.initalData()
    });
  }
  formatDate(date: Date | null): string {
    if (!date) return '';
    return date.getFullYear() + '-' +
           String(date.getMonth() + 1).padStart(2, '0') + '-' +
           String(date.getDate()).padStart(2, '0');
  }
  updateExpirationDate(expirationDate: Date) {
    const fromDate = this.formatDate(this.startDate);
  const toDate = this.formatDate(this.endDate);
  const expDate = this.formatDate(expirationDate);
  this.isLoading = true 
    const params = new HttpParams()
      .set('fromDate', fromDate)
      .set('toDate', toDate)
      .set('expirationDate', expDate)
      .set('orgId', 'Miracle');

    this.http.put('https://100.28.242.219.nip.io/api/admin/archiveExpired', {}, { params })
      .subscribe(response => {
        this.isLoading = false
        console.log('Update Response:', response);
      }, error => {
        this.isLoading = false
        console.error('Error updating data', error);
      });
  }
  
  clear() {
    this.startDate = null;
    this.endDate = null;
    this.searchPerformed = false
    this.selectedOrganization = null
  }

}
