export interface ExecuteRunResponse {
    runID:number;
    rowCount:number;
    status:string;
}

export interface RunHistoryResponse {
    runID:number;
    status:string;
    timestamp:string;
}

export interface RunResponse {
    modelName:string;
    runs:RunHistoryResponse[];
}
