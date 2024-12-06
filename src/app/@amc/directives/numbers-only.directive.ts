import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumbersOnly]',
  standalone: true,
})
export class NumbersOnlyDirective {
 
  @Input() decimalPlaces: number = 2;

  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
     const key = event.key;
  
    const allowedKeys = [
      "Backspace",
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp",
      "ArrowDown",
      "Delete",
      "Tab",
    ];
  
    if (allowedKeys.indexOf(key) !== -1) {
      return;
    }

    const input = this.el.nativeElement as HTMLInputElement;
    const currentValue = input.value;
    const caretPosition = input.selectionStart || 0;

    if (key === '.' && currentValue.includes('.')) {
      event.preventDefault();
    } else if (!/[0-9\.]/.test(key)) {
      event.preventDefault();
    } else if (currentValue.includes('.')) {
      const decimalIndex = currentValue.indexOf('.');
      const decimalPlaces = currentValue.length - decimalIndex - 1;
      if (decimalPlaces >= 5 && caretPosition > decimalIndex) {
        event.preventDefault();
      }
    }
      if(this.decimalPlaces === 0 || !this.decimalPlaces){
      const regex = /[.]/;
      if (regex.test(event.key)) {
        event.preventDefault();
      }
    }
  }
}

