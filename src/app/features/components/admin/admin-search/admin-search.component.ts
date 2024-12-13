import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@Component({
  selector: 'app-admin-search',
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
    MatIconModule,
    FormsModule,], templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss'],
  providers: [DatePipe],


})
export default class AdminSearchComponent {
  @Input() containerPanelOpened: boolean = false;
  searchQuery: string = '';
  searchResults: any = [];
  showNoResults: boolean = true;
  adminSearch!: FormGroup
  loader: boolean = true;
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
      label: "Action",
      name: "action",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    }
  ]
  private defaultSearchQuery = {
    limit: 15,
    offset: 0,
    sortBy: "desc",
    sortId: "foundDate",
  };
  public statusDropDown: any = [
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'PENDING_APPROVAL', value: 'PENDING APPROVAL' },
    { label: 'PENDING_PICKUP', value: 'PENDING PICKUP' },
    { label: 'CLAIMED', value: 'CLAIMED' },
    { label: 'UNCLAIMED', value: 'UNCLAIMED' },
  ]
  constructor(public dialog: MatDialog, private service: ClaimitService, private fb: FormBuilder, private dp: DatePipe) {

  }
  ngOnInit() {
    this.initializeAdminForm()
    this.search()
  }
  initializeAdminForm() {
    this.adminSearch = this.fb.group({
      email: (''),
      from: (''),
      to: (''),
      status: ('')
    })
  }
  public handleSort(sortParams: any) {
    this.defaultSearchQuery.sortBy = sortParams.direction;
    this.defaultSearchQuery.sortId = sortParams.active;
  }
  
  search() {
    this.loader = true
    const reqbody = {
      mail: this.adminSearch.value.email ? this.adminSearch.value.email : '',
      status: this.adminSearch.value.status ? this.adminSearch.value.status : '',
      to: this.adminSearch.value.to ? this.dp.transform(this.adminSearch.value.to, 'yyyy-m-dd') : '',
      from: this.adminSearch.value.from ? this.dp.transform(this.adminSearch.value.from, 'yyyy-m-dd') : ''
    }

    this.service.adminSearch(reqbody).subscribe((res: any) => {
      console.log('res',res)
      this.searchResults = res.data
      this.loader = false
    })

  }


  SearchAndClear(type: any) {
    if (type === 'clear') {
      this.loader = true
      this.searchResults = [];
      this.showNoResults = false;
      this.adminSearch.reset()
      this.search()

    } else {
      this.search()
    }

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
  clearResultsIfEmpty() {

  }
  public dateFilter(date: any) {
  }
  confirmRemove(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to remove this item?',
        title: 'Remove'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        const itemId = event.itemId; // Ensure itemId is correctly extracted
        console.log('ItemId being removed:', itemId); // Debug log for itemId
        this.loader = true;
        this.service.adminRemoveItem(itemId).subscribe(
          (res: any) => {
            console.log('Remove success response:', res); // Debug success
            this.search(); // Refresh the data table
            this.loader = false;
          },
          (error) => {
            console.error('Error removing item:', error); // Debug API error
          }
        );
      }
    });
  }

  approveClaim(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to approve this claim?',
        title: 'Approve Claim'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {

        const params = {
          itemId: event.itemId ,
          "status": "PENDING_PICKUP",
        };
        this.loader = true;
        this.service.approveOrRejectClaim(params).subscribe((res: any) => {
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: "500px",
            data: {
              message: 'Claim Request Approved Successfully',
              title: 'Success!!'
            },
          });
      
          dialogRef.afterClosed().subscribe((confirmed: any) => {
            this.search();
          });
          this.loader = false;
        }, (error) => {
        });
      }
    });
  }
  rejectClaim(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to reject this claim?',
        title: 'Reject Claim'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {

        const params = {
          itemId: event.itemId ,
          "status": "REJECTED",
        };

        this.loader = true;
        this.service.approveOrRejectClaim(params).subscribe((res: any) => {
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: "500px",
            data: {
              message: 'Claim Request Rejected Successfully',
              title: 'Success!!'
            },
          });
      
          dialogRef.afterClosed().subscribe((confirmed: any) => {
            this.search();
          });
          this.loader = false;
        }, (error) => {
          console.error('Error removing item:', error);
        });
      }
    });
  }
  markClaimed(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want mark this item as Claimed',
        title: 'Mark as Claimed'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {

        const params = {
          itemId: event.itemId ,
          "status": "REJECTED",
        };

        // this.loader = true;
        // this.service.approveOrRejectClaim(params).subscribe((res: any) => {
          const dialogRef = this.dialog.open(ConfirmationModalComponent, {
            width: "500px",
            data: {
              message: 'Item Claimed Successfuly',
              title: 'Success!!'
            },
          });
      
          dialogRef.afterClosed().subscribe((confirmed: any) => {
            this.search();
          });
        //   this.loader = false;
        // }, (error) => {
        //   console.error('Error removing item:', error);
        // });
      }
    });
  }
}
