import { Injectable } from '@angular/core';
import { Observable, interval } from 'rxjs';
import * as moment from 'moment';
import { startWith, map, takeWhile } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class CountDownService {

  countDown(timeInSeconds: number): Observable<number> {
    const beginningTime = new Date();

    return interval(1000).pipe(
      startWith(0),
      map(res => {
        const timeDiff = moment().diff(moment(beginningTime), 'seconds');
        return timeInSeconds - timeDiff;
      }),
      takeWhile(timeLeft => timeLeft >= 0),
      map(timeLeft => {
        return timeLeft;
      }),
    );
  }

  remain(timeInSeconds: number,
         format: 'human' | 'digital' = 'digital',
         showAtLeast?: 'seconds' | 'minutes' | 'hours' | 'days'): Observable<string> {

    const beginningTime = new Date();

    return interval(1000).pipe(
      startWith(0),
      map(res => {
        const timeDiff = moment().diff(moment(beginningTime), 'seconds');
        return timeInSeconds - timeDiff;
      }),
      takeWhile(timeLeft => timeLeft >= 0),
      map(timeLeft => {
        const days: any = Math.floor(timeLeft / 86400);
        const hours: any = Math.floor((timeLeft % 86400) / 3600);
        const minutes: any = Math.floor(((timeLeft % 86400) % 3600) / 60);
        const seconds: any = ((timeLeft % 86400) % 3600) % 60;

        return this.formatText(days, hours, minutes, seconds, format, showAtLeast);
      }),
    );
  }

  until(endTimestamp: number): Observable<string> {
    const time = moment(endTimestamp).diff(moment(), 'seconds');
    return this.remain(time);
  }

  private formatText(days, hours, minutes, seconds, format, showAtLeast) {
    // reset
    if (days < 0) { days = 0; }
    if (hours < 0) { hours = 0; }
    if (minutes < 0) { minutes = 0; }
    if (seconds < 0) { seconds = 0; }

    // showAtLeast
    if (!showAtLeast) {
      if (format === 'digital') {
        showAtLeast = 'minutes';
      } else if (format === 'human') {
        showAtLeast = 'seconds';
      }
    }

    if (showAtLeast === 'seconds') {
      if (days <= 0 && hours <= 0 && minutes <= 0) { minutes = ''; }
      if (days <= 0 && hours <= 0) { hours = ''; }
      if (days <= 0) { days = ''; }
    }

    if (showAtLeast === 'minutes') {
      if (days <= 0 && hours <= 0) { hours = ''; }
      if (days <= 0) { days = ''; }
    }

    if (showAtLeast === 'hours') {
      if (days <= 0) { days = ''; }
    }

    // format
    if (format === 'digital') {
      if (seconds < 10) { seconds = '0' + seconds; }
      if (minutes !== '' && minutes < 10) { minutes = '0' + minutes; }
      if (hours !== '' && hours < 10) { hours = '0' + hours; }
      if (days !== '' && days < 10) { days = '0' + days; }

      if (minutes !== '') { minutes = minutes + ':'; }
      if (hours !== '') { hours = hours + ':'; }
      if (days !== '') { days = days + ':'; }
      return `${days}${hours}${minutes}${seconds}`;
    }

    if (format === 'human') {
      seconds = seconds + 's';
      if (minutes !== '') { minutes = minutes + 'm : '; }
      if (hours !== '') { hours = hours + 'h : '; }
      if (days !== '') { days = days + 'd : '; }
      return `${days}${hours}${minutes}${seconds}`;
    }

    return 'unknown format';
  }

}
