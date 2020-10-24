import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeHtml, SafeUrl, SafeStyle, SafeScript } from '@angular/platform-browser';

@Pipe({
  name: 'domsafe'
})
export class DomsafePipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }
  transform(value: any, type: string): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
    switch (type) {
      case 'html': return this.sanitizer.bypassSecurityTrustHtml(value);
      case 'style': return this.sanitizer.bypassSecurityTrustStyle(value);
      case 'script': return this.sanitizer.bypassSecurityTrustScript(value);
      case 'url': return this.sanitizer.bypassSecurityTrustUrl(value);
      case 'resourceUrl': return this.sanitizer.bypassSecurityTrustResourceUrl(value);
      default: throw new Error(`Invalid safe type specified: ${type}`);
    }
    // if ((type1 === 'html') && (type2 === 'style')) {
    //   return this.sanitizer.bypassSecurityTrustHtml(value) && this.sanitizer.bypassSecurityTrustStyle(value);
    // }
  }

}
