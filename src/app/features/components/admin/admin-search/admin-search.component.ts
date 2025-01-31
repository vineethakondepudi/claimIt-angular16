import { Component, HostListener, Input } from '@angular/core';
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
import { RejectClaimComponent } from '../../../reject-claim/reject-claim.component';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatProgressSpinnerModule,
    MatIconModule,
    FormsModule,
    RouterModule], 
  templateUrl: './admin-search.component.html',
  styleUrls: ['./admin-search.component.scss'],
  providers: [DatePipe],


})
export default class AdminSearchComponent {
  @Input() containerPanelOpened: boolean = false;
  searchQuery: string = '';
  searchResults: any = [];
  initalData: any = [];
  showNoResults: boolean = true;
  adminSearch!: FormGroup
  isMobileView = false;
  loader: boolean = true;
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
      label: "Name",
      name: "name",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "Email",
      name: "email",
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
    this.checkViewport();

  }
  initializeAdminForm() {
    this.adminSearch = this.fb.group({
      email: (''),
      to: (''),
      status: (''),
      name:('')
    })
  }
  public handleSort(sortParams: any) {
    this.defaultSearchQuery.sortBy = sortParams.direction;
    this.defaultSearchQuery.sortId = sortParams.active;
  }
  
  search() {
       this.isLoading = true
    const reqbody = {
      mail: this.adminSearch.value.email ? this.adminSearch.value.email : '',
      status: this.adminSearch.value.status ? this.adminSearch.value.status : '',
      receivedDate: this.adminSearch.value.to ? this.dp.transform(this.adminSearch.value.to) : '',
    }

    this.service.adminSearch(reqbody).subscribe((res: any) => {
      this.searchResults = res.data
         this.isLoading = false
    })

  }

@HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }

  checkViewport() {
    this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
  }

  SearchAndClear(type: any) {
    if (type === 'clear') {
         this.isLoading = true
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
        message: 'Are you sure you want to remove this expired item?',
        title: 'Remove'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        const itemId = event.itemId; 
           this.isLoading = true;
        this.service.adminRemoveItem(itemId).subscribe(
          (res: any) => {
            this.search(); // Refresh the data table
               this.isLoading = false;
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
           this.isLoading = true;
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
             this.isLoading = false;
        }, (error) => {
        });
      }
    });
  }
  rejectClaim(event: any) {
    const dialogRef = this.dialog.open(RejectClaimComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to reject this claim?',
        title: 'Reject Claim'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed !== undefined || confirmed!== '' || confirmed!== null) {

        const params = {
          itemId: event.itemId ,
          "status": "REJECTED",
          reasonForReject:confirmed
        };

           this.isLoading = true;
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
             this.isLoading = false;
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
          "claimStatus": "CLAIMED",
          userId:event.userId
        };

           this.isLoading = true;
        this.service.markASClaimed(params).subscribe((res: any) => {
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
             this.isLoading = false;
        }, (error) => {
          console.error('Error removing item:', error);
        });
      }
    });
  }
}
