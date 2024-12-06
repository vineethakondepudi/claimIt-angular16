import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appTabNavigate]',
  standalone: true,
})
export class TabNavigateDirective {
  @Input () tabOrder : number = 1;
  constructor( private el: ElementRef ) {}

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) : void{
    if(event.key === 'Tab'){
      event.preventDefault();
      // console.log(this.tabOrder, 'taborder')
      const formElements = this.el.nativeElement.querySelectorAll(
        'input:not([disabled]), textarea:not([disabled]), button:not([disabled]), a[href], mat-select, mat-option'
        // 'input:not([disabled]), textarea:not([disabled]), button:not([disabled]), 
      );
      const currentIndex = Array.from(formElements).indexOf(
        document.activeElement
      );
      console.log(currentIndex)
      const nextIndex = currentIndex + 1 < formElements.length ? currentIndex + 1 : 0;
      const element = formElements[nextIndex] as HTMLElement;
      element.focus();
    }
    }
  }

// }
