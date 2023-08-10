import { Pipe, PipeTransform } from '@angular/core';
import {map} from "rxjs";

@Pipe({
  name: 'ExtractArrayValue'
})
export class ExtractArrayValuePipe implements PipeTransform {

  transform(value: any, args: string): any {
    let total: number = 0;
    if (args ==='number'){
      let numberArray: number[] = [];
      for (let i = 0; i < value; i++){
        numberArray.push(i);
      }
      return numberArray;
    }
    else if(args ==='total'){
      value.map(
        invoice => {
          total+= invoice.total;
        }
      )
      return total.toFixed(2);
    }
    else{
      return 0;
    }
  }

}
