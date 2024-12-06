import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appAlphanumeric]',
  standalone: true
})
export class AlphanumericDirective {

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent): void {
    const inputValue: string = this.el.nativeElement.value;
    this.el.nativeElement.value = inputValue.replace(/[^a-zA-Z0-9]/g, '');
  }

}
