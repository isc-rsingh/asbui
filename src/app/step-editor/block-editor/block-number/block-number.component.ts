import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { BlockDefinition, BlockPrompt, BlockTemplateService } from 'src/app/services/block-template.service';
import { GroupObject } from 'src/app/types/model-file';

@Component({
  selector: 'app-block-number',
  templateUrl: './block-number.component.html',
  styleUrls: ['./block-number.component.scss']
})
export class BlockNumberComponent implements OnInit, OnDestroy {
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
}
