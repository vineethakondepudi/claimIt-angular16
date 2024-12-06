#  project
		
		 Template for Angular  application
		
#  Implemented things in template

            Angular 16.0.0
            node 18.16.0
            Angular Material 16.0.0
            Tailwind Css 3.3.2
            @NGRX store 

# Recommended Project Structure
		
			├───@amc
│   ├───animations
│   ├───components
│   │   ├───data-table
│   │   ├───footer
│   │   ├───form-footer
│   │   ├───form-submission-modal
│   │   ├───header
│   │   ├───sidenav
│   │   ├───sub-header
│   │   └───warehouse-selection-modal
│   ├───constants
│   ├───interfaces
│   ├───pipes
│   └───types
├───directives
├───features
│   ├───accessorials
│   │   ├───+state
│   │   ├───accessorial-details
│   │   ├───accessorial-filter-menu
│   │   ├───accessorial-list
│   │   ├───types
│   │   └───warehouse-search
│   ├───auth
│   │   └───+state
│   ├───management
│   │   ├───+state
│   │   ├───customers
│   │   │   ├───customer-details
│   │   │   └───customer-list
│   │   ├───import-export
│   │   ├───service-rates
│   │   │   ├───service-rates-details
│   │   │   └───service-rates-list
│   │   ├───services
│   │   │   ├───service-details
│   │   │   └───service-list
│   │   └───types
│   └───shared
│       └───+state
└───interceptors

				  		
# Installations required 
---
Angular, Jasmine, Tailwind , Angular Material

Set up an Angular project:

Install Angular CLI globally: npm install -g @angular/cli
Create a new Angular project: ng new my-project
Change into the project directory: cd my-project


# Install and configure Tailwind CSS:

Install Tailwind CSS and its dependencies: npm install tailwindcss postcss autoprefixer
Generate the Tailwind CSS configuration file: npx tailwindcss init
Open the tailwind.config.js file and customize Tailwind's settings if needed.
npm install -D tailwindcss
create tailwind.config.js file outside the src folder and add the below code
/\*_ @type {import('tailwindcss').Config} _/

module.exports = {
content: [
"./src/**/*.{html,ts}",
],
theme: {
extend: {},
},
plugins: [],
}


Import Tailwind CSS styles into the project. Open the styles.css file (located at src/styles.css) and add the following line at the beginning:

Styling .css

@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

# Install Ngrx store 
https://v7.ngrx.io/guide/store/install

 Need to run the command to install store 
 
 npm install @ngrx/store --save

Need to run add the store 
   ng add @ngrx/store

# Install Angular Material:
--
Install Angular Material and its dependencies: ng add @angular/material
Follow the prompts to choose a prebuilt theme, animations, and typography styles.
Import the required Angular Material modules in your app module (app.module.ts) or any other module 
where you want to use Angular Material components. For 

we are using the standalone so we are importing required material module in the component 

# Installing Visual Studio Code (VS Code):
---
1. Visit the official VS Code website: https://code.visualstudio.com.

2. On the website, click on the "Download" button. It will detect your operating system and recommend 
the appropriate version of VS Code for your system.

3. For Windows:
Double-click the downloaded .exe file
4. Once the installation is complete, you can launch VS Code from your desktop or application menu.
		

Build & Run App:
---
# How to build and deploy
	 ng build --configuration=dev
    ng build --configuration=qa
    ng build --configuration=uat
    ng build --configuration=production
# Build :

 Run: ng build --configuration=development



# Run :

npm start 

if any project is running with same port 4200

need to run different port use this command 

ng serve --port port number required  
# Modules that we are used in this project       
  There are several modules in Angular . Here is a quick overview:
  ### MatTableModule
The mat-table provides a Material Design styled data-table that can be used to display rows of data.

 import {MatTableModule} from '@angular/material/table';

 Selector: mat-table table[mat-table]
Exported as: matTable   
### MatPaginatorModule
Component to provide navigation between paged information. Displays the size of the current page, user-selectable options to change that size, what items are being shown, and navigational button to go to the previous or next page

import {MatPaginatorModule} from '@angular/material/paginator';

Selector: mat-paginator
Exported as: matPaginator
### MatFormFieldModule
import {MatFormFieldModule} from '@angular/material/form-field';
Container for form controls that applies Material Design styling and behavior.

Selector: mat-form-field
Exported as: matFormField     
### MatSortModule
import {MatSortModule} from '@angular/material/sort';

Applies sorting behavior (click to change sort) and styles to an element, including an arrow to display the current sort direction.
Selector: [mat-sort-header]
Exported as: matSortHeader  
### MatIconModule
import {MatIconModule} from '@angular/material/icon';

Service to register and display icons used by the <mat-icon> component.			
### MatButtonModule

Angular Material buttons are native <button> or <a> elements enhanced with Material Design styling and ink ripples.

import {MatButtonModule} from '@angular/material/button';
Selector: button[mat-button] button[mat-raised-button] button[mat-flat-button] button[mat-stroked-button]
Exported as: matButton
### MatMenuModule
<mat-menu> is a floating panel containing list of options.
import {MatMenuModule} from '@angular/material/menu';

Selector: mat-menu
Exported as: matMenu
### MatCheckboxModule
<mat-checkbox> provides the same functionality as a native <input type="checkbox"> enhanced with Material Design styling and animations.
import {MatCheckboxModule} from '@angular/material/checkbox';
Selector: mat-checkbox
Exported as: matCheckbox
### MatInputModule
matInput is a directive that allows native <input> and <textarea> elements to work with <mat-form-field>.

import {MatInputModule} from '@angular/material/input';

Selector: input[matInput] textarea[matInput] select[matNativeControl] input[matNativeControl] textarea[matNativeControl]
Exported as: matInput
### MatSelectModule
<mat-select> is a form control for selecting a value from a set of options, similar to the native <select> element. You can read more about selects in the Material Design spec. It is designed to work inside of a <mat-form-field> element

import {MatSelectModule} from '@angular/material/select';

Selector: mat-select
Exported as: matSelect
### MatDatepickerModule
The datepicker allows users to enter a date either through text input, or by choosing a date from the calendar. It is made up of several components, directives and the date implementation module that work together.

import {MatDatepickerModule} from '@angular/material/datepicker';

### MatToolbarModule
<mat-toolbar> is a container for headers, titles, or actions.

import {MatToolbarModule} from '@angular/material/toolbar';

Selector: mat-toolbar-row
Exported as: matToolbarRow

### MatSidenavModule
The sidenav components are designed to add side content to a fullscreen app. To set up a sidenav we use three components: <mat-sidenav-container> which acts as a structural container for our content and sidenav
import {MatSidenavModule} from '@angular/material/sidenav';
Selector: mat-drawer-content


"# claimIt-lost-fpund-" 
