import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { fadeInRight400ms } from 'src/app/@amc/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/app/@amc/animations/fade-in-up.animation';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ClaimitService } from '../../sharedServices/claimit.service';
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { MatSelectModule } from '@angular/material/select';
import { RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-view-or-unclaim',
  standalone: true,
  imports: [CommonModule,
    DataTableComponent,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    DataTableComponent,
    MatExpansionModule,
    MatSidenavModule,
    MatDialogModule,
    FormFooterComponent,
    MatTooltipModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    LoaderComponent,
    MatIconModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    RouterModule],
  templateUrl: './view-or-unclaim.component.html',
  styleUrls: ['./view-or-unclaim.component.scss'],
  animations: [fadeInRight400ms, fadeInUp400ms],
})
export default class ViewOrUnclaimComponent {
  @Input() containerPanelOpened: boolean = false;
  viewUnclaimForm: any= FormGroup
  searchQuery: string = '';
  searchResults: any = [];
  initalDataResults: any = [];
  showNoResults: boolean = true;
  isLoading:boolean=true;
  displaycoloums: any = [
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
      label: "Username",
      name: "userName",
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
      index: 2,
    },
    {
      label: "Status",
      name: "status",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 2,
    },
    {
      label: "claim Date",
      name: "claimDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 3,
    },
    {
      label: "Action",
      name: "action",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 4,
    },
  ]
  public statusDropDown: any = [
    { label: 'REJECTED', value: 'REJECTED' },
    { label: 'PENDING_APPROVAL', value: 'PENDING APPROVAL' },
    { label: 'PENDING_PICKUP', value: 'PENDING PICKUP' },
    { label: 'CLAIMED', value: 'CLAIMED' },
    { label: 'UNCLAIMED', value: 'UNCLAIMED' },
  ]
  constructor(public dialog: MatDialog, private service: ClaimitService,private fb: FormBuilder) {

  }
  ngOnInit() {
    this.initialForm( )
    this.search()
  }
  initialForm() {
    this.viewUnclaimForm = this.fb.group({
      email: [''], 
      name: ['']
    });
  }

  search() {
    const reqbody = {
      email: this.viewUnclaimForm.value.email ? this.viewUnclaimForm.value.email : '',
      name: this.viewUnclaimForm.value.name ? this.viewUnclaimForm.value.name : '',
      status: this.viewUnclaimForm.value.status ? this.viewUnclaimForm.value.status : '',
    
    }
    this.isLoading = true
    this.service.getAllItems(reqbody).subscribe((res: any) => {
      this.searchResults = res.itemRequests
      this.isLoading = false;
    })

  }
  listOfItems(){
    this.isLoading = true
    this.service.listOfItems(this.searchQuery).subscribe(
      (res: any) => {
        this.initalDataResults = res.data.filter((item: { status: string; }) => item.status === "UNCLAIMED");
        this.isLoading = false
      },
      (error) => {
        console.error('Error fetching search results:', error);
      }
    );
  }
  SearchAndClear(type: any) {
    if (type === 'clear') {
      this.viewUnclaimForm.reset() 
      this.searchResults = [];
      this.showNoResults = true;
    } else if (type === 'search') {
      this.search()
    }

  }
  confirmUnclaim(event: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to unclaim this item?',
        title: 'UnClaim'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: any) => {
      if (confirmed === 'yes') {
        const params = {
          status:'UNCLAIMED',
          claimId:event.requestId
        }
        this.isLoading = true
        this.service.unClaimItem(params).subscribe((res:any)=>{
          this.isLoading = false
          const dialogRef = this.dialog.open(FormSubmissionModalComponent, {
            width: "500px",
            data: {
              status:'Success',
              msg: 'Item unclaimed successfully',
              btnName: "OK",
            },
          });
          dialogRef.afterClosed().subscribe((result) => {
            this.isLoading = true
            this.search()
          });
        })
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
