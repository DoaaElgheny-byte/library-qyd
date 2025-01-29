export class ChangePassword {
  id: number;
  currentPassword: string;
  newPassword: string;
  setPassword(changePassword: ChangePassword) {
    this.id = changePassword.id;
    this.currentPassword = changePassword.currentPassword;
    this.newPassword = changePassword.newPassword;
  }
}
