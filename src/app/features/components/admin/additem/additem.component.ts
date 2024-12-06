import { Component, OnInit, Input } from '@angular/core';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component'; 
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCardModule } from '@angular/material/card';
import { ClaimitService } from 'src/app/features/sharedServices/claimit.service';

interface TableData {
  image: string;
  foundDate: string;
  status: string;
}

export interface TableColumn {
  label: string;
  name: string;
  type: 'text' | 'number' | 'boolean' | 'date' | 'image' | 'action';  // Constrained type values
  isSortable?: boolean;
  position?: 'right' | 'left';
  isChecked: boolean;
  index: number;
}

@Component({
  selector: 'app-additem',
  standalone: true,
  imports: [
    CommonModule,
    DataTableComponent, 
    MatButtonModule,
    MatIconModule,
    FormFooterComponent,
    FormsModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatCardModule
  ],
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export default class AdditemComponent implements OnInit {  apiUrl = 'http://172.17.12.38:8081/api/admin/listOfItems';

  tableData: any[] = [];
  searchResults: any = [];
  searchQuery: string = '';

  currentDate: Date = new Date();
  @Input() containerPanelOpened: boolean = false;
  // Ensure that 'type' is one of the allowed values from the TableColumn interface
  displayColumns: TableColumn[] = [
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
      label: 'Found Date',
      name: 'foundDate',
      type: 'date',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
    {
      label: 'Status',
      name: 'status',
      type: 'text',  
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    },
  ];

  constructor(private service: ClaimitService) {}

  ngOnInit(): void {
    this.fetchData();
  }

  fetchData(): void {
const query = this.searchQuery.trim();
    this.service.listOfItems(query).subscribe((res: any) => {
      console.log('res', res)
      this.searchResults = res
      this.tableData = res; 

    },
    (error) => {
      console.error('Error fetching data:', error);
    })
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      console.log('Selected file:', file.name);
    }
  }
}
