// This is the declaration for the top-level Object File JSON.
export interface ObjectFile {
  modelName: string;
  modelVersion: string;
  formatVersion: number;
  environment: {[key:string] : EnvValue | EnvSQLValueSet | EnvListValueSet};
  pipelines: PipelineObject[];
  exportSpec?: ExportSpec;
}

export enum StepType {
  Pipeline = "pipeline",
  Group = "group",
  Merge = "merge",
  SqlPopulate = "sqlPopulate",
  SqlAnnotate = "sqlAnnotate",
  ConditionAnnotate = "conditionAnnotate",
  Filter = "filter",
  Export = "export"
}

export interface StepObject {
  stepId: number;
  stepType: StepType;
  description?: string;
  disabled?: boolean;
}

export interface PipelineObject extends StepObject {
  name: string;
  steps: OperationObject[];
}

export interface OperationObject extends StepObject {
  arguments?: MergeArgs | FilterArgs | ConditionAnnotateArgs | SqlAnnotateArgs | SqlPopulateArgs | GroupArgs | ExportArgs;
}

export interface GroupObject extends OperationObject {
  arguments?: GroupArgs;
}
export interface GroupArgs {
  steps: OperationObject[];
}
export interface ExportArgs {

}

// Descriptions of the argument data for each of the operation types
export interface MergeArgs {
  pipelineNames: string[];
}
export interface FilterArgs extends ConditionSpec{
}

export interface ConditionAnnotateArgs extends ConditionSpec {
  annotationName: string;
}
export interface ConditionSpec {
  condition: string;
  localEnvironment: ConditionMap;
}

export interface ConditionMap {
  [name: string] : ValueSpec;
}
export interface ValueSpec {
  pathExpression: string;
  dataType: EEnvDataType;
}


export interface SqlPopulateArgs {
  annotationName: string;
  tableName: string;
  groupingField: string;
  where?: WhereSpec;
  annotationProperties: SQLField[];
}

export interface SqlAnnotateArgs extends SqlPopulateArgs {
}
export interface SQLField {
  annotationPropertyName?: string;
  sqlType?: ESqlDataType;
  selectExpression: string;
  parameters?: string[];
}
export interface WhereSpec {
  clause: string;
  parameters?: string[];
}

// Description of the ExportSpec
export interface ExportSpec {
  tableName: string;
  fullAnnotation: boolean;
  includeDeleted: boolean;
  columnSpecs: ColumnSpec[];
}

export interface ColumnSpec {
  columnName:string;
  pathExpression: string;
  sqlType: ESqlDataType;
  collectionType: ESqlCollectionType;
}

// Descriptions of the Environment Data Block
export interface EnvBase {
  dataType: EEnvDataType;
}
export enum EEnvDataType {
  string = "string",
  date = "date",
  number = "number",
  valueSet = "valueSet"
}

export enum ESqlDataType {
  string = "VARCHAR(4000)",
  integer = "INT",
  decimal = "DECIMAL",
  boolean = "BIT"
}

export enum ESqlCollectionType {
  none = "none",
  list = "list",
  json = "json",
  csv = "csv"
}

export interface EnvValue extends EnvBase {
  value: string;
}

export interface EnvValueSetBase extends EnvBase {
  source: EEnvSource,
}
export enum EEnvSource {
  List = "list",
  SQL = "sql"
}
export interface EnvSQLValueSet extends EnvValueSetBase {
  tableName: string,
  fieldName: string,
  whereClause: string;
}

export interface EnvListValueSet extends EnvValueSetBase {
  values?: string[];
}
