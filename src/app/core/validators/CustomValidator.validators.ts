import { AbstractControl } from '@angular/forms';

export class CustomValidator {
  static maxLengthValidator(maxLength: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value?.toString() || '';
      return value.length > maxLength
        ? {
            maxlength: {
              requiredLength: maxLength,
              actualLength: value.length,
            },
          }
        : null;
    };
  }

  static futureDateValidator() {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const today = new Date();
      const selectedDate = new Date(control.value);

      // Clear the time part of the date to compare only the date portion
      today.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      // Check if selected date is greater than today's date
      return selectedDate > today ? { futureDate: true } : null;
    };
  }
}
