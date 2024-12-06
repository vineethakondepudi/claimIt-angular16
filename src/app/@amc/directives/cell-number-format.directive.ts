import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appCellNumberFormat]',
  standalone: true
})
export class CellNumberFormatDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: any) {
    const inputValue: string = event.target.value.replace(/\D/g, '');
    if (inputValue.length <= 10) {
      event.target.value = this.formatPhoneNumber(inputValue);
    }
  }

  formatPhoneNumber(value: string): string {
    const areaCode = value.slice(0, 3);
    const firstPart = value.slice(3, 6);
    const secondPart = value.slice(6, 10);

    let formattedValue = '';

    if (areaCode) {
      formattedValue += `(${areaCode}`;
    }

    if (firstPart) {
      formattedValue += `) ${firstPart}`;
    }

    if (secondPart) {
      formattedValue += `-${secondPart}`;
    }

    return formattedValue;
  }
}
