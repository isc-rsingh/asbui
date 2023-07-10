import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-block-text',
  templateUrl: './block-text.component.html',
  styleUrls: ['./block-text.component.scss']
})
export class BlockTextComponent {
  @Input() blockText:string;
  @Input() textInUse:boolean=false;
}
