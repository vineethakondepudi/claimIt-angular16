import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
  categoryForm: FormGroup;
  selectedFile: File | null = null;
  selectedFileName: string = '';
  imagePreview: string | ArrayBuffer | null = null;
  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const subcategories = data.category?.subcategories || []; 
    this.categoryForm = this.fb.group({
      categoryName: [data.category?.name || '', [Validators.required, Validators.maxLength(50)]],
      subcategories: this.fb.array(
        subcategories.map((sub: { name: string }) => this.fb.control(sub.name)) // Map subcategories to form controls
      )
    });
    console.log(data,'data')
  }
  get subcategories(): FormArray {
    return this.categoryForm.get('subcategories') as FormArray;
  }
  addSubcategory(): void {
    this.subcategories.push(this.fb.control('', Validators.required));
  }
  onFileSelect(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.selectedFile = file;
      this.selectedFileName = file.name; 
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }
  removeSubcategory(index: number): void {
    this.subcategories.removeAt(index);
  }
  confirmDelete(): void {
    this.dialogRef.close(true); // Pass `true` to indicate delete confirmation
  }

  cancel(): void {
    this.dialogRef.close(false); // Pass `false` to cancel
  }
  save(): void {
    if (this.categoryForm.valid) {
      this.dialogRef.close({
        ...this.categoryForm.value,
        image: this.selectedFile 
      });
    }
  }
}
