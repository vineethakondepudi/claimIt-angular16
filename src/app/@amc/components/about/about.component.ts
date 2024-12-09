import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { FormFooterComponent } from '../form-footer/form-footer.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule,FormFooterComponent ,   MatIconModule,
  ],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export default class AboutComponent {

}
