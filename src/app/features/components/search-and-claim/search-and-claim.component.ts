import { ChangeDetectorRef, Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormControl, FormsModule } from '@angular/forms';
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
import { MatSnackBar } from '@angular/material/snack-bar';
import { FooterComponent } from 'src/app/@amc/components/footer/footer.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { CreateClaimComponent } from '../create-claim/create-claim.component';
import { ClaimitService } from '../../sharedServices/claimit.service';
import { FormSubmissionModalComponent } from 'src/app/@amc/components/form-submission-modal/form-submission-modal.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import {MatMenuModule, MatMenuTrigger} from '@angular/material/menu';
// import { MatSnackBar } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
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
    MatTooltipModule,
    MatCardModule,
    MatMenuModule,
    FormFooterComponent,
    MatExpansionModule,
    MatDialogModule,
    DataTableComponent,
    LoaderComponent,
    CreateClaimComponent,
    MatProgressSpinnerModule,
    MatExpansionModule,
    NgxDropzoneModule, MatSelectModule, FormsModule, HttpClientModule, RouterModule],
  templateUrl: './search-and-claim.component.html',
  styleUrls: ['./search-and-claim.component.scss']
})
export default class SearchAndClaimComponent implements OnInit {
  @Input() containerPanelOpened: boolean = true;
  isSearchView: boolean = true;
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
    // {
    //   label: 'QR Code',
    //   name: 'qrcode',
    //   type: 'qrcode',
    //   isSortable: true,
    //   position: "left",
    //   isChecked: true,
    //   index: 4,
    // },
    // {
    //   label: "FoundDate",
    //   name: "foundDate",
    //   type: "date",
    //   isSortable: true,
    //   position: "left",
    //   isChecked: true,
    //   index: 3,
    // },
    {
      label: 'Category',
      name: 'categoryName',
      type: 'text',  
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
      index: 5,
    },

  ]
  itemName: string | null = null;
  files: any[] = [];
  uplodedfilesdata: any[] = []
  matchedItems: any = [];
  initalDataResults: any = [];
  noresultsFound:boolean = false
  noresultsforItemsearch:boolean = false
  noresultsforPicturesearch:boolean = false
  noresultsforCtegerorysearch:boolean = false
  loader: boolean = false
  selectedFileName: string | null = null;
  items: any[] = [];
  showTooltip = true;
  searchResults: any = [];
  categeoryerror: boolean = false
  isLoading :boolean =  false;
  searchQuery: string = ''; // Current search query
  savedSearches: string[] = []; // List of saved searches
  selectedSavedSearch: string | null = null; // Currently selected saved search

  categories: any[] = [];

  displayedColumns: string[] = ['itemId', 'itemName', 'status', 'foundDate', 'categoryId', 'actions'];
  dataSource: any = [];
  categerorydata: any = [];
  private defaultSearchQuery = {
    limit: 15,
    offset: 0,
    sortBy: "desc",
    sortId: "foundDate",
  };
  isMobileView = false;
  selectedCategory: any;
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  @ViewChild(MatMenuTrigger) filterMenuTrigger!: MatMenuTrigger;
  searchCompleted!: boolean;
  pictureSearchCompleted!: boolean;
  categeorySearchCompleted!: boolean;
  constructor(private http: HttpClient, private route: ActivatedRoute,private cdr: ChangeDetectorRef, private snackBar: MatSnackBar, private matDialog: MatDialog, private claimService: ClaimitService) {
    this.loadSavedSearches();
  }
  private categoryIcons: { [key: string]: string } = {
    'Electronics': 'devices',
    'Personal Accessories': 'watch',
    'Clothes & Accessories': 'checkroom',
    'Work Tools': 'construction',
    'Storage Items': 'archive',
    'Groceries': 'shopping_cart',
    'Expensive Items': 'attach_money',
    'Uncategorized Items': 'help',
    'Toys and Baby Products': 'toys',
    'Bags': 'work',
    'Documents': 'description',
    'Home and Furniture': 'weekend',
    'Vehicles': 'directions_car',
    'Childcare Items': 'child_friendly',
    'Pets': 'pets',
    'Books & Publications': 'menu_book',
    'Musical Instruments': 'music_note',
    'Art & Craft Supplies': 'brush',
    'Fitness & Outdoor Equipment': 'fitness_center',
    'Medical Items': 'medical_services',
    'Tech Accessories': 'memory',
    'Travel Essentials': 'flight',
    'Food & Beverage Containers': 'lunch_dining',
    'Gaming Equipment': 'sports_esports',
    'Event Items': 'event',
    'Fashion Accessories': 'style',
    'Plants & Gardening Tools': 'yard',
    'Kitchen Appliances': 'kitchen'
  };
  showDelay = { value: 0 }; // Delay in milliseconds
  hideDelay = { value: 200 };
  categerySearchResult :boolean = false
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.itemName = params['id'];
      if (this.itemName) {
        this.searchQuery = this.itemName.toString();
        this.searchItems();
      }
    });
    this.loadCategories();
    this.checkViewport();
    this.showDelay.value = 0; // Set show delay to 500ms
    this.hideDelay.value = 200;
    this.listOfItems();

  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkViewport();
  }
  checkViewport() {
    this.isMobileView = window.innerWidth <= 768; // Mobile breakpoint
  }
  onRemove(file: any) {
    this.files = this.files.filter(f => f !== file);
  }
  searchItems() {
      this.claimService.searchItems(this.searchQuery).subscribe(
        (response: any) => {
          console.log("API Response:", response); // Debug API response
          if (response.message === "No items found matching your search") {
            this.noresultsFound = true;
            this.noresultsforItemsearch = true;
            this.initalDataResults = false;
          }
          if (Array.isArray(response)) {
            this.searchResults = response.filter(item => 
              item.status === "UNCLAIMED"|| item.status === "PENDING_APPROVAL" || item.status === "PENDING_PICKUP" || item.status === "CLAIMED"  || item.status === "REJECTED"
            );
            this.noresultsFound = false;
            this.cdr.detectChanges();
          } else {
            console.error("API response is not an array", response);
          }
          this.searchCompleted = true;
        },
        (error) => {
          console.error("Error fetching search results:", error);
          this.searchCompleted = true;
        }
      );
  }
  
listOfItems(){
  this.isLoading = true
  this.claimService.listOfItems(this.searchQuery).subscribe(
    (res: any) => {
      this.initalDataResults = res.data
      this.searchCompleted = true; 
      this.isLoading = false
    },
    (error) => {
      console.error('Error fetching search results:', error);
      this.searchCompleted = true; // Mark search as completed even on error
    }
  );
}
  closeTooltip() {
    this.showTooltip = false;
  }
  fetchCategories(): void {
    this.http.get<{ id: number; name: string }[]>('https://100.28.242.219.nip.io/api/admin/getcategories')
      .subscribe(
        (response) => {
          this.categories = response;
        },
        (error) => {
          console.error('Error fetching categories:', error);
        }
      );
  }
  onCategorySelect(categoryName: string): void {
    this.clearSearch()
    this.categerySearchResult = true
    this.selectedCategory = categoryName
    this.categerorydata = this.categories.filter(category => category.name === categoryName);
    this.search()
  }
  openFilterMenu(event: Event) {
    event.stopPropagation();
    this.filterMenuTrigger.openMenu();
  }
  public triggerFileInput(): void {
    if (this.fileInput && this.fileInput.nativeElement) {
      this.fileInput.nativeElement.click();
    } else {
      console.error('File input reference is null');
    }
  }
  public handleSort(sortParams: any) {
    this.defaultSearchQuery.sortBy = sortParams.direction;
    this.defaultSearchQuery.sortId = sortParams.active;
  }
  //categeory integration
  search(): void {
    this.searchResults = [];
       this.isLoading = true;
       this.claimService.searchItems(this.selectedCategory).subscribe(
      (data: any) => {
        if( data.message= "No items found matching your search"){
          this.noresultsFound = true
          this.noresultsforCtegerorysearch = true
          this.initalDataResults = false
           }
        if (Array.isArray(data)) {
          this.categerorydata = data.filter(item => item.status === "UNCLAIMED"|| item.status === "PENDING_APPROVAL" || item.status === "PENDING_PICKUP" || item.status === "CLAIMED" || item.status === "REJECTED");
             this.isLoading = false;
             this.noresultsFound = false
             this.noresultsforCtegerorysearch = false
          if (this.categerorydata.length === 0) {
            this.categeoryerror = true;
          } else {
            this.categeoryerror = false;
          }
        } else {
             this.isLoading = false;
          this.categeoryerror = true;
        }
      },
      (error: any) => {
        console.error('API Error:', error);
           this.isLoading = false;
      }
    );
  }

  applySavedSearch() {
    if (this.selectedSavedSearch) {
      this.searchQuery = this.selectedSavedSearch;
      this.searchItems();
    }
  }
  clearSearch() {
    this.noresultsforCtegerorysearch = false
    this.noresultsforItemsearch = false
    this.noresultsforPicturesearch = false
    this.noresultsFound = false
    this.searchQuery = '';
    this.searchResults = [];
    this.matchedItems = [];
    this.categerorydata = [];
    this.files = [];
    this.selectedFileName = null
    this.selectedCategory = null;
    this.searchCompleted = false;
    this.pictureSearchCompleted = false;
    this.listOfItems()
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
  clearcategory() {
    this.categerorydata = []
  }
  selectCategory(category: string) {
    this.searchResults = [];
    this.matchedItems = [];
    this.selectedCategory = category;
    this.search();
  }

  // Fetch categories from API
fetchCategories1(): void {
  this.http.get<{ id: number; name: string }[]>('https://100.28.242.219.nip.io/api/admin/getcategories')
    .subscribe(
      (response) => {
        this.categories = response;
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
}

// Select a category and perform search
selectCategory1(categoryName: string): void {
  this.searchResults = []; // Reset previous results
  this.matchedItems = [];
  this.selectedCategory = categoryName;
  this.categerySearchResult = true;
  this.categerorydata = this.categories.filter(category => category.name === categoryName);
  this.search();
}

  public onSelect(event: any): void {
    const files =  this.isMobileView ?event.target.files : event.addedFiles;
    if (files && files.length > 0) {
      const file = files[0];
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp', 'image/jfif'];
      if (!allowedTypes.includes(file.type)) {
        const dialogRef = this.matDialog.open(FormSubmissionModalComponent, {
          width: '500px',
          data: {
            status: 'Error',
            msg: 'Only JPG, JPEG, PNG, GIF, BMP, and JFIF image formats are allowed.',
            btnName: 'OK',
          },
        });

        dialogRef.afterClosed().subscribe(() => { });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        this.files.push({
          file: file,
          preview: reader.result as string,
        });
      };
      reader.readAsDataURL(file);
      this.pictureSearchCompleted = false
      this.uploadImage(file).subscribe(
        (response) => {
          if (response.success) {
            this.matchedItems = response.matchedItems.filter((item: { status: string; }) => item.status === "UNCLAIMED"|| item.status === "PENDING_APPROVAL" || item.status === "PENDING_PICKUP" || item.status === "CLAIMED"  || item.status === "REJECTED");
            if( response.message == "No matching items found."){  
              this.initalDataResults = false
              this.noresultsFound = true;
              this.isLoading = false
               }
          } else {
            this.pictureSearchCompleted = true
          }

        },
        (error) => {
          this.isLoading = false
          console.error('Error uploading image:', error);
        }
      );
    }
  }
  onCategoryChange(selected: string | null): void {
    // Update the selected category
    this.selectedCategory = selected;
  
    // Clear previous category data
    this.categerorydata = [];
    this.searchResults = [];
    this.noresultsFound = false;
    this.categeoryerror = false;
  
    // Perform a search only if a category is selected
    if (this.selectedCategory) {
      this.search();
    }
  }
  getCategoryIcon(name: string): string {
    return this.categoryIcons[name] || 'help';
  }
  loadCategories(): void {
    this.http.get<any[]>('https://100.28.242.219.nip.io/api/admin/getcategories')
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          this.isLoading = false
          console.error('Error loading categories:', err);
        }
      });
  }

  public onImportToExcel() {
    this.files = []
  }
   onFileSelect(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.files = Array.from(input.files);
      this.selectedFileName = this.files[0].name;
      this.isLoading = true
      this.uploadImage(this.files[0]).subscribe((response: any) => {
        if( response.message= "No matching items found."){          
          this.initalDataResults = false
          this.noresultsFound = true;
          this.isLoading = false
           }
        this.matchedItems = response.matchedItems.filter((item: { status: string; }) =>item.status === "UNCLAIMED"|| item.status === "PENDING_APPROVAL" || item.status === "PENDING_PICKUP" || item.status === "CLAIMED"  || item.status === "REJECTED") || [];
        this.isLoading = false
        this.noresultsFound = false
      });
      
    }
  }

  public uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);
    const picUrl = 'https://100.28.242.219.nip.io/api/users/search-by-image';
    return this.http.post(picUrl, formData, {
      headers: new HttpHeaders(),
    });
  }

  claimItem(item: Item) {
    const dialogRef = this.matDialog.open(CreateClaimComponent, {
      width: "500px",
      height: '250px',
      data: {
        requiredData: item,
        title: 'Request Claim'
      },
    });
  
    dialogRef.afterClosed().subscribe((data: any) => {
      if (data) {
        const REQBODY = {
          name: data.value.name,
          email: data.value.email,
          itemId: item.itemId
        };
  
        this.isLoading = true;
  
        this.claimService.createClaimRequest(REQBODY).subscribe(
          (Res: any) => {
            this.isLoading = false; 
  
            if (Res) {
              const successDialogRef = this.matDialog.open(FormSubmissionModalComponent, {
                width: "500px",
                data: {
                  status: 'Success',
                  msg: 'Claim Request Created successfully',
                  btnName: "OK",
                },
              });
  
              successDialogRef.afterClosed().subscribe(() => {
                this.isLoading = false; 
                this.listOfItems();
              });
            }
          },
          (error) => {
            this.isLoading = false; 
            console.error("Claim Request Error:", error);
            this.showSnackBar("Failed to create claim request. Please try again.");
          }
        );
      }
    });
  }
  
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
  
  previewImage(event: any) {
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
