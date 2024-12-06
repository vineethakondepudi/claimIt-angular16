import { Directive, HostListener, ElementRef, Input } from '@angular/core';
// import { CurrencyPipe } from '@angular/common';

@Directive({ selector: '[currencyLength]',
            standalone: true
 })
export class CurrencyLengthDirective {
  // build the regex based on max pre decimal digits allowed
  private regexString(max?: number) {
    const maxStr = max ? `{0,${max}}` : `+`;
    return `^(\\d${maxStr}(\\.\\d{0,3})?|\\.\\d{0,3})$`;
  }
  private digitRegex!: RegExp;
  private setRegex(maxDigits?: number) {
    this.digitRegex = new RegExp(this.regexString(maxDigits), 'g');
  }
  @Input()
  set maxDigits(maxDigits: number) {
    this.setRegex(maxDigits);
  }

  private el: HTMLInputElement;

  constructor(
    private elementRef: ElementRef,
  ) {
    this.el = this.elementRef.nativeElement;
    this.setRegex();
  }

  // variable to store last valid input
  private lastValid = '';
  @HostListener('input', ['$event'])
  onInput(event:any) {
    // on input, run regex to only allow certain characters and format
    const cleanValue = (event.target.value.match(this.digitRegex) || []).join(
      ''
    );
    if (cleanValue || !event.target.value) this.lastValid = cleanValue;
    this.el.value = cleanValue || this.lastValid;
  }
}
