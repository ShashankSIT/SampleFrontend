import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNumebersOnly]',
  standalone: true,
})
export class NumebersOnlyDirective {
  constructor(private el: ElementRef) {}

  // Handle keydown events to prevent invalid characters in the input field
  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const allowedKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
      'Home',
      'End',
      'Control', // Allow Control for Copy-Paste
      'v', // Allow 'v' for Paste (Ctrl + V)
      'c', // Allow 'c' for Copy (Ctrl + C)
      'a', // Allow 'a' for Select All (Ctrl + A)
    ];

    const numberKeys = /^[0-9]$/; // Allow only numbers

    // Allow numbers, control keys, and combination of Ctrl + C, Ctrl + V, Ctrl + A
    if (
      allowedKeys.indexOf(event.key) === -1 && // If it's not a special key
      !numberKeys.test(event.key) && // If it's not a number key
      !(
        event.ctrlKey &&
        (event.key === 'v' || event.key === 'c' || event.key === 'a')
      ) // Allow Ctrl+V, Ctrl+C, Ctrl+A
    ) {
      event.preventDefault();
    }
  }

  // Handle paste events to allow only numeric values
  @HostListener('input', ['$event']) onPaste(event: ClipboardEvent) {
    const clipboardData = event.clipboardData?.getData('text') || '';
    const nonNumeric = /[^0-9]/g; // Non-numeric characters

    // If pasted content contains non-numeric characters, prevent the action
    if (nonNumeric.test(clipboardData)) {
      event.preventDefault();
    }
  }

  // // Prevent drag-and-drop of non-numeric content
  // @HostListener('drop', ['$event']) onDrop(event: DragEvent) {
  //   const textData = event.dataTransfer?.getData('text') || '';
  //   const nonNumeric = /[^0-9]/g; // Non-numeric characters

  //   // If dragged content contains non-numeric characters, prevent the drop
  //   if (nonNumeric.test(textData)) {
  //     event.preventDefault();
  //   }
  // }

  // // Prevent dragover events (highlighting) to avoid the drop of invalid data
  // @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
  //   event.preventDefault(); // Prevent the default behavior of dragover
  // }
}
