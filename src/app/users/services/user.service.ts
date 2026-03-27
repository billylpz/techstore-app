import { Injectable } from '@angular/core';
import { CommonService } from '../../shared/services/common.service';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService extends CommonService<User> {

  constructor() {
    super("/api/users")
  }

}
