import { Component, OnInit } from '@angular/core';
import { TemplateFile } from '../types/template';
import { TemplateServiceService } from '../services/template-service.service';
import { firstValueFrom, lastValueFrom} from 'rxjs';
import { CurrentStateService } from '../services/current-state.service';

@Component({
  selector: 'app-templates-outline',
  templateUrl: './templates-outline.component.html',
  styleUrls: ['./templates-outline.component.scss']
})
export class TemplatesOutlineComponent implements OnInit {
  
  public expanded:boolean = false;
  public standardExpanded:boolean = true;
  public userExpanded:boolean = true;
  
  public filter = "";
  public systemTemplates: TemplateFile[];
  public userTemplates: TemplateFile[];
  public filteredSystemTemplates: TemplateFile[];
  public filteredUserTemplates: TemplateFile[];

  constructor(private templateService:TemplateServiceService, private currentStateService:CurrentStateService) {}

  async ngOnInit() {
    this.systemTemplates = await lastValueFrom(this.templateService.GetSystemTemplates());
    this.userTemplates = await lastValueFrom(this.templateService.GetUserTemplates());

    this.filterResults();
  }
  
  public filterResults(): void {
    this.filteredSystemTemplates = this.systemTemplates.filter(x=>!this.filter || x.name.includes(this.filter));
    this.filteredUserTemplates = this.userTemplates.filter(x=>!this.filter || x.name.includes(this.filter));
  }

  public async openTemplate(template:TemplateFile) {
    const model = await firstValueFrom(this.templateService.GetModel(template));
    this.currentStateService.setCurrentDocument(model);
  }
}
