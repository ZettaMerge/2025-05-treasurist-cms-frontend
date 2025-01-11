import { Directive, Input, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'img[imageFallback]'
})
export class ImageFallbackDirective {

  @Input() imageFallback: string;

  constructor(private eRef: ElementRef) { }

  @HostListener('error')
  loadFallbackOnError() {
    const element: HTMLImageElement = this.eRef.nativeElement as HTMLImageElement;
    element.src = this.imageFallback || 'assets/img/placeholder/img.png';
  }

}
