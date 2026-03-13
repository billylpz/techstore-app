import { Component, computed, input, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'paginator',
  templateUrl: './paginator.component.html',
  styleUrls: ['./paginator.component.css'],
  imports: [RouterLink]
})
export class PaginatorComponent {

totalPages= input.required<number | undefined>();
currentPage= input.required<number | undefined>();
 
}
