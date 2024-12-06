import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { MatDividerModule } from '@angular/material/divider';
import { COPYRIGHT_YEAR, COPYRIGHT_OWNER, RIGHTS_RESERVED, APP_VERSION } from '../../constants/application.details';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    MatDividerModule,
    MatCardModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  providers: [DatePipe]
})
export class FooterComponent implements OnInit{
  public year = COPYRIGHT_YEAR
  public Owner = COPYRIGHT_OWNER
  public reserved = RIGHTS_RESERVED
  public version = APP_VERSION
  @Input() footerDetails: string | undefined;
  @Input() formValid: boolean | undefined;
  @Input() formTitle:string |any;
  @Input() toggleButtonModule : boolean | undefined;
  @Output() selected = new EventEmitter<undefined>();
  @Output() resetForm = new EventEmitter<undefined>();
  userFooterInfo: any;
  routeType: any;

  constructor(private store: Store, private activatedRoute: ActivatedRoute, private datePipe: DatePipe) {}
  ngOnInit(){
 
  }
  onSelectedProduct() {
    this.selected.emit();
  }

  onResetData(value: any) {
    this.resetForm.emit(value)
  }
  formatDate(dateString: string) {
    return dateString ? this.datePipe.transform(dateString, 'M/dd/YYYY, h:mm a') : '';
  }
}
