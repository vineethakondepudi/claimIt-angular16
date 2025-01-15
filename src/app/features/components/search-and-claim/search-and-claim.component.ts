import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
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
import { MatSnackBar } from '@angular/material/snack-bar';
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
export default class SearchAndClaimComponent implements OnInit {
  @Input() containerPanelOpened: boolean = true;
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
    //   label: "FoundDate",
    //   name: "foundDate",
    //   type: "date",
    //   isSortable: true,
    //   position: "left",
    //   isChecked: true,
    //   index: 3,
    // },
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
  loader:boolean = false
  items: any[] = [];
  searchResults: any = [];
  categeoryerror: boolean = false
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
  selectedCategory: string = '';
  @ViewChild('fileInput') fileInput: ElementRef<HTMLInputElement> | undefined;
  constructor(private http: HttpClient, private route: ActivatedRoute,private snackBar: MatSnackBar, private matDialog: MatDialog,private claimService:ClaimitService) {
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
    if (this.searchQuery.trim() !== '') {
      const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${encodeURIComponent(this.searchQuery)}`;
  
      this.http.get<any[]>(apiUrl).subscribe(
        (response) => {
          if (Array.isArray(response)) {
            const normalizedQuery = this.searchQuery.trim().toLowerCase();
            const ignoreWords = ["i", "lost", "my", "missed", "the", "a", "and", "to", "is", "on", "of", "in", "for", "with"];
            const queryWords = normalizedQuery
              .split(' ')
              .filter(word => word && !ignoreWords.includes(word));
  
            console.log('Filtered Query Words:', queryWords);  
  
            this.searchResults = response.filter(item => {
              const { dominantColor, title, description, itemName } = item;
              const isMatch = queryWords.some(queryWord =>
                (dominantColor && dominantColor.toLowerCase().includes(queryWord)) ||
                (title && title.toLowerCase().includes(queryWord)) ||
                (description && description.toLowerCase().includes(queryWord)) ||
                (itemName && itemName.toLowerCase().includes(queryWord))
              );
              return isMatch;
            });
          } else {
            console.error('API response is not an array', response);
          }
        },
        (error) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
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
    this.loader = true;
  
    const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${this.selectedCategory}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (data: any) => {
        if (Array.isArray(data)) {
          this.categerorydata = data; 
          console.log(this.categerorydata, 'matcheditems1');
          this.loader = false;
          console.log(this.categerorydata, 'categerorydata');
  
          // Check if the array is empty
          if (this.categerorydata.length === 0) {
            this.categeoryerror = true; // No items found
          } else {
            this.categeoryerror = false; // Items found
          }
        } else {
          // If data is not an array, handle the unexpected response
          console.error('Unexpected API response format:', data);
          this.loader = false;
          this.categeoryerror = true;
        }
      },
      (error: any) => {
        console.error('API Error:', error);
        this.loader = false;
      }
    );
  }
  
  saveSearch() {
    if (this.searchQuery.trim() !== '') {
      if (!this.savedSearches.includes(this.searchQuery)) {
        this.savedSearches.push(this.searchQuery);
        localStorage.setItem('savedSearches', JSON.stringify(this.savedSearches));
        this.snackBar.open('Search saved successfully!', 'Close', {
          duration: 3000,
          horizontalPosition: 'right', 
          verticalPosition: 'top',    
        });
      } else {
        this.snackBar.open('This search is already saved.', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
        });
      }
    } else {
      this.snackBar.open('Search query cannot be empty.', 'Close', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
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
    this.matchedItems = [];
    this.categerorydata = [];
    this.files = []
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
    this.searchResults = [];
    this.matchedItems = [];
    this.selectedCategory = category;
    this.search();
  }
  public onSelect(event: any): void {
    const files = event.target.files; // For traditional file input, access files here
    console.log(files, 'files'); // Check if files are correctly passed
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
  
        dialogRef.afterClosed().subscribe(() => {});
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
  
      // Upload image
      this.uploadImage(file).subscribe(
        (response) => {
          this.matchedItems = response.matchedItems;
          console.log(this.matchedItems, 'matcheditems');
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
  getCategoryIcon(name: string): string {
    return this.categoryIcons[name] || 'help'; 
  }
  loadCategories(): void {
    this.http.get<any[]>('http://172.17.12.38:8081/api/admin/getcategories')
      .subscribe({
        next: (data) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error loading categories:', err);
        }
      });
  }

  public uploadImage(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    const picUrl = 'http://172.17.12.38:8081/api/users/search-by-image';
    console.log('Uploading file:', file); // Debugging line to check if file is passed correctly
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
