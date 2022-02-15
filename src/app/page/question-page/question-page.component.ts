import {Component, OnInit} from '@angular/core';
import {QuestionService} from '../../service/question.service';
import {PageService} from '../../service/page.service';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Page, QuestionSession} from '../../service/type';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.sass']
})
export class QuestionPageComponent implements OnInit {
  questionSession: Array<QuestionSession> = [];
  pageForm: any = {};
  result: any = {};
  page: Page | null = null;
  curItemIdx = 0;
  curSessionIdx = 0;

  constructor(
    private router: Router,
    public pageService: PageService,
    public questionService: QuestionService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    this.getQuestionPage(0);
  }

  setProp(prop: any) {
    if (!prop.valid) {
      prop.valid = [];
    }
    if (!prop.optional) {
      prop.valid.push(Validators.required);
    }
    return [this.result[prop.code] || prop.value || '', prop.valid];
  }

  getQuestionPage(num: number): void {
    this.page = this.pageService.getNextPage(num);
    this.questionSession = this.page.questions;
    const props: any = {};
    if (this.page.type === 'list') {
      this.questionSession.forEach(it => {
        if (it.items) {
          it.items.forEach(f => {
            props[f.code] = this.setProp(f);
          });
        }
      });
    } else {
      this.curItemIdx = 0;
      this.curSessionIdx = 0;
      const item = this.questionSession[this.curSessionIdx].items[this.curItemIdx];
      props[item.code] = this.setProp(item);
    }
    this.pageForm = this.fb.group(props);
  }

  hasPrev(): boolean {
    return this.pageService.hasPage(-1);
  }

  get isHasNextPage(): boolean {
    return this.pageService.hasPage(1);
  }

  finish(): void {
    if (this.pageForm.valid) {
      Object.assign(this.result, this.pageForm.getRawValue());
      this.questionService.setResult(this.result);
      this.router.navigate(['/result']).then(() => {
      });
    }
  }

  isDone(): boolean {
    return this.pageService.isDone;
  }

  nextItem(): void {
    let curSession = this.questionSession[this.curSessionIdx];
    if (this.pageForm.valid) {
      if (this.curItemIdx + 1 >= curSession.items.length) {
        if (this.curSessionIdx + 1 >= this.questionSession.length) {
          Object.assign(this.result, this.pageForm.getRawValue());
          this.getQuestionPage(1);
        } else {
          this.curSessionIdx++;
          this.curItemIdx = 0;
          curSession = this.questionSession[this.curSessionIdx];
          const item = curSession.items[this.curItemIdx];
          this.pageForm.addControl(item.code, new FormControl(...this.setProp(item)));
          setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight)
          }, 0)
        }
      } else {
        this.curItemIdx++;
        const item = curSession.items[this.curItemIdx];
        this.pageForm.addControl(item.code, new FormControl(...this.setProp(item)));
        setTimeout(() => {
          window.scrollTo(0, document.body.scrollHeight)
        }, 0)
      }
    }
  }

  nextPage(): void {
    if (this.pageForm.valid) {
      Object.assign(this.result, this.pageForm.getRawValue());
      if (this.pageService.curIndex === 0 && this.result.jobPosition) {
        this.questionService.addQuestionsToPage(this.result.jobPosition);
      }
      this.getQuestionPage(1);
    } else {
      this.snackBar.open('Please finish all questions', 'Attention', {duration: 1000});
    }
  }

  prevPage(): void {
    this.getQuestionPage(-1);
  }
}
