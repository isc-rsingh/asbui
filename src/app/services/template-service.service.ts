import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TemplateFile } from '../types/template';

@Injectable({
  providedIn: 'root'
})
export class TemplateServiceService {

  constructor() { }

  public GetSystemTemplates(): Observable<TemplateFile[]> {
    return of([{name:"HB1aC TestModel"}]);
  }

  public GetUserTemplates(): Observable<TemplateFile[]> {
    return of([{name:"Hospital Intake"}]);
  }
}
