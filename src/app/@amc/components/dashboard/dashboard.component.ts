import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { MatTableModule } from '@angular/material/table'
import { MatCardModule } from '@angular/material/card'
import { MatDividerModule } from '@angular/material/divider'
import { MatIconModule } from '@angular/material/icon'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatToolbarModule } from '@angular/material/toolbar'
import { HttpClient } from '@angular/common/http'
import { MatDialog, MatDialogModule } from '@angular/material/dialog'
import { SearchResultsDialogComponent } from '../search-results-dialog/search-results-dialog.component'
import { FooterComponent } from '../footer/footer.component'
import { FormFooterComponent } from '../form-footer/form-footer.component'

interface CheckIn {
  name: string
  type: string
  appointmentId: string
}
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
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule,MatIconModule,MatCardModule, MatDividerModule, MatToolbarModule,MatDialogModule,
    MatCardModule,
    FooterComponent,
    FormFooterComponent,
    MatButtonModule,
    MatInputModule,
    MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export default class DashboardComponent {
  constructor(private http: HttpClient, private dialog: MatDialog) {}
  searchQuery: string = '';
  searchResults: any= [];
  recentItems = [
    {
      title: 'Lost Wallet',
      date: '2024-12-01',
      description: 'Black leather wallet with multiple cards inside. Lost near City Mall.'
    },
    {
      title: 'Lost Phone',
      date: '2024-12-03',
      description: 'iPhone 12 Pro with a blue case. Lost in Central Park.'
    },
    {
      title: 'Lost Passport',
      date: '2024-12-04',
      description: 'Indian passport with the name John Doe. Misplaced at the airport.'
    }
  ];
  onSearchInput(event: Event): void {
    // Cast the event target to HTMLInputElement
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value; // Ensure searchQuery updates correctly
  }
  searchItems() {
    if (this.searchQuery.trim()) {
      const apiUrl = `http://172.17.12.38:8081/api/users/search?query=${encodeURIComponent(this.searchQuery)}`;
      
      this.http.get<Item[]>(apiUrl).subscribe(
        (response: Item[]) => {
          this.searchResults = response;
          console.log('Search results:', response);
          this.dialog.open(SearchResultsDialogComponent, {
            data: this.searchResults
          });
          // Handle the response here
        },
        (error: any) => {
          console.error('Search error:', error);
        }
      );
    } else {
    }
  }

  
}
