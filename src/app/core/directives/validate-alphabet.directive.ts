import { Directive ,HostListener } from '@angular/core';
import { AbstractControl, ValidationErrors, Validator } from '@angular/forms';
@Directive({
  selector: '[appValidateAlphabet]',
  standalone: false
})
export class ValidateAlphabetDirective {

  constructor() { }

  @HostListener('keypress',['$event'])
  @HostListener('input',['$event'])
  validate(event: KeyboardEvent) {
    const regex = /^[a-zA-Z]*$/; // Regex to match only alphabetic characters
    if (!regex.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault(); // Prevent default action if key is not alphabetic
    }
  }

  @HostListener('paste',['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');
    const regex = /^[a-zA-Z]*$/;

    if (!regex.test(pastedText)) { // Check if pasted text contains non-digit characters
      event.preventDefault();
    }
  }
}
