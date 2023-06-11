import { Component, Input, OnInit } from '@angular/core';
import { filter } from 'rxjs';
import { FilterArgs, OperationObject } from 'src/app/types/model-file';

interface Expression {
  isValid:boolean;
  leftHand?:string;
  operator?:string;
  rightHand?:string;
}

@Component({
  selector: 'app-filter-editor',
  templateUrl: './filter-editor.component.html',
  styleUrls: ['./filter-editor.component.scss']
})
export class FilterEditorComponent implements OnInit {
  showHighLevel:  boolean = false;

  @Input() step:OperationObject;
  get filterArgs():FilterArgs {
    return this.step.arguments as FilterArgs
  }

  filterColumn: string;
  lowerBound: string;
  operator: string;
  upperBound: string;

  ngOnInit(): void {
    this.showHighLevel = this.canShowHighLevel();
  }

  canShowHighLevel():boolean {
    if (!this.filterArgs.condition) {
      return true;
    }
    if (this.isSimpleFilter()) {
      return true;
    }

    return false;
  }
  
  reassembleExpression() {
    this.filterArgs.condition = `${this.filterColumn} > ${this.lowerBound} ${this.operator} ${this.filterColumn} < ${this.upperBound}`;
  }

  private isSimpleFilter():boolean {
    //TODO: This needs to be a lot more robust.  Checking for whitespace before and/or, not equal to..  Is left statement smaller than right statement.
    const expressions = this.filterArgs.condition.split(/(.*)(or|and)(.*)/gmi).filter(x=>x);
    if (expressions.length != 3) {
      return false;
    }

    const firstExpr = this.parseExpression(expressions[0]);
    const secondExpr = this.parseExpression(expressions[2]);
    if (!firstExpr.isValid || !secondExpr.isValid) {
      return false;
    }

    if (firstExpr.leftHand != secondExpr.leftHand) {
      return false;
    }

    this.filterColumn = firstExpr.leftHand || '';
    this.lowerBound = firstExpr.rightHand || '';
    this.upperBound = secondExpr.rightHand || '';
    this.operator = expressions[1];
    
    return true;
  }

  private parseExpression(stmt:string):Expression {
    let startIdx = ((stmt.indexOf('>=')+1) || (stmt.indexOf('>')+1) || (stmt.indexOf('<')+1) || (stmt.indexOf('=')+1))-1;
    if (startIdx === -1) {
      return {isValid:false};
    }
    const leftHand = stmt.substring(0,startIdx).trim();
    
    let operator = stmt[startIdx];
    if (stmt[startIdx +1] === '=') {
      operator += '=';
      startIdx+=1;
    }

    const rightHand = stmt.substring(startIdx+1).trim();

    return {
      isValid:true,
      operator,
      rightHand,
      leftHand
    };
  }

}
