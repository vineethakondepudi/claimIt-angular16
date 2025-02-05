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
    MatSnackBarModule,
    ReactiveFormsModule],
  selector: 'app-category-management',
  standalone: true,
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.css']
})
export class CategoryManagementComponent implements OnInit {
  categories: Category[] = [
    {
      id: 1,
      name: 'Tools & Workshop Equipment',
      displayName: ['Tools & Workshop', 'Equipment'],
      image: '/assets/webimage.png'
    },
    {
      id: 2,
      name: 'Yard, Garden & Outdoor Living Items',
      displayName: ['Yard, Garden & Outdoor', 'Living Items'],
      image: 'https://etimg.etb2bimg.com/thumb/msid-111923977,imgsize-135866,width-1200,height=765,overlay-etretail/apparel-fashion/apparel/india-recovered-expanded-in-orderly-fashion-from-pandemic-economic-survey-2023-24.jpg'
    },
    {
      id: 3,
      name: 'Home Improvement',
      displayName: ['Home Improvement'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 4,
      name: 'Kitchen, Dining & Bar Supplies',
      displayName: ['Kitchen, Dining & Bar', 'Supplies'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 5,
      name: 'Lamps, Lighting & Ceiling Fans',
      displayName: ['Lamps, Lighting &', 'Ceiling Fans'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 6,
      name: 'Home Decor',
      displayName: ['Home Decor'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 7,
      name: 'Home Organization Supplies',
      displayName: ['Home Organization', 'Supplies'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 8,
      name: 'Major Appliances',
      displayName: ['Major Appliances'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 9,
      name: 'Bedding',
      displayName: ['Bedding'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    },
    {
      id: 10,
      name: 'Furniture',
      displayName: ['Furniture'],
      image: 'https://www.cato.org/sites/cato.org/files/styles/optimized/public/2023-11/fast-fashion2.jpeg?itok=qCMa7eGV'
    }
  ];
  loading = true;
  private nextId = 1;

  constructor(
    private http: HttpClient,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  fetchCategories(): void {
    this.loading = true;
    this.http.get<Category[]>('https://100.28.242.219.nip.io/api/admin/getcategories')
      .subscribe({
        next: (response) => {
          this.categories = response;
          // Find the highest ID for dummy operations
          this.nextId = Math.max(...this.categories.map(c => c.id)) + 1;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          this.loading = false;
        }
      });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { title: 'Add New Category' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Create a complete Category object with default values
        const newCategory: Category = {
          id: this.nextId++,
          name: result,
          // Add other required properties from your Category interface
          bgColor: '#ffffff', // Default background color
          image: 'assets/default-category.png', // Default image path
          displayName: result.split(' '), // Split name into array for display
          // Add any other mandatory properties your Category interface requires
        };
  
        this.categories = [...this.categories, newCategory];
        this.showSnackBar('Category added successfully (frontend-only)');
      }
    });
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { title: 'Edit Category', name: category.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Frontend-only update operation
        this.categories = this.categories.map(c => 
          c.id === category.id ? { ...c, name: result } : c
        );
        this.showSnackBar('Category updated successfully (frontend-only)');
      }
    });
  }

  deleteCategory(category: Category): void {
    // Frontend-only delete operation
    this.categories = this.categories.filter(c => c.id !== category.id);
    this.showSnackBar('Category deleted successfully (frontend-only)');
  }

  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}