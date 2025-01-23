import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'indianCurrencyFormat'
})
export class IndianCurrencyFormatPipe implements PipeTransform {


  transform(value: number): string {
    if (value === null || value === undefined) {
      return '';
    }

    // Ensure the number has two decimal places
    let val = value.toFixed(2);
    let x = val.split('.'); // Split the number into whole and decimal part
    let y = x[0]; // Whole number part
    let z = x[1]; // Decimal part

    // Step 1: Check if the whole number part is less than 1000, if so, no comma is needed
    if (y.length <= 3) {
      return '₹' + y + '.' + z;
    }

    // Step 2: Format the first part of the number (thousands, lakhs, crores)
    let firstGroup = y.slice(0, y.length - 3);
    let lastThreeDigits = y.slice(y.length - 3);

    // Step 3: Add commas to the first part (for grouping lakhs and crores)
    let rgx = /(\d+)(\d{2})/;
    while (rgx.test(firstGroup)) {
      firstGroup = firstGroup.replace(rgx, '$1' + ',' + '$2');
    }

    // Combine the first part and the last 3 digits
    y = firstGroup + ',' + lastThreeDigits;

    // Return the formatted string with ₹ symbol and decimal places
    return '₹' + y + '.' + z;
  }
}
