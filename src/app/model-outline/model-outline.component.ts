import { Component, Input } from '@angular/core';
import { ObjectFile } from '../types/model-file';

@Component({
  selector: 'app-model-outline',
  templateUrl: './model-outline.component.html',
  styleUrls: ['./model-outline.component.scss']
})
export class ModelOutlineComponent {

  public expanded:boolean = true;
  public filter="";
  
  _currentDocument:ObjectFile;

  get currentDocument() {
    return this._currentDocument;
  }
  @Input() set currentDocument(val: ObjectFile) {
    this._currentDocument = val;
  }

  filterResults() {
    
  }
}
