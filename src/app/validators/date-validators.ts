// src/app/validators/date-validators.ts
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function noFutureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const selectedDate = control.value ? new Date(control.value) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time portion

    return selectedDate && selectedDate > today
      ? { futureDate: true } // Return an error object if the date is in the future
      : null; // Return null if the validation passes
  };
}
