import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlockDefinition, BlockPrompt, BlockPromptType, BlockTemplateService } from 'src/app/services/block-template.service';
import { GroupObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-input',
  templateUrl: './block-input.component.html',
  styleUrls: ['./block-input.component.scss']
})
export class BlockInputComponent implements OnInit, OnDestroy {
  @Input() GroupStep:GroupObject;
  @Input() BlockPrompt:BlockPrompt;
  @Input() BlockDefinition:BlockDefinition | undefined;
  

  constructor(
    private formBuilder: FormBuilder,
    private blockTemplateService:BlockTemplateService,
  ) {}

  ngOnInit(): void {
    if (this.BlockDefinition) {
      this.form.setValue({num:this.blockTemplateService.GetPromptValue( this.BlockPrompt.promptid, this.BlockDefinition, this.GroupStep)})
    }

    this.sub = this.form.valueChanges.subscribe((val) => {
      if (this.BlockDefinition) {
        this.blockTemplateService.SetPromptValue(this.BlockPrompt.promptid, val.num, this.BlockDefinition, this.GroupStep);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  form = this.formBuilder.group({
    num:0
  });
  
  sub!: Subscription;

  get inputType() {
    switch (this.BlockPrompt.promptType) {
      case BlockPromptType.Date:
        return "date";
      case BlockPromptType.Number:
        return "number";
      default:
        return "text";

    }
  }
}
