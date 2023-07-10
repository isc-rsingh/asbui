import { Component, OnInit } from '@angular/core';
import { TemplateFile } from '../types/template';
import { TemplateServiceService } from '../services/template-service.service';
import { firstValueFrom, lastValueFrom} from 'rxjs';
import { CurrentStateService } from '../services/current-state.service';
import { DragHelperService, DragObjectType, DragSource } from '../services/drag-helper.service';
import { RunService } from '../services/run.service';
import { BlockDefinition, BlockTemplateService } from '../services/block-template.service';

@Component({
  selector: 'app-templates-outline',
  templateUrl: './templates-outline.component.html',
  styleUrls: ['./templates-outline.component.scss']
})
export class TemplatesOutlineComponent implements OnInit {
  
  public expanded:boolean = true;
  public standardExpanded:boolean = true;
  public userExpanded:boolean = true;
  public blockExpanded:boolean = true;
  
  public filter = "";
  public systemTemplates: TemplateFile[];
  public userTemplates: TemplateFile[];
  public blockTemplates: BlockDefinition[];
  public filteredSystemTemplates: TemplateFile[];
  public filteredUserTemplates: TemplateFile[];
  public filteredBlockTemplates: BlockDefinition[];

  constructor(
    private templateService:TemplateServiceService, 
    private currentStateService:CurrentStateService,
    private dragHelperService:DragHelperService,
    private runService:RunService,
    private blockService:BlockTemplateService,
  ) {}

  async ngOnInit() {
    this.systemTemplates = await lastValueFrom(this.templateService.GetSystemTemplates());
    this.userTemplates = await lastValueFrom(this.templateService.GetUserTemplates());
    this.blockTemplates = await lastValueFrom(this.blockService.GetBlockTemplates());

    this.filterResults();
  }
  
  public filterResults(): void {
    this.filteredSystemTemplates = this.systemTemplates.filter(x=>!this.filter || x.name.includes(this.filter));
    this.filteredUserTemplates = this.userTemplates.filter(x=>!this.filter || x.name.includes(this.filter));
    this.filteredBlockTemplates = this.blockTemplates.filter(x=>!this.filter || x.blockName.includes(this.filter));
  }

  public async openTemplate(template:TemplateFile) {
    const model = await firstValueFrom(this.templateService.GetModel(template));
    this.currentStateService.setCurrentDocument(model);
    const runHistory = await firstValueFrom(this.runService.getRunHistory());
    this.currentStateService.setCurrentRunHistory(runHistory);
  }

  dragStart(evt:DragEvent, blockTemplate:BlockDefinition) {
    this.dragHelperService.dragContext = {
      id:blockTemplate.blockName,
      dragObjectType: DragObjectType.BlockTemplate,
      dragSource:DragSource.TemplateOutline
    };
  }
}
