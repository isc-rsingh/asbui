import { Component, OnInit } from '@angular/core';

import { CurrentStateService } from './services/current-state.service';
import { EEnvDataType, EEnvSource, ESqlDataType, StepType } from './types/model-file';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HealthShare.Analytics.Solution.Builder';
  
  constructor (public currentState:CurrentStateService) {}
  
  
  ngOnInit(): void {
    this.initFakeDocument();
  }


  initFakeDocument() {
    this.currentState.setCurrentDocument({
      "modelName": "diabetes-ARKv9",
      "modelVersion": "8",
      "formatVersion": 1,
      "environment": {
        "measurePeriodEnd": {
          "value": "2020-12-31",
          "dataType": EEnvDataType.date
        },
        "measurePeriodStart": {
          "value": "2014-01-01",
          "dataType": EEnvDataType.date
        },
        "HbA1cLabCode": {
          "value": "%A1C%",
          "dataType": EEnvDataType.string
        },
        "diabetesDiagnosisCodes": {
          "dataType": EEnvDataType.valueSet,
          "source": EEnvSource.SQL,
          "tableName": "HISOL_MEAS.dtNCQAValueSets",
          "fieldName": "replace(vscode,'.','')",
          "whereClause": "valueSetName = 'diabetes'"
        }
      },
      "pipelines": [
        {
          "name": "diabetes main",
          "stepType": StepType.Pipeline,
          "description": "numerators",
          "stepId": 1,
          "steps": [
            {
              "stepType": StepType.SqlAnnotate,
              "description": "diabetes dx",
              "stepId": 2,
              "arguments": {
                "tableName": "HSAA.Diagnosis",
                "groupingField": "patient->MPIID",
                "annotationName": "encounters",
                "annotationProperties": [
                  {
                    "selectExpression": "encounter->encounterType",
                    "annotationPropertyName": "encounterType",
                    "dataType": "string"
                  },
                  {
                    "selectExpression": "date(encounter->startTime)",
                    "annotationPropertyName": "encounterDate",
                    "dataType": "string"
                  },
                  {
                    "annotationPropertyName": "diagnosisCode",
                    "selectExpression": "diagnosis_Code",
                    "dataType": "string",
                    "parameters": []
                  }
                ],
                "where": {
                  "clause": "Diagnosis_code %Inlist ? and encounter->startTime between ? and ?",
                  "parameters": [
                    "diabetesDiagnosisCodes",
                    "measurePeriodStart",
                    "measurePeriodEnd"
                  ]
                }
              },
              "disabled": false
            },
            {
              "stepType": StepType.Group,
              "stepId": 3,
              "description": "at least one inpatient or two outpatient encounters",
              "arguments": {
                "steps": [
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 4,
                    "description": "# inpatient encounters",
                    "arguments": {
                      "condition": "(encounters.where(encounterType=='Inpatient')).count()",
                      "localEnvironment": {},
                      "annotationName": "numInpatientEncounter"
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 5,
                    "description": "# outpatient encounters",
                    "arguments": {
                      "condition": "(encounters.where(encounterType=='Outpatient')).count()",
                      "localEnvironment": {},
                      "annotationName": "numOutpatientEncounter"
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 6,
                    "description": "outpt diagnosis code",
                    "arguments": {
                      "annotationName": "outpatientDiagnosisCode",
                      "condition": "(encounters.where(encounterType=='Outpatient').diagnosisCode)",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 7,
                    "description": "inpt diagnosis code",
                    "arguments": {
                      "annotationName": "inpatientDiagnosisCode",
                      "condition": "(encounters.where(encounterType=='Inpatient').diagnosisCode)",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.Filter,
                    "stepId": 8,
                    "description": "visit counts are met",
                    "arguments": {
                      "condition": "numInpatientEncounter >= 1 or numOutpatientEncounter >= 2",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  }
                ]
              },
              "disabled": false
            },
            {
              "stepType": StepType.Group,
              "stepId": 9,
              "description": "age between 18 and 75",
              "arguments": {
                "steps": [
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 10,
                    "description": "calculate age",
                    "arguments": {
                      "tableName": "HSAA.Patient",
                      "groupingField": "MPIID",
                      "annotationProperties": [
                        {
                          "selectExpression": "datediff('YY', birthdate, ?)",
                          "annotationPropertyName": "age",
                          "dataType": "number",
                          "parameters": [
                            "measurePeriodEnd"
                          ]
                        }
                      ],
                      "where": {
                        "clause": "",
                        "parameters": []
                      },
                      "annotationName": "demographic"
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.Filter,
                    "stepId": 11,
                    "description": "age range",
                    "arguments": {
                      "condition": "demographic.age>=18 and demographic.age<=75",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  }
                ]
              },
              "disabled": false
            },
            {
              "stepType": StepType.Group,
              "stepId": 12,
              "description": "HbA1c numerator part",
              "arguments": {
                "steps": [
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 13,
                    "description": "lab tests",
                    "arguments": {
                      "tableName": "HSAA.LabResultItem",
                      "groupingField": "patient->MPIID",
                      "annotationProperties": [
                        {
                          "selectExpression": "date(encounter->StartTime)",
                          "annotationPropertyName": "testDate",
                          "dataType": "string"
                        },
                        {
                          "selectExpression": "resultValue",
                          "annotationPropertyName": "resultValue",
                          "dataType": "number"
                        }
                      ],
                      "where": {
                        "clause": "encounter->StartTime between ? and ? and testItemCode_description like ?",
                        "parameters": [
                          "measurePeriodStart",
                          "measurePeriodEnd",
                          "HbA1cLabCode"
                        ]
                      },
                      "annotationName": "HbA1cTests"
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 14,
                    "description": "HbA1c numerators",
                    "arguments": {
                      "condition": "iif(HbA1cTests.count()>0, HbA1cTests.sort('testDate',false)[0].resultValue<9 and HbA1cTests.sort('testDate',false)[0].resultValue>=8,0)",
                      "annotationName": "HbA1cGTE8LT9",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 15,
                    "description": "HbA1c numerators",
                    "arguments": {
                      "condition": "iif(HbA1cTests.count()>0,HbA1cTests.sort('testDate',false)[0].resultValue>=9,0)",
                      "annotationName": "HbA1cGTE9",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 16,
                    "description": "HbA1c numerators",
                    "arguments": {
                      "condition": "iif(HbA1cTests.count()>0,HbA1cTests.sort('testDate',false)[0].resultValue<8,0)",
                      "annotationName": "HbA1cLT8",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  },
                  {
                    "stepType": StepType.ConditionAnnotate,
                    "stepId": 17,
                    "description": "HbA1c numerators",
                    "arguments": {
                      "condition": "HbA1cTests.count()==0",
                      "annotationName": "HbA1cMissing",
                      "localEnvironment": {}
                    },
                    "disabled": false
                  }
                ]
              },
              "disabled": false
            },
            {
              "stepId": 18,
              "stepType": StepType.Export,
              "arguments": {
                "tableName": "HISOL.diabetesARKv10",
                "fullAnnotation": true,
                "includeDeleted": false,
                "columnSpecs": [
                  {
                    "columnName": "age",
                    "pathExpression": "demographic.age",
                    "sqlType": ESqlDataType.integer
                  },
                  {
                    "columnName": "gender",
                    "pathExpression": "demographic.gender",
                    "sqlType": ESqlDataType.string
                  },
                  {
                    "columnName": "Race",
                    "pathExpression": "demographic.Race",
                    "sqlType": ESqlDataType.string
                  },
                  {
                    "columnName": "zip",
                    "pathExpression": "demographic.zip",
                    "sqlType": ESqlDataType.string
                  },
                  {
                    "columnName": "HbA1cGTE6_5",
                    "pathExpression": "HbA1cGTE6_5",
                    "sqlType": ESqlDataType.integer
                  }
                ]
              },
              "disabled": false,
              "description": "myfirstexport"
            }
          ]
        }
      ]
    });
  }
}

