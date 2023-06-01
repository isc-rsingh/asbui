import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { StepObject, StepType } from '../types/model-file';
import { Subject, takeUntil } from 'rxjs';
import { StepMetadata, StepService } from '../services/step.service';

@Component({
  selector: 'app-step-editor',
  templateUrl: './step-editor.component.html',
  styleUrls: ['./step-editor.component.scss']
})
export class StepEditorComponent implements OnInit, OnDestroy {
  @Input() step:StepObject;

  public stepTypes:StepMetadata[]=[];
  public expanded:boolean=false;
  
  constructor(private stepService:StepService) {}
  
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.stepService.GetStepTypes$().pipe(takeUntil(this.destroy$)).subscribe((stepTypes) => {
      this.stepTypes = stepTypes.filter(s=>s.canAddToGroup);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get StepType() {
    return StepType;
  }
}
