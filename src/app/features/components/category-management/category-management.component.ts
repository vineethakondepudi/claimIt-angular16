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
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2ZirDdwIr_MOuMCb6nGyGppyuOy3UG9SmSg&s'
    },
    {
      id: 2,
      name: 'Yard, Garden & Outdoor Living Items',
      displayName: ['Yard, Garden & Outdoor', 'Living Items'],
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ97jW8z7teh5hYD5A5sqINciWi_tmhnTtEmQ&s'
    },
    {
      id: 3,
      name: 'Home Improvement',
      displayName: ['Home Improvement'],
      image: 'https://media.licdn.com/dms/image/C4D12AQHs17hwJgNOUw/article-cover_image-shrink_720_1280/0/1641384800034?e=2147483647&v=beta&t=ggT0l8w2sAymZIE5arvIUIwXJp3_VYoJzHz8XjIg4Ik'
    },
    {
      id: 4,
      name: 'Kitchen, Dining & Bar Supplies',
      displayName: ['Kitchen, Dining & Bar', 'Supplies'],
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTm2rvAKBJPwQygAP25Y4M4lTdFM-n21xlvcA&s'
    },
    {
      id: 5,
      name: 'Lamps, Lighting & Ceiling Fans',
      displayName: ['Lamps, Lighting &', 'Ceiling Fans'],
      image: 'https://abodejungle.com/cdn/shop/products/S2cc8edb0b36c416dbe3eb91dcf665727C.jpg?v=1686569664&width=320'
    },
    {
      id: 6,
      name: 'Home Decor',
      displayName: ['Home Decor'],
      image: 'https://images.pexels.com/photos/1090638/pexels-photo-1090638.jpeg?cs=srgb&dl=pexels-fotios-photos-1090638.jpg&fm=jpg'
    },
    {
      id: 7,
      name: 'Home Organization Supplies',
      displayName: ['Home Organization', 'Supplies'],
      image: 'https://img.freepik.com/free-photo/mirror-with-shape-eye-shelves_181624-25355.jpg'
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
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMnbDRgQLzoLoNYDduBPZ3rDwhm3aGMI9yKQ&s'
    },
    {
      id: 10,
      name: 'Furniture',
      displayName: ['Furniture'],
      image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbW8OU6NDC3omPqQdClOZdCfooSyla8NtjEg&s'
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
          
          this.nextId = Math.max(...this.categories.map(c => c.id)) + 1;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
          this.loading = false;
        }
      });
  }
    
  getImage(base64String: string): string {
    return `data:image/jpeg;base64,${base64String}`;
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: "500px",
      data: { title: 'Add New Category' }
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
        this.http.post('https://100.28.242.219.nip.io/api/admin/addCategory', formData)
          .subscribe(
            (response: any) => {
              this.categories = [...this.categories, response];
              this.showSnackBar('Category added successfully');
            },
            error => {
              console.error('Error adding category:', error);
              this.showSnackBar('Failed to add category');
            }
          );
      }
    });
    this.fetchCategories()
  }

  openEditDialog(category: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
       width: '600px',
      data: { title: 'Edit Category', name: category.name }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const updatedCategory = { ...category, name: result.categoryName };
        this.http.put(`https://100.28.242.219.nip.io/api/admin/categories?id=${category.id}`, updatedCategory)
          .subscribe(
            response => {
              
              this.categories = this.categories.map(c => 
                c.id === category.id ? updatedCategory : c
              );
              
              this.showSnackBar('Category updated successfully');
            },
            error => {
              console.error('Error updating category:', error);
              this.showSnackBar('Failed to update category');
            }
          );
      }
    });
  }
  

  deleteCategory(category: Category): void {
    if (confirm(`Are you sure you want to delete the category "${category.name}"?`)) {
      this.http.delete(`https://100.28.242.219.nip.io/api/admin/delete?id=${category.id}`)
        .subscribe(
          response => {
            this.categories = this.categories.filter(c => c.id !== category.id);
            this.showSnackBar('Category deleted successfully');
          },
          error => {
            console.error('Error deleting category:', error);
            this.showSnackBar('Failed to delete category');
          }
        );
    }
  }
  
  private showSnackBar(message: string): void {
    this.snackBar.open(message, 'Close', { duration: 3000 });
  }
}