import { Injectable } from '@angular/core';
import { Page, QuestionSession } from './type';
import { education, introduction, job, personal } from './questions';

@Injectable({
  providedIn: 'root'
})
export class PageService {
  questionPages: Array<Page> = [
    {
      type: 'list',
      ordered: true,
      questions: [job, personal, education],
      buttonTitle: 'Yeah, Let Us Go To Next Step!'
    },
    {
      type: 'pop',
      greeting: true,
      buttonTitle: 'Confirm current answer & Show next question',
      introduction:
        'Please check the following questions carefully and honestly. This is to allow us to better understand your situation before the interview, so that we can ask more critical questions about your information during the interview. Server - Knowledge and Skills Module',
      questions: []
    },
    {
      type: 'list',
      greeting: true,
      buttonTitle: 'Done',
      introduction:
        'The daily work of the program is developed in an English environment with opportunities, including document viewing, question query and naming of function attributes, so we hope you can understand your English foundation through a short self-introduction.',
      questions: [introduction]
    }
  ];

  curIndex = 0;

  getNextPage(num: number): Page {
    if (this.curIndex + num <= this.questionPages.length) {
      this.curIndex += num;
    }
    return this.questionPages[this.curIndex];
  }

  hasPage(num: number): boolean {
    if (num < 0) {
      return this.curIndex + num >= 0;
    } else {
      return this.curIndex + num < this.questionPages.length && !this.isDone;
    }
  }

  addQuestionToPage(sessions: Array<QuestionSession>) {
    this.questionPages[1].questions = sessions;
  }

  get isDone(): boolean {
    return this.curIndex === this.questionPages.length - 1;
  }

  reset() {
    this.curIndex = 0;
  }
}
