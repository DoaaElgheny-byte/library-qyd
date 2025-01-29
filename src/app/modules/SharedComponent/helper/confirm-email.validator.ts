import { AbstractControl } from '@angular/forms';

export class ConfirmEmailValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static MatchemailConfirm(control: AbstractControl): void {
    const email = control.get('email')?.value;
    const confirmEmail = control.get('emailConfirm')?.value;

    if (email !== confirmEmail) {
      control.get('emailConfirm')?.setErrors({ emailConfirm: true });
    }
  }
}
