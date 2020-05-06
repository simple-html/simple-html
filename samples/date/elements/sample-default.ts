import { customElement } from '@simple-html/core';
import { html } from 'lit-html';
import { IDateConfig } from '@simple-html/date/src/interfaces';

@customElement('sample-default')
export default class extends HTMLElement {
    dateconfig: IDateConfig = {
        monthsToShow: 12,
        monthColumns: 3,
        startMonth: 0, //0-11
        startYear: 2020,
        showWeek: false, // not working
        isoWeek: true, // not working
        weekHeader: ['Sun', 'Mon', 'Tue', 'Wen', 'Thr', 'Fri', 'Sat'], // must be in js order, widget reorder them if you have other start day
        monthHeader: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        weekStart: 1,
        rowHeight: '25px',
        monthWidth: '280px',
        monthMargin: '10px'
    };

    render() {
        this.style.display = 'flex';
        return html`<!-- x -->
            <div class="flex flex-col">
                <button
                    class="p-2 m-2 bg-gray-200"
                    @click=${() => {
                        if (this.dateconfig.startMonth === 0) {
                            this.dateconfig.startMonth = 11;
                            this.dateconfig.startYear--;
                        } else {
                            this.dateconfig.startMonth--;
                        }
                        this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                        this.render();
                    }}
                >
                    prev
                </button>

                <label class="p-2 m-2 bg-gray-200"
                    >monthsToShow:
                    <input
                        type="number"
                        .valueAsNumber=${this.dateconfig.monthsToShow}
                        @input=${(e: any) => {
                            this.dateconfig.monthsToShow = e.target.valueAsNumber;

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <label class="p-2 m-2 bg-gray-200"
                    >columns:
                    <input
                        type="number"
                        .valueAsNumber=${this.dateconfig.monthColumns}
                        @input=${(e: any) => {
                            this.dateconfig.monthColumns = e.target.valueAsNumber;

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <label class="p-2 m-2 bg-gray-200"
                    >weekStart:
                    <input
                        type="number"
                        min="0"
                        max="6"
                        .valueAsNumber=${this.dateconfig.weekStart}
                        @input=${(e: any) => {
                            this.dateconfig.weekStart = e.target.valueAsNumber;

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <label class="p-2 m-2 bg-gray-200"
                    >rowHeight:
                    <input
                        type="number"
                        .valueAsNumber=${parseInt(this.dateconfig.rowHeight)}
                        @input=${(e: any) => {
                            this.dateconfig.rowHeight = e.target.valueAsNumber + 'px';

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <label class="p-2 m-2 bg-gray-200"
                    >monthWidth:
                    <input
                        type="number"
                        .valueAsNumber=${parseInt(this.dateconfig.monthWidth)}
                        @input=${(e: any) => {
                            this.dateconfig.monthWidth = e.target.valueAsNumber + 'px';

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <label class="p-2 m-2 bg-gray-200"
                    >showweek(iso week):
                    <input
                        type="checkbox"
                        .checked=${this.dateconfig.showWeek}
                        @click=${(e: any) => {
                            this.dateconfig.showWeek = e.target.checked;

                            this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                            this.render();
                        }}
                /></label>

                <button
                    class="p-2 m-2 bg-gray-200"
                    @click=${() => {
                        if (this.dateconfig.startMonth === 11) {
                            this.dateconfig.startMonth = 0;
                            this.dateconfig.startYear++;
                        } else {
                            this.dateconfig.startMonth++;
                        }
                        this.dateconfig = Object.assign({}, this.dateconfig); //reassign so lit-html knows its a new value... will add methods for this..
                        this.render();
                    }}
                >
                    next
                </button>
            </div>
            <simple-html-date style="margin:10px;" .config=${this.dateconfig}></simple-html-date>`;
    }
}