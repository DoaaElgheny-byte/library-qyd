import { AbstractControl } from '@angular/forms';

export class AgentRepresentativeConfirmEmailValidator {
  /**
   * Check matching password with confirm password
   * @param control AbstractControl
   */
  static agentRepresentativeConfirmEmail(control: AbstractControl): void {
    const agentRepresentativeEmail = control.get('agentRepresentativeEmail')?.value;
    const agentRepresentativeConfirmEmail = control.get('agentRepresentativeConfirmEmail')?.value;

    if (agentRepresentativeEmail !== agentRepresentativeConfirmEmail) {
      control.get('agentRepresentativeConfirmEmail')?.setErrors({ ConfirmAgentEmail: true });
    }
  }
}
