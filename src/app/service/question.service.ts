import { Injectable } from '@angular/core';

import {
  android,
  architecture,
  git,
  ios,
  logic,
  patterns,
  performance,
  product,
  teamwork,
  web
} from './questions';
import { PageService } from './page.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  constructor(public pageService: PageService) {}

  result: any = null;

  addQuestionsToPage(type: string) {
    let items;
    switch (type) {
      case 'Server':
        items = [patterns, git, performance, architecture, teamwork, logic];
        break;
      case 'Web':
        items = [patterns, web, teamwork, logic];
        break;
      case 'IOS':
        items = [patterns, ios, teamwork, logic];
        break;
      case 'Android':
        items = [patterns, android, teamwork, logic];
        break;
      default:
        items = [product, performance, logic];
    }
    this.pageService.addQuestionToPage(items);
  }

  setResult(result: any) {
    this.result = result;
  }

  reset() {
    this.result = null;
  }
}
