import { Directive, ElementRef  } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';

@Directive({
  selector: '[appTooltip]',
  standalone: true
})
export class TooltipDirective {

  constructor(
    private matTooltip: MatTooltip,
    private elementRef: ElementRef<HTMLElement>
  ) { }

  ngOnInit(){
    setTimeout(() => {
      const element = this.elementRef.nativeElement;
      this.matTooltip.disabled = element.scrollWidth <= element.clientWidth;
    });
  }
}
