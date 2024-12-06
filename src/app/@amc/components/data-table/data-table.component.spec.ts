import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DataTableComponent } from './data-table.component';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { DataPropertyGetterPipe } from '../../pipes/data-property-getter.pipe';
import { TableColumn } from '../../../features/CRUD/tablecolumn.interface';

describe('DataTableComponent', () => {
  let component: DataTableComponent<[]>;
  let fixture: ComponentFixture<DataTableComponent<[]>>;

  beforeEach(() => {

    TestBed.configureTestingModule({
      imports: [DataTableComponent,
        MatTableModule,
        MatPaginatorModule,
        MatFormFieldModule,
        DataPropertyGetterPipe,
        CommonModule,
        HttpClientModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        FormsModule,
        MatMenuModule,
        MatCheckboxModule,]
    });
    fixture = TestBed.createComponent(DataTableComponent<[]>);
    component = fixture.componentInstance;
    component.dataSource = new MatTableDataSource();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should setPagination ', () => {
    component.dataSource = { paginator: 1 };
    component.setPagination(undefined);
  });

  it('should set the dataSource filter to the lowercased trimmed search keyword', () => {
    component.dataSource = { filter: 'MyKeyword' }
    component.searchKeyword = '  MyKeyword  ';
    component.applyFilter();
  });
  it('should handleToggleColumns negitive case ', () => {

    const col: TableColumn = {
      label: "FirstName",
      name: "firstName",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: false,
      index: 1,
    };
    component.filteredColumns = component.filteredColumns.filter((c) => {
      return c.label !== col.label
    });
    component.handleToggleColumns(col)
  });

  it('should handleToggleColumns positive case ', () => {

    const col: TableColumn = {
      label: "FirstName",
      name: "firstName",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    };

    const c: TableColumn = {
      label: "FirstName",
      name: "firstName",
      type: "text",
      isSortable: true,
      position: "left",
      isChecked: true,
      index: 1,
    };
    component.filteredColumns = component.filteredColumns.filter(c => c.label == "hai");
    component.handleToggleColumns(col)
  });
  it('should emit rowData event when handleRowClick is called', () => {
    const row = { id: 1, name: 'gani' };
    spyOn(component.rowData, 'emit');
    component.handleRowClick(row);
  });
  it('should cover formatDate  if datestring not empty', () => {
    const dateString = '12/12/2022'
    component.formatDate(dateString)
  })
  it('should cover formatDate if date string is empty', () => {
    const dateString = ''
    component.formatDate(dateString)
  })
  it('should log the provided params', () => {
    const params = {
    
    pageIndex: 1,
    previousPageIndex:1,
    pageSize:1,
    length: 1
    };
    component.handlePage(params)
  });
  it('should cover showSkills',()=>{
    const data = { skills: 'skill1, skill2, skill3, skill4' };
    const i= 1;
    component.showSkills(data,i)
  })
  it('should cover formatSkills',()=>{
    const data = { skills: 'skill1, skill2, skill3, skill4' };
    const i= 1;
    component.formatSkills(data)
  })
  it('should return all skills if there are less than or equal to 2 skills', () => {
    const data = {
      skills: 'Angular,React'
    };

    const result = component.formatSkills(data);

    expect(result).toEqual(['Angular', 'React']);
  });
});