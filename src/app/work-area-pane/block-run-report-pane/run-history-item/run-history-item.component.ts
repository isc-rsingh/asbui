import { Component, Input } from '@angular/core';
import { RunHistoryResponse } from 'src/app/types/runResponse';

@Component({
  selector: 'app-run-history-item',
  templateUrl: './run-history-item.component.html',
  styleUrls: ['./run-history-item.component.scss']
})
export class RunHistoryItemComponent {
  @Input() runHistoryItem:RunHistoryResponse;

  expand:boolean=false;
}
