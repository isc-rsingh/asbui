import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { StepMetadata, StepService } from 'src/app/services/step.service';
import { StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-step-type-dropdown',
  templateUrl: './step-type-dropdown.component.html',
  styleUrls: ['./step-type-dropdown.component.scss']
})
export class StepTypeDropdownComponent {
  
  public stepTypes:StepMetadata[]=[];
  _stepType:StepType;

  @Input() get stepType():StepType {
    return this._stepType;
  };
  set stepType(val:StepType) {
    this._stepType = val;
    this.stepTypeChange.emit(this._stepType);
  }
  @Input() placeholder:string="";

  @Output() stepTypeChange = new EventEmitter();

  constructor(private stepService:StepService) {}
  
  private destroy$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.stepService.GetStepTypes$().pipe(takeUntil(this.destroy$)).subscribe((stepTypes) => {
      this.stepTypes = stepTypes.filter(s=>s.canAddToGroup || s.jsonName === this.stepType);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
