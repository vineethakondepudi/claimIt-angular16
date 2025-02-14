import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { CategoryDialogComponent } from '../category-dialog/category-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { NgIf } from '@angular/common';
import { LoaderComponent } from 'src/app/@amc/components/loader/loader.component';

interface Category {
  id: number;
  name: string;
  displayName: string[];
  image: string;
  bgColor?: string;
}


@Component({
  imports:[MatDialogModule,
    NgIf,
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatProgressBarModule,
    LoaderComponent,
    MatSnackBarModule,
    ReactiveFormsModule],
  selector: 'app-category-management',
  standalone: true,
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = []
  isLoading = true;
  private nextId = 1;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

    
  getImage(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  fetchCategories(): void {
    this.isLoading = true;
    this.http.get<Category[]>('https://100.28.242.219.nip.io/api/admin/getcategories')
      .subscribe({
        next: (response) => {
          this.isLoading = false
          this.categories = response;
          this.nextId = Math.max(...this.categories.map(c => c.id)) + 1;
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error fetching categories:', error);
          this.showSnackBar('Failed to fetch categories');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: "500px",
      data: { 
        title: 'Add New Category',
        mode: 'add' // Ensure the dialog opens in "add" mode
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result && result.categoryName) {
        const formData = new FormData();
        if (result.image) {
          formData.append('image', result.image);
        }
        const categoryData = {
          categoryName: result.categoryName,
          subCategories: result.subcategories.map((sub: string) => ({ name: sub }))
        };
        formData.append('category', JSON.stringify(categoryData));
  
        this.isLoading = true;
        this.http.post('https://100.28.242.219.nip.io/api/admin/addCategory', formData)
          .subscribe({
            next: (response: any) => {
              this.categories = [...this.categories, response];
              this.showSnackBar('Category added successfully');
              this.fetchCategories();
            },
            error: (error) => {
              console.error('Error adding category:', error);
              this.showSnackBar('Failed to add category');
            },
            complete: () => {
              this.isLoading = false;
            }
          });
      }
    });
  }
  
  openCategoryDialog(category: Category, mode: 'edit' | 'delete'): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '600px',
      data: { 
        title: mode === 'edit' ? 'Edit Category' : 'Delete Category',
        category,
        mode 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (mode === 'edit') {
          this.updateCategory(category, result);
        } else if (mode === 'delete') {
          this.confirmDeleteCategory(category);
        }
      }
    });
  }
  
  private updateCategory(category: Category, result: any): void {
    const updatedCategory = { ...category, categoryName: result.categoryName, subcategories: result.subcategories };
    this.isLoading = true;
    this.http.put(`https://100.28.242.219.nip.io/api/admin/categories?id=${category.id}`, updatedCategory)
      .subscribe({
        next: () => {
          this.categories = this.categories.map(c => c.id === category.id ? updatedCategory : c);
          this.showSnackBar('Category updated successfully');
          this.fetchCategories();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error updating category:', error);
          this.showSnackBar('Failed to update category');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
  
  private confirmDeleteCategory(category: Category): void {
    this.isLoading = true;
    this.http.delete(`https://100.28.242.219.nip.io/api/admin/delete?id=${category.id}`)
      .subscribe({
        next: () => {
          this.categories = this.categories.filter(c => c.id !== category.id);
          this.showSnackBar('Category deleted successfully');
          this.fetchCategories();
        },
        error: (error) => {
          this.isLoading = false;
          console.error('Error deleting category:', error);
          this.showSnackBar('Failed to delete category');
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }
  
  
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
    });
  }
}