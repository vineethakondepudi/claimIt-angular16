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
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FooterComponent } from 'src/app/@amc/components/footer/footer.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
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
    MatProgressSpinnerModule,
    MatExpansionModule,
    NgxDropzoneModule, MatSelectModule, FormsModule, HttpClientModule],
  templateUrl: './search-and-claim.component.html',
  styleUrls: ['./search-and-claim.component.scss']
})
export default class SearchAndClaimComponent {
  constructor(private http: HttpClient,private route: ActivatedRoute) {}
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
  files: File[] = [];
  uplodedfilesdata: any[] = []
  matchedItems: any = [];
  items: any[] = [];
  searchResults: any = [];
  categeoryerror: boolean = false
  searchQuery: string = '';
  foods = [
    { value: 'Apparel', viewValue: 'Apparel' },
    { value: 'Footwear', viewValue: 'Footwear' },
    { value: 'Miscellaneous ', viewValue: 'Miscellaneous' },
    { value: 'Others', viewValue: 'Others' }
  ];
  displayedColumns: string[] = ['itemId', 'itemName', 'status', 'foundDate', 'categoryId', 'actions'];
  dataSource: any = [];
  categerorydata: any = [];

  selectedCategory: string = '';
  ngOnInit() {
    // Check if there's an itemId in the query parameters
    this.route.queryParams.subscribe(params => {
      this.itemName = params['id']; // Get the item ID from the query parameters
      if (this.itemName) {
        this.searchQuery = this.itemName.toString(); // Use the itemId as the search query
        this.searchItems(); // Call searchItems method when the itemId is present
      }
    });
  }
  public onRemove(event: any) {
    this.uplodedfilesdata.splice(this.uplodedfilesdata.indexOf(event), 1)
    if (this.files.length > 0) {
      this.files.splice(this.files.indexOf(event), 1)
    }
  }
  //itemsearch integration code 
  searchItems() {
    if (this.searchQuery.trim()) {
      const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${encodeURIComponent(this.searchQuery)}`;

      this.http.get<Item[]>(apiUrl).subscribe(
        (response: Item[]) => {
          this.searchResults = response;
        },
        (error: any) => {
        }
      );
    } else {
    }
  }

  //categeory integration
  search(): void {
    const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${this.selectedCategory}`;
    this.http.get<any[]>(apiUrl).subscribe(
      (data: any) => {
        this.categerorydata = data; // Directly set if it's an array
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
  SearchAndClear(type: any) {
    if (type === 'clear') {
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
  //picture upload integration 
  public onSelect(event: any): void {
    const files = event.addedFiles;
    if (files && files.length > 0) {
      const file = files[0]; // Assuming one file is selected

      this.uploadImage(file).subscribe(
        (response) => {
          console.log('Image uploaded successfully:', response.message);
          this.matchedItems = response.matchedItems; // Store the matched items
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }
  getCategoryIcon(value: string): string {
    switch (value) {
      case 'Apparel':
        return 'checkroom'; // Icon for Apparel
      case 'Footwear':
        return 'sports_handball'; // Icon for Footwear
      case 'Miscellaneous':
        return 'category'; // Icon for Miscellaneous
      case 'Others':
        return 'more_horiz'; // Icon for Others
      default:
        return 'help';
    }
  }
  uploadImage(file: File): Observable<any> {
    // Create FormData to send the file in the body of the POST request
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    const picUrl = 'http://172.17.12.38:8081/api/users/uploadImageForSearch';

    // Sending POST request with FormData containing the image
    return this.http.post(picUrl, formData, {
      headers: new HttpHeaders(),
    });
  }


  public onImportToExcel() {
    this.files = []
  }
}
