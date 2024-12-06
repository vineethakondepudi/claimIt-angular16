import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { COPYRIGHT_YEAR, COPYRIGHT_OWNER, RIGHTS_RESERVED } from '../../constants/application.details';
import { ClAIMIT_VERSION } from '../../constants/footer.constants';

@Component({
  selector: 'app-form-footer',
  standalone: true,
  imports: [CommonModule,MatCardModule],
  templateUrl: './form-footer.component.html',
  styleUrls: ['./form-footer.component.scss']
})
export class FormFooterComponent {
  public year = COPYRIGHT_YEAR
  public Owner = COPYRIGHT_OWNER
  public  reserved = RIGHTS_RESERVED
  public version = ClAIMIT_VERSION
  public claimitURl = ''
  public companyInfo = ``;
  @Input() copyright:boolean=true
}
