import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
  ],
  template: `
    <h2 mat-dialog-title>Select a Month and Year</h2>
    <mat-dialog-content>
      <mat-form-field appearance="outline" class="flex-auto custom-month-picker mb-4">
        <mat-label>Choose a month</mat-label>
        <input
          matInput
          [matDatepicker]="picker"
          [(ngModel)]="selectedDate"
          readonly
        />
        <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker
          #picker
          startView="multi-year"
          (monthSelected)="onMonthSelected($event, picker)"
          (yearSelected)="onYearSelected($event)"
          panelClass="month-year-picker"
        >
        </mat-datepicker>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end" class="m-2">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-stroked-button (click)="onSelect()">Select</button>
    </mat-dialog-actions>
  `,
})
export class CalendarDialogComponent {
  selectedDate: Date = new Date();

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onMonthSelected(event: any, picker: any): void {
    this.selectedDate = new Date(event); // Update selectedDate based on month selection
    picker.close();
  }

  onYearSelected(event: any): void {
    this.selectedDate.setFullYear(event); // Update the year part of the selected date
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSelect(): void {
    const month = this.selectedDate.getMonth() + 1; // JavaScript months are 0-indexed
    const year = this.selectedDate.getFullYear();
    this.dialogRef.close({ month, year });
  }
}
