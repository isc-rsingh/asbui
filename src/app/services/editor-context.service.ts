import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditorContextService {

  constructor() { }
  
  private _currentFocusedStepId = new BehaviorSubject<number | null>(null);

  get currentFocusedStepId(): number | null {
    return this._currentFocusedStepId.value;
  }

  get currentFocusedStepId$(): Observable<number | null> {
    return this._currentFocusedStepId.asObservable();
  }

  public setCurrentFocusedStepId$(val:number | null) {
    this._currentFocusedStepId.next(val);
  }
}
