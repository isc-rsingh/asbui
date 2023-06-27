import { Injectable } from '@angular/core';

export enum DragSource {
  GroupEditor,
  ModelEditor,
  ModelOutline,
  TemplateOutline,
}

export enum DragObjectType {
  Step,
  BlockTemplate,
}

export interface DragContext {
  dragSource:DragSource;
  dragObjectType: DragObjectType;
  id:number | string;
  parentId?:number;
}

@Injectable({
  providedIn: 'root'
})
export class DragHelperService {

  constructor() { }

  private _dragContext:DragContext | null;
  
  public get dragContext():DragContext | null{
    return this._dragContext;
  }

  public set dragContext(dragContext:DragContext | null) {
    this._dragContext = dragContext;
  }

  public isStep():boolean {
    return this._dragContext?.dragObjectType === DragObjectType.Step;
  }

  public isBlockTemplate():boolean {
    return this._dragContext?.dragObjectType === DragObjectType.BlockTemplate;
  }
}
