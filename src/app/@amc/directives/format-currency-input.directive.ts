import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appFormatCurrencyInput]',
  standalone: true
})
export class FormatCurrencyInputDirective {

  constructor(private el: ElementRef<HTMLInputElement>) { }

  @HostListener('input', ['$event.target.value', '$event.target.selectionStart'])
  onInput(value: string, cursorPosition: number) {
    // Count the number of commas in the original value before formatting
    const originalCommasCount = (value.match(/,/g) || []).length;

    // Remove any existing commas
    value = value.replace(/,/g, '');

    // Format the value with commas and decimals
    const parts = value.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    const formattedValue = parts.join('.');

    // Count the number of commas in the formatted value after formatting
    const newCommasCount = (formattedValue.match(/,/g) || []).length;

    // Calculate the difference in commas count
    const commasDiff = newCommasCount - originalCommasCount;

    // Set the formatted value back to the input field
    this.el.nativeElement.value = formattedValue;

    // Calculate the new cursor position after considering added/removed commas
    const newPosition = cursorPosition + commasDiff;

    // Set the cursor position
    this.el.nativeElement.setSelectionRange(newPosition, newPosition);
  }
}
