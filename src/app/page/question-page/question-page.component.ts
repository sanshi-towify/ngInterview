import { Component, OnInit } from '@angular/core';
import { PageService } from '../../service/page.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageType, QuestionSessionType } from '../../service/type';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  styleUrls: ['./question-page.component.sass']
})
export class QuestionPageComponent implements OnInit {
  questionSession: QuestionSessionType[] = [];
  pageForm: FormGroup = this.formBuilder.group({});
  page: PageType = {
    type: '',
    questions: []
  };

  currentQuestionIndex = 0;
  currentSessionIndex = 0;

  constructor(
    private readonly router: Router,
    public readonly pageService: PageService,
    private readonly formBuilder: FormBuilder,
    private readonly snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getQuestionPage(0);
  }

  setFormItemProperty(prop: any) {
    if (!prop.valid) {
      prop.valid = [];
    }
    if (!prop.optional) {
      prop.valid.push(Validators.required);
    }
    return [this.questionResult[prop.code] || prop.value || '', prop.valid];
  }

  getQuestionPage(pageOffset: number): void {
    this.page = this.pageService.getNextPage(pageOffset);
    this.questionSession = this.page.questions;
    const props: any = {};
    if (this.page.type === 'list') {
      this.questionSession.forEach(it => {
        if (it.items) {
          it.items.forEach(question => {
            props[question.code] = this.setFormItemProperty(question);
          });
        }
      });
    } else {
      this.currentQuestionIndex = 0;
      this.currentSessionIndex = 0;
      const item = this.questionSession[this.currentSessionIndex].items[this.currentQuestionIndex];
      props[item.code] = this.setFormItemProperty(item);
    }
    this.pageForm = this.formBuilder.group(props);
  }

  get isHasNextPage(): boolean {
    return this.pageService.isHasPage(1);
  }

  finish(): void {
    if (this.pageForm.valid) {
      this.pageService.setQuestionResult(this.pageForm.getRawValue());
      this.router.navigate(['/result']).then(() => {});
    }
  }

  isDone(): boolean {
    return this.pageService.isDone;
  }

  addQuestionToSession(curSession: QuestionSessionType) {
    const item = curSession.items[this.currentQuestionIndex];
    this.pageForm.addControl(item.code, new FormControl(...this.setFormItemProperty(item)));
    setTimeout(() => {
      window.scrollTo(0, document.body.scrollHeight);
    }, 0);
  }

  nextItem(): void {
    let curSession = this.questionSession[this.currentSessionIndex];
    if (!this.pageForm.valid) return;
    if (this.currentQuestionIndex + 1 >= curSession.items.length) {
      if (this.currentSessionIndex + 1 >= this.questionSession.length) {
        this.pageService.setQuestionResult(this.pageForm.getRawValue());
        this.getQuestionPage(1);
      } else {
        this.currentSessionIndex += 1;
        this.currentQuestionIndex = 0;
        curSession = this.questionSession[this.currentSessionIndex];
        this.addQuestionToSession(curSession);
      }
    } else {
      this.currentQuestionIndex += 1;
      this.addQuestionToSession(curSession);
    }
  }

  get questionResult(): Record<string, string> {
    return this.pageService.questionResult;
  }

  nextPage(): void {
    if (this.pageForm.valid) {
      this.pageService.setQuestionResult(this.pageForm.getRawValue());
      this.pageService.addQuestionsToPage(this.questionResult['jobPosition']);
      this.getQuestionPage(1);
    } else {
      this.snackBar.open('Please finish all questions', 'Attention', { duration: 1000 });
    }
  }
}
