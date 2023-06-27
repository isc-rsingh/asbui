import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { DragHelperService } from 'src/app/services/drag-helper.service';
import { EditorContextService, SelectedCodeView } from 'src/app/services/editor-context.service';
import { StepService } from 'src/app/services/step.service';
import { TemplateServiceService } from 'src/app/services/template-service.service';
import { GroupObject, OperationObject, StepType } from 'src/app/types/model-file';

@Component({
  selector: 'app-group-editor',
  templateUrl: './group-editor.component.html',
  styleUrls: ['./group-editor.component.scss']
})
export class GroupEditorComponent implements OnInit, OnDestroy{
  @Input() step:OperationObject;
  @Input() isLastGroup: boolean;
  @ViewChild('groupNameInput') groupNameInput:ElementRef;

  newStepType:StepType;
  expanded:boolean[]=[];
  editing:boolean=false;
  currentView: SelectedCodeView;
  

  get group():GroupObject {
    return this.step as GroupObject;
  }


  constructor(
    private stepService:StepService, 
    private editorContextService:EditorContextService,
    private dragHelperService:DragHelperService,
    ) {}

  private destroy$: Subject<void> = new Subject<void>();
  
  ngOnInit(): void {
    this.editorContextService.currentSelectedCodeView$.pipe(takeUntil(this.destroy$)).subscribe((view) => { 
      this.currentView = view;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  addNewGroup() {
    this.stepService.AddNewGroup("Group Name");
  }
  addNewStep() {
    this.stepService.AddNewStepToGroup(this.group, this.newStepType)
  }

  // drop(event:CdkDragDrop<OperationObject>) {
  //   console.log(event);
  //   const steps = this.group.arguments?.steps || [];
  //   moveItemInArray(steps, event.previousIndex, event.currentIndex);
  // }

  showDescriptionInput() {
    this.editing = true;
    
    setTimeout(()=>{
      this.groupNameInput.nativeElement.focus();
    },0);
  }

  dragover(evt:DragEvent):boolean | void {
    if (this.dragHelperService.isBlockTemplate()) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }

      dataTransfer.dropEffect = 'copy';
      evt.preventDefault();
      return false;
    }
  }

  drop(evt:DragEvent) {
    const ctx = this.dragHelperService.dragContext;
    if (ctx && this.dragHelperService.isBlockTemplate()) {
      this.stepService.AddBlockTemplateBeforeGroup(ctx.id+'',this.group.stepId);
    }
  }


  get StepType() {
    return StepType;
  }

  get SelectedCodeView() {
    return SelectedCodeView;
  }
}
