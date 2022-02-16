import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OptionItemType, PageType, QuestionType } from '../../service/type';
import { PageService } from '../../service/page.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.sass']
})
export class ResultComponent implements OnInit {
  questionResult: Record<string, string> = {};
  pages: PageType[] = [];

  constructor(private readonly router: Router, private readonly pageService: PageService) {}

  ngOnInit(): void {
    this.pages = this.pageService.questionPages;
    this.questionResult = this.pageService.questionResult;
  }

  showAnswer(question: QuestionType, isSub?: string): string {
    let code = question.code;
    if (isSub) {
      code = isSub + '-' + code;
    }
    const v = this.questionResult[code];
    if (v && !question.data) {
      return v;
    }
    if (v && question.data) {
      if (typeof question.data[0] === 'string') {
        return v;
      } else {
        const index = parseInt(v) - 1;
        return `${v}: ${(<OptionItemType>question.data[index]).val}`;
      }
    } else {
      return v;
    }
  }

  resetPage(): void {
    this.pageService.reset();
    this.router.navigate(['/']).then();
  }
}
