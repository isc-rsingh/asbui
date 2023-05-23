import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ObjectFile } from '../types/model-file';
import { CurrentStateService } from '../services/current-state.service';


@Component({
  selector: 'app-code-notebook',
  templateUrl: './code-notebook.component.html',
  styleUrls: ['./code-notebook.component.scss']
})
export class CodeNotebookComponent {
  
  public currentDocument:ObjectFile;

  constructor(public currentState:CurrentStateService) {}

  private destroy$: Subject<void> = new Subject<void>();
    
  ngOnInit(): void {
    this.currentState.currentDocument$.pipe(takeUntil(this.destroy$)).subscribe((doc) => {
      this.currentDocument = doc;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
