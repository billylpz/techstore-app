import { Component, input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { FormUtils } from '../../utils/form-utils';

@Component({
  selector: 'form-error-label',
  templateUrl: './form-error-label.component.html',
  styleUrls: ['./form-error-label.component.css']
})
export class FormErrorLabelComponent  {
  control= input.required<AbstractControl>();

  get errorMessage(){
    return FormUtils.getTextError(this.control());
  }

}
