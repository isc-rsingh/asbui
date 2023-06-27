import { Component, OnInit } from '@angular/core';
import { TemplateFile } from '../types/template';
import { BlockTemplate, TemplateServiceService } from '../services/template-service.service';
import { firstValueFrom, lastValueFrom} from 'rxjs';
import { CurrentStateService } from '../services/current-state.service';
import { DragHelperService, DragObjectType, DragSource } from '../services/drag-helper.service';

@Component({
  selector: 'app-templates-outline',
  templateUrl: './templates-outline.component.html',
  styleUrls: ['./templates-outline.component.scss']
})
export class TemplatesOutlineComponent implements OnInit {
  
  public expanded:boolean = false;
  public standardExpanded:boolean = true;
  public userExpanded:boolean = true;
  public blockExpanded:boolean = true;
  
  public filter = "";
  public systemTemplates: TemplateFile[];
  public userTemplates: TemplateFile[];
  public blockTemplates: BlockTemplate[];
  public filteredSystemTemplates: TemplateFile[];
  public filteredUserTemplates: TemplateFile[];
  public filteredBlockTemplates: BlockTemplate[];

  constructor(
    private templateService:TemplateServiceService, 
    private currentStateService:CurrentStateService,
    private dragHelperService:DragHelperService,
  ) {}

  async ngOnInit() {
    this.systemTemplates = await lastValueFrom(this.templateService.GetSystemTemplates());
    this.userTemplates = await lastValueFrom(this.templateService.GetUserTemplates());
    this.blockTemplates = await lastValueFrom(this.templateService.GetBlockTemplates());

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
  }

  dragStart(evt:DragEvent, blockTemplate:BlockTemplate) {
    this.dragHelperService.dragContext = {
      id:blockTemplate.blockName,
      dragObjectType: DragObjectType.BlockTemplate,
      dragSource:DragSource.TemplateOutline
    };
  }
}
