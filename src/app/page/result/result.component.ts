import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../../service/question.service';
import { Router } from '@angular/router';
import {Page, Question} from '../../service/type';
import {PageService} from '../../service/page.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit {
  result: any = {};
  questions: any = [];
  pages: Array<Page> = [];

  constructor(private router: Router, private questionService: QuestionService, private pageService: PageService) {}

  ngOnInit(): void {
    this.result = this.questionService.result;
    this.pages = this.pageService.questionPages;
  }

  showAnswer(q: Question, isSub?: string): string {
    let code = q.code;
    if (isSub) {
      code = isSub + '-' + code;
    }
    const v = this.result[code];
    if (v && q.data && q.data[0] && q.data[0].k) {
      return v + '：' + q.data[+v - 1].v;
    } else {
      return v;
    }
  }

  resetPage(): void {
    this.pageService.reset();
    this.questionService.reset();
    this.router.navigate(['/']).then();
  }
}
