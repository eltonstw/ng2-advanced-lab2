import { Pipe, PipeTransform, Inject } from '@angular/core';

const HeaderText = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

@Pipe({ name: 'en' })
export class EnPipe implements PipeTransform {
  transform(date: Date): string { return HeaderText[date.getDay()]; }
}