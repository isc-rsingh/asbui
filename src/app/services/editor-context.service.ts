import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum SelectedCodeView {
  LowCode=0,
  Diagram=1,
  Code=2
}

@Injectable({
  providedIn: 'root'
})
export class EditorContextService {

  constructor() { }
  
  private _currentFocusedStepId = new BehaviorSubject<number | null>(null);
  private _currentSelectedCodeView = new BehaviorSubject<SelectedCodeView>(SelectedCodeView.Diagram);

  get currentFocusedStepId(): number | null {
    return this._currentFocusedStepId.value;
  }

  get currentFocusedStepId$(): Observable<number | null> {
    return this._currentFocusedStepId.asObservable();
  }

  public setCurrentFocusedStepId$(val:number | null) {
    this._currentFocusedStepId.next(val);
  }

  get currentSelectedCodeView(): SelectedCodeView {
    return this._currentSelectedCodeView.value;
  }

  get currentSelectedCodeView$(): Observable<SelectedCodeView> {
    return this._currentSelectedCodeView.asObservable();
  }

  public setCurrentSelectedCodeView$(val:SelectedCodeView) {
    this._currentSelectedCodeView.next(val);
  } 
}
