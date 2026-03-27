import { Component, input, output } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { DatePipe, NgClass } from '@angular/common';
import { ActiveStateColorPipe } from "../../../shared/pipes/active-state-color.pipe";
import { ActiveTextEntityPipe } from "../../../shared/pipes/active-text-entity.pipe";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'users-table',
  templateUrl: './users-table.component.html',
  styleUrls: ['./users-table.component.css'],
  imports: [NgClass, ActiveStateColorPipe, ActiveTextEntityPipe,DatePipe,RouterLink]
})
export class UsersTableComponent {

  users = input.required<User[] | undefined>();
  onDelete = output<User>()

  eliminar(user: User) {
    this.onDelete.emit(user);
  }
}
