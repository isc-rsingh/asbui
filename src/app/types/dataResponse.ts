export interface DataResponse{
    modelName:string;
    rowCount:number;
    timestamp:string;
    resultSet:DataResultSetResponse;
}

export interface DataResultSetResponse {
    columns:DataColumnsResponse[];
    rows:any[][];
}

export interface DataColumnsResponse {
    name:string;
    type:string
}