import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterComponent } from './footer.component';
import { Store, StoreModule } from '@ngrx/store';
// import { crudListReducer, userDetailsReducer } from 'src/app/features/crud/+state/crud.reducer';
import { sharedreducer } from '../../shared/+state/shared.reducer';
import { of } from 'rxjs';
import { editUserDetailsSelect } from 'src/app/features/crud/+state/crud.selector';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { crudEffects } from 'src/app/features/crud/+state/crud.effects';
import { EffectsModule } from '@ngrx/effects';
import { HttpClient, HttpClientModule, HttpHandler } from '@angular/common/http';
import { userDetailsReducer } from 'src/app/features/crud/+state/crud.reducer';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let store: Store

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FooterComponent,
        StoreModule.forRoot({ shared:sharedreducer, userDetails: userDetailsReducer}),
        EffectsModule.forRoot([crudEffects]),],
      declarations: [],
      providers: [HttpClient, HttpClientModule, HttpHandler, Store, { provide: ActivatedRoute, useValue: { snapshot: { queryParams: { addoredit: 'e' } } } },
      ],
    });
    fixture = TestBed.createComponent(FooterComponent);
    store = TestBed.inject(Store)
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should onSelectedProduct', () => {
    expect(component.selected.emit).toHaveBeenCalled;
    component.onSelectedProduct();
  });
  it('should onSelectedProduct', () => {
    expect(component.resetForm.emit).toHaveBeenCalled;
    component.onResetData({ value: undefined });
  });

  it('should subscribe to store and perform actions when conditions are met', () => {
    const mockUserDetails = {};
    const mockres = []
    spyOn(store, 'select').and.returnValue(of(mockUserDetails));
    store.select(editUserDetailsSelect).subscribe((mockres) => {
    });
    component.ngOnInit();
  });

  it('should set routeType to "e" if addoredit query parameter is "e"', () => {
    spyOn(store, 'select').and.returnValue(
      of({
        editUserDetails: {}
      })
    );
    component.ngOnInit();
    expect(component.routeType).toBe('e');
  });
  it('should cover formatDate', () => {
    const dateString = '12/12/2023'
    component.formatDate(dateString)
  })
  it('should cover formatDate', () => {
    const dateString = ''
    component.formatDate(dateString)
  });
});