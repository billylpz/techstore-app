import { Component, input } from '@angular/core';

@Component({
  selector: 'no-results-message',
  templateUrl: './no-results-message.component.html',
  styleUrls: ['./no-results-message.component.css']
})
export class NoResultsMessageComponent {
  search = input.required<string | undefined>();

}
