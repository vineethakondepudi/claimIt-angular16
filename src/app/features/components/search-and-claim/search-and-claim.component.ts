import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from 'src/app/@amc/components/footer/footer.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { CreateClaimComponent } from '../create-claim/create-claim.component';
import { ClaimitService } from '../../sharedServices/claimit.service';
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
// import { MatSnackBar } from '@angular/material/snack-bar';
interface Item {
  itemId: number;
  itemName: string;
  status: string;
  foundDate: string;
  subcatgeoryId: number;
  categoryId: number;
  expirationDate: string | null;
  receivedDate: string;
  image: string;
  dominantColor: string;
  detectedText: string;
  orgId: string;
}
@Component({
  selector: 'app-search-and-claim',
  standalone: true,
  imports: [CommonModule, MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    FormFooterComponent,
    MatExpansionModule,
    MatDialogModule,
    DataTableComponent,
    LoaderComponent,
    CreateClaimComponent,
    MatProgressSpinnerModule,
    MatExpansionModule,
    NgxDropzoneModule, MatSelectModule, FormsModule, HttpClientModule],
  templateUrl: './search-and-claim.component.html',
  styleUrls: ['./search-and-claim.component.scss']
})
export default class SearchAndClaimComponent {
  @Input() containerPanelOpened: boolean = false;
  displaycoloums: any[] = [
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
      label: "Status",
      name: "status",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 2,
    },
    {
      label: "FoundDate",
      name: "foundDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 3,
    },
    {
      label: "ReceivedDate",
      name: "receivedDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 4,
    },
    {
      label: "Action",
      name: "action",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },

  ]
  itemName: string | null = null;
  files: { file: File, preview: string }[] = [];
  uplodedfilesdata: any[] = []
  matchedItems: any = [];
  loader:boolean = false
  items: any[] = [];
  searchResults: any = [];
  categeoryerror: boolean = false
  searchQuery: string = ''; // Current search query
  savedSearches: string[] = []; // List of saved searches
  selectedSavedSearch: string | null = null; // Currently selected saved search

  categories = [
    { value: 'Electronics', viewValue: 'Electronics' },
    { value: 'Personal Accessories', viewValue: 'Personal Accessories' },
    { value: 'Clothes & Accessories', viewValue: 'Clothes & Accessories' },
    { value: 'Work Tools', viewValue: 'Work Tools' },
    { value: 'Storage Items', viewValue: 'Storage Items' },
    { value: 'Other Items', viewValue: 'Other Items' },
    { value: 'Expensive Items', viewValue: 'Expensive Items' },
    { value: 'Unlabeled Items', viewValue: 'Unlabeled Items' }
  ];
  displayedColumns: string[] = ['itemId', 'itemName', 'status', 'foundDate', 'categoryId', 'actions'];
  dataSource: any = [];
  categerorydata: any = [];
  private defaultSearchQuery = {
    limit: 15,
    offset: 0,
    sortBy: "desc",
    sortId: "foundDate",
  };
  selectedCategory: string = '';
  constructor(private http: HttpClient, private route: ActivatedRoute, private matDialog: MatDialog,private claimService:ClaimitService) {
    this.loadSavedSearches(); 
   }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.itemName = params['id']; 
      if (this.itemName) {
        this.searchQuery = this.itemName.toString();
        this.searchItems(); 
      }
    });
  }
  public  onRemove(fileToRemove: any): void {
    this.uplodedfilesdata.splice(this.uplodedfilesdata.indexOf(fileToRemove), 1);
    const index = this.files.findIndex(f => f.file === fileToRemove);
    if (index >= 0) {
      this.files.splice(index, 1); 
    }
  }
  searchItems() {
    if (this.searchQuery.trim() !== '') {
      const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${encodeURIComponent(this.searchQuery)}`;

      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          this.searchResults = response;
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
  }
  public handleSort(sortParams: any) {
    this.defaultSearchQuery.sortBy = sortParams.direction;
    this.defaultSearchQuery.sortId = sortParams.active;
  }
  //categeory integration
  search(): void {
    this.loader = true

    const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${this.selectedCategory}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (data: any) => {
        this.categerorydata = data; 
        this.loader = false
        console.log(this.categerorydata, 'categerorydata')
        if (this.categerorydata.message.includes('No items found for the search term')) {
          this.categeoryerror = true
        } else {
          this.categeoryerror = false
        }
      },
      (error: any) => {
        console.error('API Error:', error);
      }
    );
  }
  saveSearch() {
    if (this.searchQuery.trim() !== '') {
      if (!this.savedSearches.includes(this.searchQuery)) {
        this.savedSearches.push(this.searchQuery);
        localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
        alert('Search saved successfully!');
      } else {
        alert('This search is already saved.');
      }
    } else {
      alert('Search query cannot be empty.');
    }
  }
  applySavedSearch() {
    if (this.selectedSavedSearch) {
      this.searchQuery = this.selectedSavedSearch;
      this.searchItems();
    }
  }
  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
  }
  loadSavedSearches() {
    const storedSearches = localStorage.getItem('savedSearches');
    if (storedSearches) {
      this.savedSearches = JSON.parse(storedSearches);
    }
  }
  SearchAndClear(type: any) {
    if (type === 'clear') {
      this.searchQuery = '';
      this.searchResults = [];
    } else {

    }

  }
  clearResultsIfEmpty() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
    } else {
      this.searchItems()
    }
  }
  selectCategory(category: string) {
    this.selectedCategory = category;
    this.search();
  }
  // method for selecting the image and restricting the based on the image
  public onSelect(event: any): void {
    const files = event.addedFiles;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg','image/png', 'image/gif', 'image/bmp', 'image/jfif'];
      if (!allowedTypes.includes(file.type)) {
        const dialogRef = this.matDialog.open(FormSubmissionModalComponent, {
          width: "500px",
          data: {
            status: 'Error',
            msg: 'Only JPG, JPEG, PNG, GIF, BMP, and JFIF image formats are allowed.',
            btnName: "OK",
          },
        });
        
        dialogRef.afterClosed().subscribe(() => {
        });
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.files.push({
          file: file,
          preview: reader.result as string  
        });
      };
      reader.readAsDataURL(file);  
      
      this.uploadImage(file).subscribe(
        (response) => {
          this.matchedItems = response.matchedItems; 
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
  getCategoryIcon(value: string): string {
    switch (value) {
      case 'Electronics':
        return 'devices';
      case 'Personal Accessories':
        return 'watch';
      case 'Clothes & Accessories':
        return 'checkroom';
      case 'Work Tools':
        return 'build';
      case 'Storage Items':
        return 'inventory';
      case 'Other Items':
        return 'category';
      case 'Expensive Items':
        return 'attach_money';
      case 'Unlabeled Items':
        return 'help';
      default:
        return 'help';
    }
  }
  uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    const picUrl = 'http://172.17.12.38:8081/api/users/uploadImageForSearch';
    return this.http.post(picUrl, formData, {
      headers: new HttpHeaders(),
    });
  }


  public onImportToExcel() {
    this.files = []
  }
  claimItem(item: Item) {
    console.log('item', item)
    const dialogRef = this.matDialog.open(CreateClaimComponent, {
      width: "500px",
      height:'250px',
      data: {
        requiredData: item,
        title: 'Request Claim'
      },
    });

    dialogRef.afterClosed().subscribe((data: any) => {
      console.log(data,'datadata')
      if(data){
        const REQBODY = {
          userName:data.value.name,
          userEmail:data.value.email,
          itemId:item.itemId
        }
        this.loader = true
        this.claimService.createClaimRequest(REQBODY).subscribe((Res:any)=>{
          console.log(Res)
          if(Res){
            const dialogRef = this.matDialog.open(FormSubmissionModalComponent, {
              width: "500px",
              data: {
                status:'Success',
                msg: 'Claim Request Created successfully',
                btnName: "OK",
              },
            });
            dialogRef.afterClosed().subscribe((result) => {
              this.loader = true
              this.search()
            });
          }
        })
      }
    });
  }
  previewImage(event: any) {
    console.log(event)
    const dialogRef = this.matDialog.open(ConfirmationModalComponent, {
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
