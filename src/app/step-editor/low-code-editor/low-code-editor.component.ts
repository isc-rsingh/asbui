import { AfterViewChecked, AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { OperationObject } from 'src/app/types/model-file';

import { fromEvent, Subscription } from 'rxjs';
import { FormBuilder } from '@angular/forms';
import { PrismService } from 'src/app/services/prism.service';

@Component({
  selector: 'app-low-code-editor',
  templateUrl: './low-code-editor.component.html',
  styleUrls: ['./low-code-editor.component.scss']
})
export class LowCodeEditorComponent implements OnInit, AfterViewChecked, AfterViewInit, OnDestroy {
  
  @ViewChild('textarea', { static: true })  textarea!: ElementRef;
  @ViewChild('code', { static: true }) code!: ElementRef;
  @ViewChild('pre', { static: true }) pre!: ElementRef;

  constructor (
    private prismService: PrismService,
    private formBuilder: FormBuilder,
    private renderer: Renderer2
  ) {}

  sub!: Subscription;
  highlighted = false;
  
  json:string='';

  form = this.formBuilder.group({
    content: this.json
  });

  ngOnInit(): void {
    this.listenForm()
    this.synchronizeScroll();
    this.renderer.setProperty(this.code.nativeElement, 'innerHTML', this.json);
  }
  ngAfterViewChecked(): void {
    if (this.highlighted) {
      this.prismService.highlightAll();
      this.highlighted = false;
    }
  }
  ngAfterViewInit(): void {
    this.prismService.highlightAll();
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  } 
  
  private _step:OperationObject;
  @Input() set step(step:OperationObject) {
    this._step = step;
    this.json = JSON.stringify(step.arguments, null, 2);
    this.form.setValue({content: this.json});
  }
  
  get step():OperationObject {
    return this._step;
  }

  updateFromJson(json:string) {
    try {
      const args = JSON.parse(json);
      this.step.arguments = args;
    } catch (e) {
      //Swallow bad syntax
    }
  }

  private listenForm() {
    this.sub = this.form.valueChanges.subscribe((val) => {
      
      this.renderer.setProperty(this.code.nativeElement, 'innerHTML', val.content); //TODO - Is this needed?
      this.updateFromJson(val.content || '');

      this.highlighted = true;
    });
  }

  private synchronizeScroll() {
    const localSub  = fromEvent(this.textarea.nativeElement, 'scroll').subscribe(() => {
      const toTop = this.textarea.nativeElement.scrollTop;
      const toLeft = this.textarea.nativeElement.scrollLeft;

      this.renderer.setProperty(this.pre.nativeElement, 'scrollTop', toTop);
      this.renderer.setProperty(this.pre.nativeElement, 'scrollLeft', toLeft + 0.2);
    });

    this.sub.add(localSub);
  }
}
