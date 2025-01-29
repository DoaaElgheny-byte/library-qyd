import { CustomerType } from 'src/app/services/enums/contractStatus.enum';
import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  email: string;
  emailVerified: boolean;
  id: number;
  isAuthenticated: boolean;
  name: string;
  phoneNumber: number;
  phoneNumberVerified: boolean;
  roles: any = [];
  surName: string;
  tenantId: number;
  userName: string;
  pic: string;
  customerType: CustomerType | null;
  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.userName = user.userName || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
    this.roles = user.roles || [];
    this.phoneNumber = user.phoneNumber || 0;

  }
}
