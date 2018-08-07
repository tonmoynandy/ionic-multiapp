import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the TempchangePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'tempchange',
})
export class TempchangePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, exponent: string): any {
    var temperature = value;
    switch(exponent){
        case "c":
            temperature = (temperature - 273.15);
            break;
        case "f":
            temperature = (temperature - 273.15); // c temp
            temperature = (temperature * 9/5)+32;
            break;
    }
    return temperature.toFixed(0);
  }
}
