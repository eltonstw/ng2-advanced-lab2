import { EventComponent } from './event.component';
import { EnPipe } from './en.pipe';
import { CalendarMonthViewComponent } from './calendarMonthView.component';
import { CalendarMonthCellComponent } from './calendarMonthCell.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CalendarMonthCellComponent,
    CalendarMonthViewComponent,
    EventComponent,
    EnPipe
  ],
  exports:[
    CalendarMonthCellComponent,
    CalendarMonthViewComponent,
    EventComponent
  ]
})
export class CanlendarModule { }
