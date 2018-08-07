import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the WinddirectionPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'winddirection',
})
export class WinddirectionPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: any, ...args) {
    let deg = value;
    let side = 'N';
    if (deg > 20 && deg <= 70) {
        side = 'NE';
    } else if (deg >= 71 && deg <= 120) {
        side = 'E';
    } else if (deg >= 121 && deg <= 160) {
        side = 'SE';
    } else if (deg >= 161 && deg <= 210) {
        side = 'S';
    } else if (deg >= 211 && deg <= 255) {
        side = 'SW';
    } else if (deg >= 256 && deg <= 290) {
        side = 'W';
    } else if (deg >= 291 && deg <= 330) {
        side = 'NW';
    }
    return side;
  }
}
