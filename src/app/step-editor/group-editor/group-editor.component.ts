import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { BlockTemplateService } from 'src/app/services/block-template.service';
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
  groupIsSelected:boolean=false;

  get group():GroupObject {
    return this.step as GroupObject;
  }


  constructor(
    private stepService:StepService, 
    private editorContextService:EditorContextService,
    private dragHelperService:DragHelperService,
    private blockService:BlockTemplateService,
    ) {}

  private destroy$: Subject<void> = new Subject<void>();
  
  ngOnInit(): void {
    this.editorContextService.currentSelectedCodeView$.pipe(takeUntil(this.destroy$)).subscribe((view) => { 
      this.currentView = view;
    });

    this.editorContextService.currentFocusedBlockId$.pipe(takeUntil(this.destroy$)).subscribe((blockId) => {
      this.groupIsSelected = false;
      if (this.step.stepId === blockId) {
        this.groupIsSelected = true;
      } 
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

  showDescriptionInput($event:MouseEvent) {
    this.editing = true;
    $event.stopPropagation();
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

  async drop(evt:DragEvent) {
    const ctx = this.dragHelperService.dragContext;
    if (ctx && this.dragHelperService.isBlockTemplate()) {
      const newStepId = await this.blockService.AddBlockTemplateBeforeGroup(ctx.id+'',this.group.stepId);
      if (newStepId) {
        this.editorContextService.setCurrentFocusedBlockId$(newStepId);
      }
    }
  }

  setFocus() {
    this.editorContextService.setCurrentFocusedBlockId$(this.group.stepId);
  }

  dragOverArrow(evt:DragEvent, step: OperationObject):boolean | void { 
    if (this.dragHelperService.isBlockTemplate()) {
      const dataTransfer = evt.dataTransfer;
      if (dataTransfer==null) {
        return true;
      }

      evt.preventDefault();
      return false;
    }
  }

  async dropOnArrow(evt:DragEvent, step:OperationObject) {
    const ctx = this.dragHelperService.dragContext;
    if (ctx && this.dragHelperService.isBlockTemplate()) {
      const newStepId = await this.blockService.AddBlockTemplateAfterStep(ctx.id+'', step.stepId) ;
      if (newStepId) {
        this.editorContextService.setCurrentFocusedBlockId$(newStepId);
      }
    }
  }

  get StepType() {
    return StepType;
  }

  get SelectedCodeView() {
    return SelectedCodeView;
  }
}
