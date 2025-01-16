import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableComponent } from '../data-table/data-table.component';
import { MatButtonModule } from '@angular/material/button';
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
  selector: 'app-search-results-dialog',
  standalone: true,
  imports: [CommonModule,MatDialogModule,DataTableComponent,MatButtonModule],
  templateUrl: './search-results-dialog.component.html',
  styleUrls: ['./search-results-dialog.component.scss']
})
export class SearchResultsDialogComponent {
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
      index: 1,
    },
  ]
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private router: Router,  private dialogRef: MatDialogRef<SearchResultsDialogComponent> ) {}
  claimItem(item: Item): void {
    this.dialogRef.close();
    this.router.navigate(['claimit/searchAndClaim'], { queryParams: { id: item.itemName } });
  }
}
