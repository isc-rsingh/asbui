import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { CurrentStateService } from 'src/app/services/current-state.service';
import { RunResponse } from 'src/app/types/runResponse';

@Component({
  selector: 'app-block-run-report-pane',
  templateUrl: './block-run-report-pane.component.html',
  styleUrls: ['./block-run-report-pane.component.scss']
})
export class BlockRunReportPaneComponent {
  constructor(
    private currentStateService:CurrentStateService,
  ) {   }

  private destroy$: Subject<void> = new Subject<void>();

  runHistory: RunResponse | null = null;
  
  ngOnInit(): void {
    this.currentStateService.currentRunHistory$.pipe(takeUntil(this.destroy$)).subscribe((runHistory) => {
      this.runHistory = runHistory;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
