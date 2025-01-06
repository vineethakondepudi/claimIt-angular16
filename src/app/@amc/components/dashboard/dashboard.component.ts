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
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CalendarDialogComponent } from '../calendar-dialog/calendar-dialog.component'
import { ChangeDetectorRef } from '@angular/core';
import { QRCodeModule } from 'angularx-qrcode';
import { GoogleMapsModule } from '@angular/google-maps';
import * as esri from 'esri-leaflet';
import * as L from 'leaflet';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
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
  imports: [CommonModule,QRCodeModule, MatTableModule, MatIconModule, MatCardModule, MatDividerModule, MatToolbarModule, MatDialogModule,
    MatCardModule,
    NgChartsModule,
    FooterComponent,
    FormFooterComponent,
    GoogleMapsModule,
    MatSelectModule,
    FontAwesomeModule,
    MatMenuModule ,
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
  private map!: L.Map;
  private mapTilerKey = 'xJWFJF5JvkaPr6hJCReR';
  icons = {
    whatsapp: faWhatsapp,
    linkedin: faLinkedin,
    twitter: faTwitter,
  };
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @ViewChild(BaseChartDirective) piechart: BaseChartDirective | undefined;
  role: any
  pieChart: any = []
  pieChartLabels: any
  // cdRef: any
  constructor(private claimService: ClaimitService, private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.role = localStorage.getItem('role');
  }
  public pieChartType: ChartType = 'pie';
  public barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  showMore = true;
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
    this.slides = this.slides || [];
     this.initializeMap();
    this.startCountdown();
    this.fetchSlides();
    this.currentMonth = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = this.selectedMonth.getFullYear();
    console.log(this.currentMonth,currentYear,163);
    
    this.statusCount(this.currentMonth, currentYear);
    this.categoryItems(this.currentMonth, currentYear);
    this.monthName = this.selectedMonth.toLocaleString('default', { month: 'long' });
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
  shareItem(item: any, platform: string) {
    const itemUrl = `https://example.com/item/${item.id}`; // Adjust with your actual item URL
    const shareText = `Found a lost item: ${item.title}. More details: ${itemUrl}`;
    
    let shareUrl = '';
  
    switch (platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(itemUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
        break;
      default:
        console.error('Unsupported platform');
        return;
    }
  
    window.open(shareUrl, '_blank');
  }
  private initializeMap(): void {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) {
      console.error('Map container not found!');
      return;
    }

    this.map = L.map('map', {
      center: [18.000792934619952, 83.52597181488764],
      zoom: 10,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    
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
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      }, 
    });
    this.initializeMap();
  }
  formatTime(ms: number): string {
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    const hours = Math.floor((ms % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    return `${days} days ${hours} hours ${minutes} minutes ${seconds} seconds`;
  }
  generateDonationQrCode(item: any): string {
    const donationLink = `https://www.charitywebsite.com/donate?itemId=${item.itemId}`;
    return donationLink;
  }
  donateToCharity(item: any) {
    window.open(`https://www.charitywebsite.com/donate?itemId=${item.itemId}`, '_blank');
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
    this.loader = true;
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
            latitude: item.latitude,
            longitude: item.longitude,
            remainingTime: remainingTime,
            locationName: null,  
            foundDate: item.receivedDate || 'Unknown Date',
          };
        });
        this.slides.forEach((item: any) => this.startCountdown1(item));
        this.loader = false;
      },
      error: (err) => {
        console.error('Error fetching slides:', err);
      }
    });
  }
  
  getLocation(items: any | any[]): void {
    if (Array.isArray(items)) {
      items.forEach(item => this.processLocation(item));
    } else {
      this.processLocation(items);
    }
  }
  
  private processLocation(item: any): void {
    const lat = item.latitude;
    const lon = item.longitude;
    if (lat && lon && !isNaN(lat) && !isNaN(lon)) {
      this.fetchLocationName(lat, lon, item);
      // console.log(lat,lon,'latitiude')
    } else {
      item.locationName = 'Invalid coordinates';
    }
  }
  
  private fetchLocationName(lat: number, lon: number, item: any): void {
    
    const apiUrl = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=xJWFJF5JvkaPr6hJCReR`;
    console.log(lat,lon,'latitiude')
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        item.locationName = data?.features?.[0]?.place_name || 'Unknown Location';
        this.cdr.detectChanges();
      })
      .catch(error => {
        console.error('Error fetching location:', error);
        item.locationName = 'Unable to fetch location';
        this.cdr.detectChanges();
      });
  }
  
  
  toggleLocationVisibility(item: any): void {
    item.showLocation = !item.showLocation;
    if (item.showLocation && !item.locationName) {
      this.fetchLocationName(item.latitude, item.longitude, item);
    }
  }
 
  

// Optionally trigger change detection
forceUpdate(): void {
  this.cdr.detectChanges();
}


  calculateTimeRemaining(expirationDate: string): string {
    const expiration = new Date(expirationDate);
    const now = new Date();
    const timeDiff = expiration.getTime() - now.getTime();
  
    if (timeDiff <= 0) {
      return 'Expired';
    }
  
    const days = Math.floor(timeDiff / (1000 * 3600 * 24));
    const hours = Math.floor((timeDiff % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((timeDiff % (1000 * 3600)) / (1000 * 60));
  
    return `${days}d ${hours}h ${minutes}m`;
  }
  isTimeisup(item: any): boolean {
    const expirationDate = new Date(item.expirationDate);
    const now = new Date();
    return expirationDate < now;
  }
  get filteredSlides(): any[] {
  return (this.slides || []).filter((item: any) => !this.isTimeisup(item));
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
          this.currentMonthData.donated = data.rejected+data.archived
          this.updateDoughnutChartData();
          console.log(res,409);
          
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
  public barChartData: any = {
    labels: [],
    datasets: [
      {
        label: [],
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
  updatedBarChartData(labels: string[], dataPoints: number[]): void {
    console.log('Updating bar chart data:', labels, dataPoints);
  
    this.barChartData.labels = [...labels];
    this.barChartData.datasets.label = [...dataPoints];
    this.barChartData.datasets[0].data = [...dataPoints];
    this.barChartData.datasets[0].backgroundColor = labels.map(() =>
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
    );
  
    this.barChartData = { ...this.barChartData };
  }
  categoryItems(month: number, year: number): void {
    console.log('Fetching data for month:', month, 'year:', year);

    this.claimService.categoryItems(month.toString(), year).subscribe((res: any) => {
      const labels = res.map((item: any) => item.categoryName);
      const dataPoints = res.map((item: any) => item.itemCount);

      console.log('Labels:', labels, 'Data Points:', dataPoints);
      this.updatedPieChartData(labels, dataPoints);
      this.updatedBarChartData(labels, dataPoints);
    });
  }

  generateChartColors(count: number): string[] {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(
        `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
      );
    }
    return colors;
  }
  

  updateDoughnutChartData(): void {
    const colors = this.generateChartColors(3);
    this.doughnutChartData = {
      labels: ['Claimed', 'Unclaimed', 'Donated'],
      datasets: [
        {
          data: [
            this.currentMonthData.claimed,
            this.currentMonthData.unclaimed,
            this.currentMonthData.donated,
          ],
          backgroundColor: colors,
        },
      ],
    };

    const lineChartColors = this.generateChartColors(2);

    this.lineChartData = {
      labels: [this.monthName],
      datasets: [
        {
          label: 'Claimed Items',
          data: [this.currentMonthData.claimed,],
          backgroundColor: lineChartColors[0],
          borderColor: lineChartColors[0],
          fill: false,
        },
        {
          label: 'Unclaimed Items',
          data: [this.currentMonthData.unclaimed],
          backgroundColor:lineChartColors[1],
          borderColor: lineChartColors[1],
          fill: false,
        },
      ],
    };
    // this.cdr.detectChanges();
  }
}