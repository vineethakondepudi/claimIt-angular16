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
import { WASTE_DATA } from '../../types/waste-data'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faWhatsapp, faLinkedin, faTwitter } from '@fortawesome/free-brands-svg-icons';
import {  MatDialogRef } from '@angular/material/dialog';
import { fadeInRight400ms } from '../../animations/fade-in-right.animation'
import { fadeInUp400ms } from '../../animations/fade-in-up.animation'
import { MatExpansionModule } from '@angular/material/expansion'
import { ChatService } from '../service/chat.service'
interface CheckIn {
  name: string
  type: string
  appointmentId: string
}
type WasteCategory = 'plastic' | 'organic' | 'electronic' | 'paper' | 'glass' | 'other';
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
    MatExpansionModule,
    MatIconModule,],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [fadeInRight400ms, fadeInUp400ms],
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
  selectedWasteType: WasteCategory = 'plastic';
  customWasteInput: string = '';
  suggestions: string[] = [];
  userLocation: string = ''; 
  // cdRef: any
  constructor(private claimService: ClaimitService, private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef,private chatService: ChatService) {
    this.role = localStorage.getItem('role');
  }
  public pieChartType: ChartType = 'pie';
  public barChartType: ChartType = 'bar';
  lineChartType: ChartType = 'line';
  showMore = true;
  mapUrl: string = '';
  doughnutChartType: ChartType = 'doughnut';
  searchQuery: string = '';
  swiper: Swiper | undefined;
  public panelOpened: boolean = false;
  public PanelOpened: boolean = false
  loader: boolean = false;
  selectedMonth: Date = new Date();
  currentMonth: any = [];
  monthName: any = [];
  isChatOpen: boolean = false;
  chatInput: string = '';
  messages: string[] = [];
  loading: boolean = false;
  resultData: string = '';
  recentPrompt: string = '';
  prevPrompt: string[] = [];
  showResult: boolean = false;
  activeTab = 'focused';
  currentMonthData: any = {
    totalItems: 0,
    claimed: 0,
    unclaimed: 0,
    donated: 0,
    pendingApproval: 0,
    pendingPickup: 0,
    rejected: 0,
  };
  charities = [
    {
      name: 'Hope Shelter',
      description: 'Provides food and shelter to homeless families and individuals.',
      impact: 'Over 1,000 families have received help this year.',
      howWeHelp: 'By connecting lost and unclaimed items to the charity, we help them raise funds and support their initiatives.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTNr7IpS66-t7vsuZD_MrWA07UD4YQr7BPjXw&s',
      donations: [
        { name: 'Clothing', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-YiZi38fv78m-6149In80vzN5MbteVvPmJg&s' },
        { name: 'Electronics', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRldZSpZcvWC1_aNy7ECZkrpCbzx0l1urWiUMwNLcB_Fbfom3k-J-Fiv6DLVylWW7y7pRk&usqp=CAU' },
      ],
      website: 'https://hopeshelter.org',
    },
    {
      name: 'Green Earth Foundation',
      description: 'Focuses on reforestation and environmental conservation efforts.',
      impact: 'Planted over 500,000 trees in the last decade.',
      howWeHelp: 'Our platform contributes by donating funds from unclaimed items and promoting awareness.',
      image: 'https://images.squarespace-cdn.com/content/v1/57e58a719de4bb2c92a0fe52/1679525217981-HSB5QYU4R48IXXLWSWDI/41-Ways-to-Save-the-Planet-in-5-Minutes-or-Less-19.jpg?format=500w',
      donations: [
        { name: 'Gardening Tools', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTz52ELjn6srieNAHqhtUyS4fI61HPAnX6BTQ&s' },
        { name: 'Tree Saplings', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4CNzZBrKZ1kHgwFZ7kIA9lDl0B4MNrwTO2Q&s' },
      ],
      website: 'https://greenearth.org',
    },
    {
      name: 'Smile Education Trust',
      description: 'Provides education and resources to underprivileged children.',
      impact: 'Educated over 10,000 children in rural areas.',
      howWeHelp: 'Our website donates unclaimed study materials and raises awareness about education needs.',
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQeyTnpohgYhB12Djr9KOknZe52kXpuglXya4O-V_6QMgtMccFJ0G8qnFun-dj6b_bEzVE&usqp=CAU',
      donations: [
        { name: 'Books', image: 'data:image/jpeg;base64,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' },
        { name: 'Stationery', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTBYl17U8B0hih86tFF9Rg8fh4esv3nHNozF1U2thq6cDGhUALeWGIzj-jXVUON5qOIfmA&usqp=CAU' },
      ],
      website: 'https://smileeducation.org',
    },
  ];

  displayedCharities: any[] = [];
  recyclingCenters: any[] = []; 
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
    this.displayTwoRandomCharities();
    this.currentMonth = (this.selectedMonth.getMonth() + 1).toString().padStart(2, '0');
    const currentYear = this.selectedMonth.getFullYear();
    
    this.statusCount(this.currentMonth, currentYear);
    this.categoryItems(this.currentMonth, currentYear);
    this.monthName = this.selectedMonth.toLocaleString('default', { month: 'long' });
    this.initMap();
  }
  ngOnDestroy(): void {
    this.countdownTimers.forEach(timer => clearInterval(timer));
  }
  displayTwoRandomCharities() {
    const shuffled = this.charities.sort(() => 0.5 - Math.random());
    this.displayedCharities = shuffled.slice(0, 2);
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
  onSubmit() {
    if (this.selectedWasteType || this.customWasteInput) {
      this.suggestions = [];
      if (this.selectedWasteType) {
        this.suggestions = WASTE_DATA[this.selectedWasteType]?.tips || [];
      }
      if (this.customWasteInput) {
        if (this.customWasteInput.toLowerCase().includes('battery')) {
          this.suggestions.push("Take batteries to a special recycling center.");
        }
      }
      this.initMap();
    }
  }
  initMap() {
    this.map = L.map('map').setView([ 0,0], 13);
    L.tileLayer('https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=xJWFJF5JvkaPr6hJCReR', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(this.map);
    
  }
  provideLocationBasedTips() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;

        this.userLocation = `Latitude: ${lat}, Longitude: ${lng}`;
        this.suggestions.push('Check out the nearest recycling center near your location!');
        if (this.map) {
          this.map.setView([lat, lng], 13);
        }
        L.marker([lat, lng]).addTo(this.map!)
          .bindPopup('Your Location')
          .openPopup();
        this.fetchNearbyRecyclingCenters(lat, lng);
      });
    }
  }
  fetchNearbyRecyclingCenters(lat: number, lng: number) {
    this.recyclingCenters = [
      { name: 'Recycling Center A', lat: lat + 0.01, lng: lng + 0.01 },
      { name: 'Recycling Center B', lat: lat - 0.01, lng: lng - 0.01 },
      { name: 'Recycling Center C', lat: lat + 0.02, lng: lng - 0.02 },
    ];
    this.recyclingCenters.forEach(center => {
      L.marker([center.lat, center.lng]).addTo(this.map!)
        .bindPopup(center.name);
    });
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
    } else {
      item.locationName = 'Invalid coordinates';
    }
  }
  
  private fetchLocationName(lat: number, lon: number, item: any): void {
    
    const apiUrl = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=xJWFJF5JvkaPr6hJCReR`;
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

    this.PieChartData.labels = [...labels];
    this.PieChartData.datasets[0].data = [...dataPoints];
    this.PieChartData.datasets[0].backgroundColor = labels.map(() =>
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
    );


    this.PieChartData = { ...this.PieChartData };
  }
  updatedBarChartData(labels: string[], dataPoints: number[]): void {
  
    this.barChartData.labels = [...labels];
    this.barChartData.datasets.label = [...dataPoints];
    this.barChartData.datasets[0].data = [...dataPoints];
    this.barChartData.datasets[0].backgroundColor = labels.map(() =>
      `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.6)`
    );
  
    this.barChartData = { ...this.barChartData };
  }
  categoryItems(month: number, year: number): void {
    this.claimService.categoryItems(month.toString(), year).subscribe((res: any) => {
      const labels = res.map((item: any) => item.categoryName);
      const dataPoints = res.map((item: any) => item.itemCount);
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
  }


  // toggleChat() {
  //   this.chatExpanded = !this.chatExpanded;
  // }

  // sendMessage() {
  //   if (this.currentMessage.trim()) {
      
  //     this.messages.push('You: ' + this.currentMessage);
     
  //     this.messages.push(this.getBotResponse(this.currentMessage));
  //     this.currentMessage = ''; 
  //   }
  // }


  getBotResponse(userMessage: string): string {
    if (userMessage.toLowerCase().includes('hello')) {
      return 'Bot: Hello! How can I assist you today?';
    } else if (userMessage.toLowerCase().includes('i lost something')) {
      return 'Bot: I\'ll find it shortly. We will reach out via your email.';
    } else {
      return 'Bot: I\'m sorry, I didn\'t quite catch that. Could you please rephrase?';
    }
  }
  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  sendMessage(): void {
    if (this.chatInput.trim()) {
      this.messages.push(`You: ${this.chatInput}`);
      this.loading = true;
  
      this.chatService.generateResponse(this.chatInput)
        .then((response: string) => {
          this.messages.push(`AI: ${response}`);
          this.loading = false;
          this.chatInput = ''; // Clear input field
        })
        .catch((error: any) => {
          this.messages.push("AI: Sorry, I couldn't process that request.");
          this.loading = false;
          console.error('Error generating response:', error);
        });
    }
  }
  
}