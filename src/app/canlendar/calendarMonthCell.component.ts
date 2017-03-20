import { EventComponent } from './event.component';
import { AfterContentInit, Component, ContentChild, EventEmitter, Input, OnInit, Output, style } from '@angular/core';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';

@Component({
  selector: 'mwl-calendar-month-cell',
  styleUrls: ['./angular-calendar.scss'],
  template: `
    <div class="cal-cell-top" style="text-align:right; padding: 10px">
      <span class="cal-day-number">

        <ng-content select="label"></ng-content>

      </span>
    </div>
    <div class="cal-events">
      <div
        class="cal-event" style="padding:5px"       
        (click)="$event.stopPropagation(); eventClicked.emit({event: event})">        
          
          <ng-content select="event"></ng-content>

      </div>
    </div>
  `,
  host: {
    '[class]': '"cal-cell cal-day-cell " + day?.cssClass',
    '[class.cal-past]': 'day.isPast',
    '[class.cal-today]': 'day.isToday',
    '[class.cal-future]': 'day.isFuture',
    '[class.cal-weekend]': 'day.isWeekend',
    '[class.cal-in-month]': 'day.inMonth',
    '[class.cal-out-month]': '!day.inMonth',
    '[class.cal-has-events]': 'day.events.length > 0',
    '[class.cal-open]': 'day === openDay',
    '[style.backgroundColor]': 'day.backgroundColor'
  }
})
export class CalendarMonthCellComponent implements AfterContentInit {

  @Input() day: MonthViewDay;

  @Input() openDay: MonthViewDay;

  @Input() locale: string;

  @Output() eventClicked: EventEmitter<{ event: CalendarEvent }> = new EventEmitter<{ event: CalendarEvent }>();

  @Output() count: EventEmitter<number> = new EventEmitter<number>();

  @ContentChild('evt') evt: EventComponent;

  ngAfterContentInit() { this.count.emit(this.evt.count); }
}