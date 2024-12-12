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
  adminSearch!:FormGroup
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
  public statusDropDown: any = [
    { label: 'PENDING_PICKUP', value: 'PENDING PICKUP' },
    { label: 'CLAIMED', value: 'CLAIMED' },
    { label: 'UNCLAIMED', value: 'UNCLAIMED' },
  ]
  constructor(public dialog: MatDialog, private service: ClaimitService,private fb:FormBuilder,private dp:DatePipe) {

  }
  ngOnInit() {
    this.initializeAdminForm()
    this.search()
  }
  initializeAdminForm(){
    this.adminSearch= this.fb.group({
      email:(''),
      from:(''),
      to:(''),
      status:('')
    })
  }
  search() {
    this.loader = true
    const reqbody = {
      mail:this.adminSearch.value.email ?this.adminSearch.value.email:'',
      status:this.adminSearch.value.status?this.adminSearch.value.status:'',
      to:this.adminSearch.value.to?this.dp.transform(this.adminSearch.value.to,'yyyy-m-dd'):'',
      from:this.adminSearch.value.from?this.dp.transform(this.adminSearch.value.from,'yyyy-m-dd') :''
    }     

    this.service.adminSearch(reqbody).subscribe((res: any) => {
      this.searchResults = res
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
        // Use itemId here instead of claimId
        const params = {
          itemId: event.itemId // Pass itemId to the service
        };
  
        this.loader = true;
        this.service.adminRemoveItem(params.itemId).subscribe((res: any) => {
          this.search();
          this.loader = false;
        }, (error) => {
          console.error('Error removing item:', error);
        });
      }
    });
  }
  approveClaim(event:any){
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to approve this claim?',
        title: 'Approve Claim'
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        // Use itemId here instead of claimId
        const params = {
          itemId: event.itemId // Pass itemId to the service
        };
  
        // this.loader = true;
        // this.service.adminRemoveItem(params.itemId).subscribe((res: any) => {
        //   this.search();
        //   this.loader = false;
        // }, (error) => {
        //   console.error('Error removing item:', error);
        // });
      }
    });
  }
  rejectClaim(event:any){
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to reject this claim?',
        title: 'Reject Claim'
      },
    });
  
    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        // Use itemId here instead of claimId
        const params = {
          itemId: event.itemId // Pass itemId to the service
        };
  
        // this.loader = true;
        // this.service.adminRemoveItem(params.itemId).subscribe((res: any) => {
        //   this.search();
        //   this.loader = false;
        // }, (error) => {
        //   console.error('Error removing item:', error);
        // });
      }
    });
  }
}
