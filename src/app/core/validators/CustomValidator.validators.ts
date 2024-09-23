import { AbstractControl , FormControl } from '@angular/forms';

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


  static minLengthValidator(minLength : number){
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value?.toString() || '';
      return value.length < minLength
        ? {
            minlength: {
              requiredLength: minLength,
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

  static onlyAlphabetAllowed(control: AbstractControl){
    const value = control.value || '';
    const alphabetRegex = /^[a-zA-Z]+$/; // Regex to match only alphabetic characters
    if (!alphabetRegex.test(value)) {
      return { onlyAlphabetAllowed: true }; // Return error object if validation fails
    }
    return null; // Return null if validation passes
  }
  static noSpaceAllowed(Control: FormControl) {
    if (Control.value != null && Control.value.trim() == '') {
      return { noSpaceAllowed: true };
    }
    return null;
  }

}
