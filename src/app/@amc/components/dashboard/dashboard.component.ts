import { Component, ViewChild } from '@angular/core'
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
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, ChartEvent, Chart, ChartData } from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import Swiper from 'swiper'
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
    NgChartsModule,
    FooterComponent,
    FormFooterComponent,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export default class DashboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) piechart: BaseChartDirective | undefined;
  role:any
  constructor(private http: HttpClient, private dialog: MatDialog) {
    this.role = localStorage.getItem('role');
  }
  public pieChartType: ChartType = 'pie';
  public barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  doughnutChartType: ChartType = 'doughnut';
  searchQuery: string = '';
  swiper: Swiper | undefined;
  searchResults: any= [];
  pieChartLabels = ['Electronics', 'Accessories', 'Documents'];
  pieChartData = {
    labels: this.pieChartLabels,
    datasets: [
      {
        data: [50, 25, 25],
        backgroundColor: ['#FF5733', '#33FF57', '#3357FF'], // Customize colors if needed
      },
    ],
  };

  barChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Electronics',
        data: [65, 59, 80, 81, 56, 55, 40],
        backgroundColor: '#FF5733',
      },
      {
        label: 'Accessories',
        data: [28, 48, 40, 19, 86, 27, 90],
        backgroundColor: '#33FF57',
      },
      {
        label: 'Documents',
        data: [18, 48, 77, 9, 100, 27, 40],
        backgroundColor: '#3357FF',
      },
    ],
  };
  barChartLabels = this.barChartData.labels;

  lineChartData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Claimed Items',
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: 'Unclaimed Items',
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  };
  lineChartLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

  doughnutChartData = {
    labels: ['Claimed', 'Unclaimed'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#FF5733', '#33FF57'], 
      },
    ],
  };
  doughnutChartLabels = this.doughnutChartData.labels;
  countdownTimers: any[] = []; 
  ngOnInit(): void {
    this.startCountdown();
    this.fetchSlides();
  }
  ngOnDestroy(): void {
    this.countdownTimers.forEach(timer => clearInterval(timer));
  }
  startCountdown() {
    setInterval(() => {
      this.pendingDonations.forEach((donation) => {
        const currentTime = new Date().getTime();
        const timeDiff = donation.createdAt + 30 * 24 * 60 * 60 * 1000 - currentTime; 

        if (timeDiff > 0) {
          donation.remainingTime = this.formatTime(timeDiff);
        } else {
          donation.remainingTime = 'Time is up! Donated';
        }
      });
    }, 1000);
  }

  startCountdown1(item: any): void {
    item.remainingTime = this.calculateTimeRemaining(item.foundDate);
    const timer = setInterval(() => {
      item.remainingTime = this.calculateTimeRemaining(item.foundDate);
      if (item.remainingTime === 'Expired') {
        clearInterval(timer);
      }
    }, 1000); 
    this.countdownTimers.push(timer);
  }
  

  ngAfterViewInit() {
    this.swiper = new Swiper('.swiper-container', {
      slidesPerView: 3,
      spaceBetween: 15,

      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 1,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 15,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 20,
        },
      },
    });
  }
  formatTime(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
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
  slides: Array<{ title: string; date: string; description: string; image: string; foundDate:string; remainingTime:any}> = [];
  charityPartners = [
    { name: 'Charity A', description: 'Focus: Education support for underprivileged children.' },
    { name: 'Charity B', description: 'Focus: Food distribution to homeless communities.' },
    { name: 'Charity C', description: 'Focus: Disaster relief and medical aid.' },
  ];
  pendingDonations = [
    { title: 'Unclaimed Wallet', createdAt: new Date('2024-11-19').getTime(), remainingTime: '' },
    { title: 'Lost Watch', createdAt: new Date('2024-11-15').getTime(), remainingTime: '' },
  ];
  onSearchInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value; 
  }
  fetchSlides(): void {
    const apiUrl = 'http://172.17.12.38:8081/api/users/search';
    this.http.get<any[]>(apiUrl).subscribe({
      next: (data) => {
        this.slides = data.map((item) => {
          const remainingTime = this.calculateTimeRemaining(item.foundDate);
  
          return {
            title: item.title || 'Untitled',
            date: item.date || 'Unknown Date',
            description: item.description || 'No Description',
            image: item.image || 'https://via.placeholder.com/150',
            foundDate: item.foundDate || 'Unknown Date',
            remainingTime: remainingTime
          };
        });
        this.slides.forEach(item => this.startCountdown1(item));
      },
      error: (err) => {
        console.error('Error fetching slides:', err);
      }
    });
  }
  
  calculateTimeRemaining(foundedDate: string): string {
    const foundDate = new Date(foundedDate);
    const targetDate = new Date(foundDate);
    targetDate.setDate(foundDate.getDate() + 30); 
  
    const now = new Date();
    const timeDiff = targetDate.getTime() - now.getTime();
  
    if (timeDiff <= 0) {
      return 'Expired';
    }
  
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
  
    return `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  openDialog(charity: any): void {
    this.dialog.open(SearchResultsDialogComponent, {
      width: '400px',
      data: charity,
    });
  }
  charities = [
    { name: 'Charity A', focus: 'Education', description: 'Supporting education for underprivileged children.' },
    { name: 'Charity B', focus: 'Food Distribution', description: 'Providing meals to those in need.' },
  ];
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
        },
        (error: any) => {
          console.error('Search error:', error);
        }
      );
    } else {
    }
  }

  
  
}