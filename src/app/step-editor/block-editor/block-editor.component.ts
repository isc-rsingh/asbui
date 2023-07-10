import { Component, Input } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { BlockDefinition, BlockPrompt, BlockPromptType, BlockTemplateService, BlockText } from 'src/app/services/block-template.service';
import { GroupArgs, GroupObject, OperationObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-editor',
  templateUrl: './block-editor.component.html',
  styleUrls: ['./block-editor.component.scss']
})
export class BlockEditorComponent {
  
  constructor(
    private blockTemplateService:BlockTemplateService,
  ) {}

  blockDefinition:BlockDefinition | undefined;

  private _step:OperationObject;
  @Input() get step():OperationObject {
    return this._step;
  };
  set step(v:OperationObject) {
    this._step = v;
    var grp = v as GroupObject;
    if (grp.arguments?.blockName) {
      firstValueFrom(this.blockTemplateService.GetBlockTemplate(grp.arguments.blockName)).then(x=>{
        this.blockDefinition = x;
      });
    }
  }

  get groupObject():GroupObject {
    return this.step as GroupObject;
  }

  get groupArgs():GroupArgs {
    return this.groupObject.arguments ||{steps:[]};
  }
  
  statementIsText(statement:BlockPrompt | BlockText):boolean {
    return !!(statement as BlockText).text;
  }

  statementIsNumberInput(statement:BlockPrompt | BlockText):boolean {
    const prompt = statement as BlockPrompt;
    return (!!prompt.promptid) && prompt.promptType === BlockPromptType.Number;
  }

  statementText(statement:BlockPrompt | BlockText):string {
    return (statement as BlockText).text || '';
  }

  asPrompt(statement:BlockPrompt | BlockText):BlockPrompt {
    return statement as BlockPrompt;
  }

  textInUse(statement:BlockPrompt | BlockText): boolean {
    const blockText = (statement as BlockText);
    let rslt = blockText.associatedPrompts?.some(p=>{
      const prompt = this.blockDefinition?.statements.find(x=>(x as BlockPrompt).promptid === p) as BlockPrompt;
      if (prompt) {
        const fragment = this.blockDefinition?.fragments.find((x)=>x.stepId === prompt.fragmentStepId);
        if (fragment) {
          return this.groupArgs.steps.find(x=>x.description === fragment.description);
        }
      }
      
      return false;
    }) || false;

    return rslt;
  }
}
