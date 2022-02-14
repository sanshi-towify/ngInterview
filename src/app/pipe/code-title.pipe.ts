import { Pipe, PipeTransform } from '@angular/core';

export const capAll = (str: string) => {
  let cc, it, res;
  res = (function () {
    let i, ref, results;
    results = [];
    for (it = i = 1, ref = str.length; 1 <= ref ? i <= ref : i >= ref; it = 1 <= ref ? ++i : --i) {
      cc = str.charAt(it);
      if ('A' <= cc && cc <= 'Z') {
        results.push(' ' + cc);
      } else {
        results.push(cc);
      }
    }
    return results;
  })();
  return str.charAt(0).toUpperCase() + res.join('');
};

@Pipe({
  name: 'codeTitle'
})
export class CodeTitlePipe implements PipeTransform {
  transform(value: string, ...args: unknown[]): unknown {
    return capAll(value);
  }
}
