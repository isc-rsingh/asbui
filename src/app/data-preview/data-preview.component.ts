import { Component } from '@angular/core';
import { CurrentStateService } from '../services/current-state.service';
import { DataService } from '../services/data.service';
import { DataResponse } from '../types/dataResponse';

import { firstValueFrom } from 'rxjs';
import { MatColumnDef } from '@angular/material/table';
import { CdkColumnDef } from '@angular/cdk/table';

@Component({
  selector: 'app-data-preview',
  templateUrl: './data-preview.component.html',
  styleUrls: ['./data-preview.component.scss']
})
export class DataPreviewComponent {

  constructor(
    private currentStateService:CurrentStateService,
    private dataService:DataService,
  ) { }
  
  dataResponse:DataResponse | null = null;

  get columns() {
    if (!this.dataResponse) {
      return [];
    }
    const rslt = [];
    for (let i=0;i<this.dataResponse.resultSet.columns.length;i++) {
      if (this.dataResponse.resultSet.columns[i].type === 'object') {
        continue;
      }
      rslt.push(
        {
          columnDef: this.dataResponse.resultSet.columns[i].name,
          header: this.dataResponse.resultSet.columns[i].name,
          cell: (element:any) => element[i],
        }
      );
    };
    return rslt;
  }

  get dataSource() {
    if (!this.dataResponse) {
      return [];
    }
    return this.dataResponse.resultSet.rows;
  }

  get displayedColumns() {
    if (!this.dataResponse) {
      return [];
    }
    return this.columns.map(col=>col.columnDef);
  }

  async ngOnInit() {
    this.dataResponse = await firstValueFrom(this.dataService.getLatestData());
  }

}
