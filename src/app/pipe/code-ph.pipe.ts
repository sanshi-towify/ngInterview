import {Pipe, PipeTransform} from '@angular/core';
import {capAll} from './code-title.pipe';

@Pipe({
  name: 'codePh'
})
export class CodePhPipe implements PipeTransform {
  transform(code: string): string {
    return 'please enter your ' + capAll(code);
  }
}
