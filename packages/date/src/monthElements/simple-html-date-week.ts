import { customElement, property } from '@simple-html/core';
import { html } from 'lit-html';
import { IDateConfig } from '../interfaces';

@customElement('simple-html-date-week')
export default class extends HTMLElement {
    monthBlock: number;
    config: IDateConfig;
    @property() month: number;
    @property() year: number;

    getIsoWeek(date: Date) {
        /*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.epoch-calendar.com */

        const dowOffset = this.config.weekStart;
        const newYear = new Date(date.getFullYear(), 0, 1);
        let day = newYear.getDay() - dowOffset; //the day of week the year begins on
        day = day >= 0 ? day : day + 7;
        const daynum =
            Math.floor(
                (date.getTime() -
                    newYear.getTime() -
                    (date.getTimezoneOffset() - newYear.getTimezoneOffset()) * 60000) /
                    86400000
            ) + 1;
        let weeknum;
        //if the year starts before the middle of a week
        if (day < 4) {
            weeknum = Math.floor((daynum + day - 1) / 7) + 1;
            if (weeknum > 52) {
                const nYear = new Date(date.getFullYear() + 1, 0, 1);
                let nday = nYear.getDay() - dowOffset;
                nday = nday >= 0 ? nday : nday + 7;
                /*if the next year starts before the middle of
                       the week, it is week #1 of that year*/
                weeknum = nday < 4 ? 1 : 53;
            }
        } else {
            weeknum = Math.floor((daynum + day - 1) / 7);
        }
        return weeknum;
    }

    render() {
        return html`${this.monthBlock}`;
    }
}
