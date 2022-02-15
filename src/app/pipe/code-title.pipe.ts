import {Pipe, PipeTransform} from '@angular/core';
import {capAll} from '../util';

@Pipe({
  name: 'codeTitle'
})
export class CodeTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return capAll(value);
  }
}
