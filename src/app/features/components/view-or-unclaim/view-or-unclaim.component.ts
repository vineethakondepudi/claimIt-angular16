import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { fadeInRight400ms } from 'src/app/@amc/animations/fade-in-right.animation';
import { fadeInUp400ms } from 'src/app/@amc/animations/fade-in-up.animation';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { ConfirmationModalComponent } from 'src/app/@amc/components/confirmation-modal/confirmation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

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
    MatIconModule,
    FormsModule,],
  templateUrl: './view-or-unclaim.component.html',
  styleUrls: ['./view-or-unclaim.component.scss'],
  animations: [fadeInRight400ms, fadeInUp400ms],
})
export default class ViewOrUnclaimComponent {
  @Input() containerPanelOpened: boolean = false;
  searchQuery: string = 'pgupta@miraclesoft.com';
  searchResults: any = [];
  showNoResults: boolean = true;
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
      label: "Status",
      name: "status",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: "claimDate",
      name: "claimDate",
      type: "date",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
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
  data = [
    {
      email: 'vkondepudi@miraclesoft.com',
      items: [
        {
          image: 'https://www.shutterstock.com/image-photo/sand-timerhour-glass-feather-quill-260nw-240558520.jpg',
          claimDate: new Date('11 /4/2024'),
          status: 'open',
          showConfirmation: false,
        },
        {
          image: 'https://www.rebag.com/thevault/wp-content/uploads/2021/10/5-Entry-Level-Luxury-Accessories-Hero.jpg',
          claimDate: new Date('11/27/2024'),
          status: 'claimed',
        },
        {
          image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
          claimDate: new Date('12/3/2024'),
          status: 'pending pickup',
          showConfirmation: false,
        },
        {
          image: 'https://uncommongifts.in/cdn/shop/files/TribefacePrintedWomen_sOfficeBag_8d951812-bc08-4e82-8e0a-310bf5e9bbff_510x@2x.jpg?v=1702898334',
          claimDate: new Date('10/1/2024'),
          status: 'unclaim',
          showConfirmation: false,
        },
      ],
    },
    {
      email: 'pgupta@miraclesoft.com',
      items: [
        {
          image: 'https://www.hamburg-airport.de/resource/image/35168/landscape_ratio5x4_card/670/536/7a8548f5eebfc589a713116c0e10ada8/851A25FEEC37824CB8775EC0A150AD65/fundsachen-lost-and-found-baggage-gepaeck.jpg',
          claimDate: new Date('11/2/2024'),
          status: 'pending request',
          showConfirmation: false,
        },
        {
          image: 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg',
          claimDate: new Date('12/1/2024'),
          status: 'unclaim',
          showConfirmation: false,
        },
        {
          image: 'https://www.rebag.com/thevault/wp-content/uploads/2021/10/5-Entry-Level-Luxury-Accessories-Hero.jpg',
          claimDate: new Date('11/30/2024'),
          status: 'open',
          showConfirmation: false,
        },
        {
          image: 'https://www.shutterstock.com/image-photo/sand-timerhour-glass-feather-quill-260nw-240558520.jpg',
          claimDate: new Date('12/4/2024'),
          status: 'claimed',
        },
      ],
    },
  ];
  constructor(public dialog: MatDialog){

  }
  ngOnInit(){
this.search()
  }

  sortDataByClaimDate() {
    this.searchResults.sort((a: { claimDate: { getTime: () => number; }; }, b: { claimDate: { getTime: () => number; }; }) => {
      return b.claimDate.getTime() - a.claimDate.getTime();
    });
  }

  search() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.searchResults = [];
      this.showNoResults = false;
      return;
    }

    setTimeout(() => {
      const result = this.data.find((entry) => entry.email.toLowerCase() === query);
      if (result) {
        this.searchResults = result.items;
        this.showNoResults = this.searchResults.length === 0;
      } else {
        this.searchResults = [];
        this.showNoResults = true;
      }

      this.sortDataByClaimDate();
    }, 2000);
  }
  clearResultsIfEmpty() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.showNoResults = false;
    } else {
      this.search()
    }
  }
  SearchAndClear(type: any) {
    if (type === 'clear') {
      this.searchResults = [];
      this.showNoResults = false;
    } else {

    }

  }
  confirmUnclaim(result: any) {
    const dialogRef = this.dialog.open(ConfirmationModalComponent, {
      width: "500px",
      data: {
        message: 'Are you sure you want to unclaim this item?',
        title:'UnClaim'
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.unclaimItem(result); 
      }
    });
  }
  unclaimItem(result: any) {
    this.searchResults = this.searchResults.filter((item: any) => item !== result);
  }
}
