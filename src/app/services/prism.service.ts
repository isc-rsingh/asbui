import { Injectable } from '@angular/core';

import 'prismjs';
import 'prismjs/plugins/line-numbers/prism-line-numbers';
import 'prismjs/components/prism-json';

declare var Prism: any;

@Injectable({
  providedIn: 'root'
})
export class PrismService {

  constructor() { }

  highlightAll() {
    Prism.highlightAll();
  }
}
