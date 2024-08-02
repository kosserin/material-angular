import { AbstractControl, ValidatorFn } from '@angular/forms';

export function futureDateValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    // If the value is empty, consider it valid
    if (!value) {
      return null;
    }

    // Parse the input date
    const inputDate = new Date(value);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight to compare only dates

    // Check if input date is a valid date and is in the future
    if (isNaN(inputDate.getTime()) || inputDate <= today) {
      return { futureDate: true };
    }

    return null; // No error
  };
}
