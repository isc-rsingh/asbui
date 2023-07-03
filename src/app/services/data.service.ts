import { Injectable } from '@angular/core';
import { DataResponse } from '../types/dataResponse';
import { Observable, of } from 'rxjs';
import { AppDaoService } from './app-dao.service';
import { CurrentStateService } from './current-state.service';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(
    private appDaoService:AppDaoService,
    private currentStateService:CurrentStateService,
  ) { }

  getLatestData():Observable<DataResponse | null> {
    const runHistory = this.currentStateService.currentRunHistory;
    if (!runHistory) {
      throw new Error('No run history');
    }
    const lastGoodRun = runHistory.runs.find(run=>!run.status);
    if (!lastGoodRun) {
      return of(null);
    }
    return this.appDaoService.getData(lastGoodRun.runID, 0, 50);
  }
}
