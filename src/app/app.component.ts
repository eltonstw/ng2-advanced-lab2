import { Component, ChangeDetectionStrategy, ViewEncapsulation } from '@angular/core';
import { CalendarEvent, MonthViewDay} from 'calendar-utils';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  // don't do this in your app, its only so the styles get applied globally
  styles: [`
    .cal-day-selected, 
    .cal-day-selected:hover {
      background-color: deeppink !important;
    }
  `],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  title = 'ng-content-lab works!';

  viewDate: Date = new Date();

  selectedDay: MonthViewDay;

  events: CalendarEvent[] = [];

  dayClicked(day: MonthViewDay): void {
    if (this.selectedDay) {
      delete this.selectedDay.cssClass;
    }
    day.cssClass = 'cal-day-selected';
    this.selectedDay = day;
  } 

  amount = 0;
  eventCount(cnt: number): void{    
    setTimeout(()=> this.amount += cnt, 10);
  }
}
