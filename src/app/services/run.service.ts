import { Injectable } from '@angular/core';
import { CurrentStateService } from './current-state.service';
import { EditorContextService } from './editor-context.service';
import { StepService } from './step.service';
import { RunResponse } from '../types/runResponse';
import { AppDaoService } from './app-dao.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RunService {

  constructor(
    private currentStateService:CurrentStateService,
    private editorContext:EditorContextService,
    private stepService:StepService,
    private appDaoService:AppDaoService,
  ) { }

  runCurrentModel():Observable<RunResponse> {
    const currentModel = this.currentStateService.currentDocument;
    const pipelineToRun = this.stepService.GetPipelineForStep(currentModel, this.editorContext.currentFocusedStepId || 0);
    if (!pipelineToRun) {
      throw new Error('No pipeline found for step');
    }
    return this.appDaoService.runModel(currentModel, pipelineToRun);
  }
}
