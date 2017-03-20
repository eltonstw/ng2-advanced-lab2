import {
  Component,
  OnChanges,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  OnInit,
  OnDestroy,
  LOCALE_ID,
  Inject
} from '@angular/core';
import {
  CalendarEvent,
  WeekDay,
  MonthView,
  getWeekViewHeader,
  getMonthView,
  MonthViewDay
} from 'calendar-utils';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { isSameDay, setDate, setMonth, setYear, getDate, getMonth, getYear, differenceInSeconds, addSeconds } from 'date-fns'


/**
 * Shows all events on a given month. Example usage:
 *
 * ```
 * &lt;mwl-calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events"&gt;
 * &lt;/mwl-calendar-month-view&gt;
 * ```
 */
@Component({
  selector: 'mwl-calendar-month-view',
  styleUrls: ['./angular-calendar.scss'],
  template: `    
    <div class="cal-month-view">
      <div class="cal-cell-row cal-header">
        <div
          class="cal-cell"
          *ngFor="let header of columnHeaders"
          [class.cal-past]="header.isPast"
          [class.cal-today]="header.isToday"
          [class.cal-future]="header.isFuture"
          [class.cal-weekend]="header.isWeekend">
          {{ header.date | en }}
        </div>
      </div>
      <div class="cal-days">
        <div *ngFor="let rowIndex of view.rowOffsets">
          <div class="cal-cell-row">
            <mwl-calendar-month-cell
              *ngFor="let day of view.days | slice : rowIndex : rowIndex + (view.totalDaysVisibleInWeek)"
              [class.cal-drag-over]="day.dragOver"
              [day]="day"
              [openDay]="openDay"
              [locale]="locale"
              (click)="dayClicked.emit({day: day})"
              (eventClicked)="eventClicked.emit({event: $event.event})"
              (count)="count.emit(+$event)">

                <event #evt [day]="day"></event>
                <label>{{ day.date.getDate() }}</label>

            </mwl-calendar-month-cell>
          </div>
        </div>
      </div>
    </div>
    
    <ng-content select="h1"></ng-content>
    <ng-content select="h3"></ng-content>
  `
})
export class CalendarMonthViewComponent implements OnChanges, OnInit, OnDestroy {
 
  /**
   * The current view date
   */
  @Input() viewDate: Date;

  /**
   * An array of events to display on view
   */
  @Input() events: CalendarEvent[] = [];

  /**
   * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
   */
  @Input() excludeDays: number[] = [];

  /**
   * Whether the events list for the day of the `viewDate` option is visible or not
   */
  @Input() activeDayIsOpen: boolean = false;

  /**
   * A function that will be called before each cell is rendered. The first argument will contain the calendar cell.
   * If you add the `cssClass` property to the cell it will add that class to the cell in the template
   */
  @Input() dayModifier: Function;

  /**
   * An observable that when emitted on will re-render the current view
   */
  @Input() refresh: Subject<any>;

  /**
   * The locale used to format dates
   */
  @Input() locale: string;

  /**
   * The placement of the event tooltip
   */
  @Input() tooltipPlacement: string = 'top';

  /**
   * The start number of the week
   */
  @Input() weekStartsOn: number;

  /**
   * Called when the day cell is clicked
   */
  @Output() dayClicked: EventEmitter<{day: MonthViewDay}> = new EventEmitter<{day: MonthViewDay}>();

  /**
   * Called when the event title is clicked
   */
  @Output() eventClicked: EventEmitter<{event: CalendarEvent}> = new EventEmitter<{event: CalendarEvent}>();

  @Output() count: EventEmitter<number> = new EventEmitter<number>();

  /**
   * @hidden
   */
  columnHeaders: WeekDay[];  

  /**
   * @hidden
   */
  view: MonthView;

  /**
   * @hidden
   */
  openRowIndex: number;

  /**
   * @hidden
   */
  openDay: MonthViewDay;

  /**
   * @hidden
   */
  refreshSubscription: Subscription;

  /**
   * @hidden
   */
  constructor(private cdr: ChangeDetectorRef, @Inject(LOCALE_ID) locale: string) {
    this.locale = locale;
  }

  /**
   * @hidden
   */
  ngOnInit(): void {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }

  /**
   * @hidden
   */
  ngOnChanges(changes: any): void {

    if (changes.viewDate || changes.excludeDays) {
      this.refreshHeader();
    }

    if (changes.viewDate || changes.events || changes.excludeDays) {
      this.refreshBody();
    }

    if (changes.activeDayIsOpen || changes.viewDate || changes.events || changes.excludeDays) {
      this.checkActiveDayIsOpen();
    }
  }

  /**
   * @hidden
   */
  ngOnDestroy(): void {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  /**
   * @hidden
   */
  toggleDayHighlight(event: CalendarEvent, isHighlighted: boolean): void {
    this.view.days.forEach(day => {
      if (isHighlighted && day.events.indexOf(event) > -1) {
        day.backgroundColor = event.color.secondary;
      } else {
        delete day.backgroundColor;
      }
    });
  }

  private refreshHeader(): void {
    this.columnHeaders = getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays
    });
  }

  private refreshBody(): void {
    this.view = getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays
    });
    if (this.dayModifier) {
      this.view.days.forEach(day => this.dayModifier(day));
    }
  }

  private checkActiveDayIsOpen(): void {
    if (this.activeDayIsOpen === true) {
      this.openDay = this.view.days.find(day => isSameDay(day.date, this.viewDate));
      const index: number = this.view.days.indexOf(this.openDay);
      this.openRowIndex = Math.floor(index / this.view.totalDaysVisibleInWeek) * this.view.totalDaysVisibleInWeek;
    } else {
      this.openRowIndex = null;
      this.openDay = null;
    }
  }

  private refreshAll(): void {
    this.refreshHeader();
    this.refreshBody();
    this.checkActiveDayIsOpen();
  }

}
