import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { DataTableComponent } from 'src/app/@amc/components/data-table/data-table.component';
import { FormFooterComponent } from 'src/app/@amc/components/form-footer/form-footer.component';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';

@Component({
  selector: 'app-update-date-dialog',
  standalone: true,
    imports: [CommonModule,
      DataTableComponent,
      MatCardModule,
      MatIconModule,
      MatSelectModule,
      ReactiveFormsModule,
      MatInputModule,
      MatButtonModule,
      DataTableComponent,
      MatExpansionModule,
      MatSidenavModule,
      MatDialogModule,
      FormFooterComponent,
      MatTooltipModule,
      MatFormFieldModule,
      LoaderComponent,
      MatDatepickerModule,
      MatProgressSpinnerModule,
      MatSnackBarModule,
      MatIconModule,
      FormsModule,
      RouterModule], 
      templateUrl: './update-date-dialog.component.html',
  styleUrls: ['./update-date-dialog.component.scss'],
})
export class UpdateDateDialogComponent {
  expirationDate: Date | null = null;

  constructor(public dialogRef: MatDialogRef<UpdateDateDialogComponent>) {}

  close() {
    this.dialogRef.close();
  }

  update() {
    if (this.expirationDate) {
      this.dialogRef.close(this.expirationDate);
    } else {
      alert('Please select an expiration date.');
    }
  }
}
