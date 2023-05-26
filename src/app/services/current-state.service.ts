import { Injectable } from '@angular/core';
import { ObjectFile } from '../types/model-file';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentStateService {

  constructor() { }

  private _currentDocument = new BehaviorSubject<ObjectFile>({
    "modelName": "New Model",
    "modelVersion": "1",
    "formatVersion": 1,
    "environment": {},
    "pipelines":[]
  });

  get currentDocument():ObjectFile {
    return this._currentDocument.value;
  }

  get currentDocument$(): Observable<ObjectFile> {
    return this._currentDocument.asObservable();
  }

  public setCurrentDocument(doc:ObjectFile) {
    this._currentDocument.next(doc);
  }
}
