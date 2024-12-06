// import { Component, OnInit } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component'; // Import the DatatableComponent
// import { CommonModule } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';

// interface TableData {
//   image: string;
//   foundDate: string;
//   status: string;
// }

// @Component({
//   selector: 'app-additem',
//   standalone: true,
//   imports: [
//     CommonModule,
//     DataTableComponent, 
//     MatButtonModule,
//     MatIconModule,
//   ],
//   templateUrl: './additem.component.html',
//   styleUrls: ['./additem.component.scss']
// })
// export default class AdditemComponent implements OnInit{
//   apiUrl = 'http://172.17.12.38:8081/api/admin/listOfItems';

//   tableData: any = [];

//   currentDate: Date = new Date();

//   tableColumns = [
//     {
//       label: 'Image Data',
//       name: 'image',
//       type: 'image',
//       isSortable: false,
//       isChecked: true,
//     },
//     {
//       label: 'Found Date',
//       name: 'foundDate',
//       type: 'date',
//       isSortable: true,
//       isChecked: true,
//     },
//     {
//       label: 'Status',
//       name: 'status',
//       type: 'text',
//       isSortable: true,
//       isChecked: true,
//     },
//   ];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchData();
//   }

//   fetchData(): void {
//     this.http.get<TableData[]>(this.apiUrl).subscribe(
//       (data) => {
//         this.tableData = data; // Now the type matches
//       },
//       (error) => {
//         console.error('Error fetching data:', error);
//       }
//     );
//   }

//   onFileSelected(event: any): void {
//     const file = event.target.files[0];
//     if (file) {
//       console.log('Selected file:', file.name);
//       // Implement file upload logic here
//     }
//   }

//   handleUnclaim(item: TableData): void {
//     console.log('Unclaim item:', item);
//     // Handle unclaim logic here
//   }
// }
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-additem',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './additem.component.html',
  styleUrls: ['./additem.component.scss']
})
export default class AdditemComponent {

}
