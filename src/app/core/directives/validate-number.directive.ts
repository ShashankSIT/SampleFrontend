import { Directive , HostListener } from '@angular/core';

@Directive({
  selector: '[appValidateNumber]',
  standalone: false
})
export class ValidateNumberDirective {

  constructor() { }

  @HostListener('keypress',['$event'])
  validateNumberInput(event: KeyboardEvent): void {
    const charCode = event.which ? event.which : event.keyCode;
  
    // Allow backspace, delete, tab, and arrow keys
    if (charCode === 8 || charCode === 46 || charCode === 9 || (charCode >= 37 && charCode <= 40)) {
      return;
    }
  
    // Prevent if the input is not a number
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  @HostListener('paste',['$event'])
  onPaste(event: ClipboardEvent): void {
    const clipboardData = event.clipboardData || (window as any).clipboardData;
    const pastedText = clipboardData.getData('text');

    if (/\D/.test(pastedText)) { // Check if pasted text contains non-digit characters
      event.preventDefault();
    }
  }
  
  @HostListener('input',['$event'])
  onInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, ''); // Remove non-digit characters
  }
}
