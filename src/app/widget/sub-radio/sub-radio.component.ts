import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

const accessorProvider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SubRadioComponent),
  multi: true
};

@Component({
  selector: 'app-sub-radio',
  templateUrl: './sub-radio.component.html',
  providers: [accessorProvider],
  styleUrls: ['./sub-radio.component.sass']
})
export class SubRadioComponent implements OnInit, ControlValueAccessor {
  isDisabled = false;
  value: string = '';
  @Input() option: any = {};
  @Input() form: any = {};

  ngOnInit(): void {}

  get isShowSubItems(): boolean {
    return this.option.subItems && +this.form.value[this.option.code] > 2;
  }

  setSubValue(val: string, code: string): void {
    const name = this.option.code + '-' + code;
    this.form.get(name).setValue(val);
  }

  resetSubItems(): void {
    if (this.option.subItems) {
      if (this.isShowSubItems) {
        this.option.subItems.forEach((f: any) => {
          const name = this.option.code + '-' + f.code;
          this.form.addControl(name, new FormControl('', [Validators.required]));
        });
      } else {
        this.option.subItems.forEach((f: any) => {
          const name = this.option.code + '-' + f.code;
          this.form.removeControl(name);
        });
      }
    }
  }

  onChange = (value: string) => {
    this.writeValue(value);
  };

  onTouch: any = () => {};

  writeValue(obj: any): void {
    this.value = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
}
