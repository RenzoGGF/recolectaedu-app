import { Validators } from '@angular/forms';


export const topicTitleValidators = [
  Validators.required,
  Validators.minLength(10)
];

export const topicContentValidators = [
  Validators.required,
  Validators.minLength(20)
];
