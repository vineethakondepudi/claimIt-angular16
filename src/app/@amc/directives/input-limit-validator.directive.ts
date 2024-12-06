import { Directive, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[inputLimit]',
  standalone: true,
})
export class InputLimitValidatorDirective {
  @Input() minValue!: number;
  @Input() maxValue!: number;
  @Input() maxFractionDigits!: number;

  @HostListener('keydown', ['$event'])
  onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const currentValue = input.value;
    const key = event.key;
    let selectionStart = input.selectionStart ?? 0;

    // Handle Backspace key
    if (key === 'Backspace') {
      // If the Backspace key is pressed and cursor is on the dot, move cursor to left
      if (currentValue[selectionStart - 1] === '.') {
        input.setSelectionRange(selectionStart - 1, selectionStart - 1);
        event.preventDefault();
        return;
      }
    }

    // Handle Delete key
    if (key === 'Delete') {
      // If the Delete key is pressed and cursor is on the dot, move cursor to right
      if (currentValue[selectionStart] === '.') {
        input.setSelectionRange(selectionStart + 1, selectionStart + 1);
        event.preventDefault();
        return;
      }
    }

    // If maxFractionDigits is zero, prevent input of dot
    if (this.maxFractionDigits === 0 && key === '.') {
      event.preventDefault();
      return;
    }

    // If the user presses the dot and cursor is at the left side of the dot, move cursor to right
    if (key === '.' && selectionStart <= currentValue.indexOf('.')) {
      input.setSelectionRange(
        currentValue.indexOf('.') + 1,
        currentValue.indexOf('.') + 1
      );
      event.preventDefault();
      return;
    }

    // If cursor is on the left side of the dot
    if (selectionStart <= currentValue.indexOf('.')) {
      const newValue = parseFloat(
        currentValue.substring(0, selectionStart) +
          key +
          currentValue.substring(selectionStart)
      );
      if (newValue > this.maxValue) {
        event.preventDefault();
        return;
      }
    }

    // Allow Backspace if the current value is greater than or equal to the minimum value
    if (key === 'Backspace' && parseFloat(currentValue) <= this.minValue) {
      return;
    }

    // If the user tries to enter a value greater than the max value
    if (
      !isNaN(parseFloat(currentValue + key)) &&
      parseFloat(currentValue + key) > this.maxValue
    ) {
      event.preventDefault();
      return;
    }

    // If the user tries to enter more than maxFractionDigits decimal places
    if (
      currentValue.includes('.') &&
      currentValue.split('.')[1].length >= this.maxFractionDigits &&
      key !== 'Backspace' &&
      key !== 'Delete'
    ) {
      event.preventDefault();
      return;
    }

    // Clear the input field if the value is just a decimal point
    if (currentValue.length === 1 && currentValue === '.') {
      input.value = '';
      event.preventDefault();
      return;
    }
  }
}
