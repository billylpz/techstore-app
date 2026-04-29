import { Component, input, output } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";

@Component({
  selector: 'users-table-mobile',
  templateUrl: './users-table-mobile.component.html',
  styleUrls: ['./users-table-mobile.component.css'],
  imports: [DatePipe, RouterLink, NgClass, ActiveStateColorPipe]
})
export class UsersTableMobileComponent {

 users = input.required<User[] | undefined>();
   onDelete = output<User>()
 
   eliminar(user: User) {
     this.onDelete.emit(user);
   }
}
