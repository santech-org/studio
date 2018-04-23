import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[keyboard-submit]',
})
export class KeyboardSubmitDirective {
  private _el: ElementRef;

  constructor(el: ElementRef) {
    this._el = el;
  }

  @HostListener('keydown', ['$event'])
  public triggerSubmit(event: KeyboardEvent) {
    if ((event.which === 13) && event.ctrlKey) {
      event.preventDefault();
      this._el.nativeElement.dispatchEvent(new Event('submit'));
    }
  }
}
