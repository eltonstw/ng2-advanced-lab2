import { Component, EventEmitter, Input, OnInit, Output, style } from '@angular/core';
import { MonthViewDay, CalendarEvent } from 'calendar-utils';

const icons = ["../../assets/i.png", "../../assets/ii.png"];

@Component({
    selector: 'event',
    template: `
    <div *ngIf="icon" class="cal-cell-top">
        <img [src]="icon" style="height:25px"/>
    </div>
  `
})
export class EventComponent implements OnInit {

    @Input() day: MonthViewDay;

    get count(): number { return this.icon ? 1 : 0; }

    icon?: string;
    idx?: number;
    ngOnInit() {
        if (this.day.date.getDate() % 4 === 0 || this.day.date.getDate() % 6 === 0) {
            this.idx = Math.floor(Math.random() * 4);
            if (this.idx < 2) { this.icon = icons[this.idx]; }
        }
    }
}