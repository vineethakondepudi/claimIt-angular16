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
import { ChartConfiguration, ChartType, ChartEvent, Chart, ChartData, ChartOptions } from 'chart.js';
import { MatSelectModule } from '@angular/material/select';
import Swiper from 'swiper'
import { LoaderComponent } from '../loader/loader.component'
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service'
import { FormsModule } from '@angular/forms'
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component'
import { ChangeDetectorRef } from '@angular/core';

interface CheckIn {
  name: string
  type: string
  appointmentId: string
}
interface Item {
  itemId: number;
  itemName: string;
  status: string;
  name: string;
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
  imports: [CommonModule, MatTableModule, MatIconModule, MatCardModule, MatDividerModule, MatToolbarModule, MatDialogModule,
    MatCardModule,
    NgChartsModule,
    FooterComponent,
    FormFooterComponent,
    MatSelectModule,
    LoaderComponent,
    MatTooltipModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export default class DashboardComponent {
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) piechart: BaseChartDirective | undefined;
  role: any
  pieChart: any = []
  pieChartLabels: any
  constructor(private claimService: ClaimitService, private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.role = localStorage.getItem('role');
  }
  public pieChartType: ChartType = 'pie';
  public barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  showMore = false;
  doughnutChartType: ChartType = 'doughnut';
  searchQuery: string = '';
  swiper: Swiper | undefined;
  loader: boolean = false;
  selectedMonth: Date = new Date();
  currentMonth: any = [];
  monthName: any = [];
  currentMonthData: any = {
    totalItems: 0,
    claimed: 0,
    unclaimed: 0,
    donated: 0,
    pendingApproval: 0,
    pendingPickup: 0,
    rejected: 0,
  };

  categoryData: Array<{ categoryName: string; itemCount: number }> = [];

  searchResults: any = [];

  donationHistory = [
    { item: 'Lost Wallet', donationDate: new Date('2024-12-15'), charity: 'ABC Charity' },
    { item: 'Found Phone', donationDate: new Date('2024-12-18'), charity: 'XYZ Charity' },
    { item: 'Lost Jacket', donationDate: new Date('2024-12-22'), charity: 'DEF Charity' },
  ];
  newExperience = {
    text: '',
    author: ''
  };

  experiences = [
    { text: 'I lost my wallet at a park and found it thanks to this platform. A lifesaver!', author: 'Poonam Gupta' },
    { text: 'I was able to return a found phone to its owner. Amazing experience!', author: 'Krishna Vedantam' }
  ];


  lineChartData: ChartData = {
    labels: this.monthName == '' ? "dec" : this.monthName,
    datasets: [
      {
        label: 'Claimed Items',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(0, 128, 0, 0.5)', // Green with transparency
        borderColor: 'green', // Line color
        fill: false, // Fills the area under the line
      },
      {
        label: 'Unclaimed Items',
        data: [0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 255, 0, 0.5)',
        borderColor: 'yellow',
        fill: false,
      },
    ],
  };

  lineChartLabels = this.lineChartData.labels;

  doughnutChartData = {
    labels: ['Claimed', 'Unclaimed', 'Donated'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['green', 'yellow', 'red'],
      },
    ],
  };
  doughnutChartLabels = this.doughnutChartData.labels;
  countdownTimers: any[] = [];

  ngOnInit(): void {
    this.startCountdown();
    this.fetchSlides();
    this.currentMonth = this.selectedMonth.getMonth() + 1;
    const currentYear = this.selectedMonth.getFullYear();
    this.statusCount(this.currentMonth, currentYear);
    this.categoryItems(this.currentMonth, currentYear);

  }
  ngOnDestroy(): void {
    this.countdownTimers.forEach(timer => clearInterval(timer));
  }
  addExperience() {
    if (this.newExperience.text && this.newExperience.author) {
      this.experiences.push({ ...this.newExperience });
      this.newExperience.text = '';
      this.newExperience.author = '';
    }
  }
  toggleShowMore() {
    this.showMore = !this.showMore;
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
  shareItem(item: any) {
    const itemUrl = `https://example.com/item/${item.id}`; 
    const shareText = `Found a lost item: ${item.title}. More details: ${itemUrl}`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(itemUrl)}`;
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank', 'width=600,height=400,resizable=yes');
  }
  startCountdown1(item: any): void {
    item.remainingTime = this.calculateTimeRemaining(item.expirationDate);
    const timer = setInterval(() => {
      item.remainingTime = this.calculateTimeRemaining(item.expirationDate);
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
  slides: any;
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
    this.loader = true
    const apiUrl = 'http://172.17.12.38:8081/api/users/search';
    this.claimService.getUSerSlides().subscribe({
      next: (data: any) => {
        this.slides = data.map((item: any) => {
          const remainingTime = this.calculateTimeRemaining(item.expirationDate);

          return {
            title: item.title || 'Untitled',
            date: item.date || 'Unknown Date',
            description: item.description || 'No Description',
            image: item.image || 'https://via.placeholder.com/150',
            expirationDate: item.expirationDate || 'Unknown Date',
            remainingTime: remainingTime
          };
        });
        this.slides.forEach((item: any) => this.startCountdown1(item));
        this.loader = false
      },
      error: (err) => {
        console.error('Error fetching slides:', err);
      }
    });
  }

  calculateTimeRemaining(foundedDate: string): string {
    const expirationDate = new Date(foundedDate);
    const targetDate = new Date(expirationDate);
    targetDate.setDate(expirationDate.getDate() + 30);

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
  openCalendarDialog(): void {
    const dialogRef = this.dialog.open(CalendarDialogComponent, {
      width: '400px',
      data: { selectedDate: this.selectedMonth },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const { month, year } = result;
        this.selectedMonth = new Date(year, month - 1);
        this.statusCount(month, year);
        this.categoryItems(month, year);
        this.monthName = this.selectedMonth.toLocaleString('default', { month: 'long' })
      }
    });
  }

  statusCount(month: number, year: number): void {
    this.claimService.statusCount(month.toString(), year).subscribe({
      next: (res: any) => {
        if (res && res.length > 0) {

          const data = res[0];
          this.currentMonthData.totalItems = data.totalItems;
          this.currentMonthData.claimed = data.claimed;
          this.currentMonthData.unclaimed = data.unclaimed;
          console.log(this.currentMonthData.claimed);

          this.currentMonthData.donated = this.currentMonthData.totalItems -
            (this.currentMonthData.claimed + this.currentMonthData.unclaimed);
          this.updateDoughnutChartData();
        } else {

          this.currentMonthData = {
            totalItems: 0,
            claimed: 0,
            unclaimed: 0,
            donated: 0,
            pendingApproval: 0,
            pendingPickup: 0,
            rejected: 0,
          };
        }
      },
      error: (err) => {
        console.error('Error fetching status count:', err);
      },
    });
  }

  PieChartData: any = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
      },
    ],
  };
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
  };

  updatedPieChartData(labels: string[], dataPoints: number[]): void {
    console.log('Updating chart data:', labels, dataPoints);

    this.PieChartData.labels = [...labels];
    this.PieChartData.datasets[0].data = [...dataPoints];
    this.PieChartData.datasets[0].backgroundColor = labels.map(() =>
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
    );


    this.PieChartData = { ...this.PieChartData };
  }

  categoryItems(month: number, year: number): void {
    console.log('Fetching data for month:', month, 'year:', year);

    this.claimService.categoryItems(month.toString(), year).subscribe((res: any) => {
      const labels = res.map((item: any) => item.categoryName);
      const dataPoints = res.map((item: any) => item.itemCount);

      console.log('Labels:', labels, 'Data Points:', dataPoints);
      this.updatedPieChartData(labels, dataPoints);
    });
  }

  updateDoughnutChartData(): void {
    this.doughnutChartData = {
      labels: ['Claimed', 'Unclaimed', 'Donated'],
      datasets: [
        {
          data: [
            this.currentMonthData.claimed,
            this.currentMonthData.unclaimed,
            this.currentMonthData.donated,
          ],
          backgroundColor: ['green', 'yellow', 'red'],
        },
      ],
    };



    this.lineChartData = {
      labels: [this.monthName],
      datasets: [
        {
          label: 'Claimed Items',
          data: [this.currentMonthData.claimed,],
          backgroundColor: 'rgba(0, 128, 0, 0.5)',
          borderColor: 'green',
          fill: false,
        },
        {
          label: 'Unclaimed Items',
          data: [this.currentMonthData.unclaimed],
          backgroundColor: 'rgba(255, 255, 0, 0.5)',
          borderColor: 'yellow',
          fill: false,
        },
      ],
    };
    this.cdr.detectChanges();
  }





}