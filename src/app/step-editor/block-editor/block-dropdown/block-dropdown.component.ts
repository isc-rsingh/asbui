import { KeyValue } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlockPrompt, BlockDefinition, BlockTemplateService } from 'src/app/services/block-template.service';
import { GroupObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-dropdown',
  templateUrl: './block-dropdown.component.html',
  styleUrls: ['./block-dropdown.component.scss']
})
export class BlockDropdownComponent {
  @Input() GroupStep:GroupObject;
  @Input() BlockPrompt:BlockPrompt;
  @Input() BlockDefinition:BlockDefinition | undefined;
  

  constructor(
    private formBuilder: FormBuilder,
    private blockTemplateService:BlockTemplateService,
  ) {}

  ngOnInit(): void {
    if (this.BlockDefinition) {
      this.form.setValue({promptValue:this.blockTemplateService.GetPromptValue( this.BlockPrompt.promptid, this.BlockDefinition, this.GroupStep)})
    }

    this.sub = this.form.valueChanges.subscribe((val) => {
      if (this.BlockDefinition) {
        this.blockTemplateService.SetPromptValue(this.BlockPrompt.promptid, (val.promptValue === "" ? null : val.promptValue), this.BlockDefinition, this.GroupStep);
      }
    });
  }

  get PromptValues(): KeyValue<string,string>[] {
    return (this.BlockPrompt.promptValues || []).map(x=>{
      return {
        key:(x as KeyValue<string,string>).key || x,
        value:(x as KeyValue<string,string>).value || x
      } as KeyValue<string,string>;
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  form = this.formBuilder.group({
    promptValue:""
  });
  
  sub!: Subscription;
}
