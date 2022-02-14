export interface Question {
  code: string;
  label?: string;
  inputType?: string;
  noLabel?: boolean;
  optional?: boolean;
  type: string;
  placeholder?: string;
  help?: string;
  data?: Array<any>;
  valid?: any;
  value?: any;
  checkValue?: any;
  subItems?: Array<Question>;
}

export interface QuestionSession {
  label?: string;
  items: Array<Question>;
  formProps?: any;
}

export interface Page {
  greeting?: boolean;
  ordered?: boolean;
  introduction?: string;
  type: string;
  buttonTitle?: string;
  questions: Array<QuestionSession>;
}
