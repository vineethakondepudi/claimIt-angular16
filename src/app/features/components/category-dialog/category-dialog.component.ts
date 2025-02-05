import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
    imports:[MatDialogModule,
      MatInputModule,
      MatFormFieldModule,
      MatButtonModule,
      MatIconModule,
      MatCardModule,
      MatProgressBarModule,
      CommonModule,
      MatSnackBarModule,
      ReactiveFormsModule],
  selector: 'app-category-dialog',
  standalone: true,
  templateUrl: './category-dialog.component.html',
  styleUrls: ['./category-dialog.component.css']
})
export class CategoryDialogComponent {
  categoryControl = new FormControl('', [
    Validators.required,
    Validators.maxLength(50)
  ]);

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; name?: string }
  ) {
    if (this.data.name) {
      this.categoryControl.setValue(this.data.name);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}