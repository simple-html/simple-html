import { customElement } from '@simple-html/core';
import { GridInterface, FreeGrid } from '../';
import { IgridConfigGroups } from '../interfaces';
import { html } from 'lit-html';

@customElement('free-grid-cell-filter')
export default class extends HTMLElement {
    classList: any = 'free-grid-cell-filter';
    connector: GridInterface;
    cellPosition: number;
    ref: FreeGrid;
    currentHeight: number;
    group: IgridConfigGroups;
    label: string;
    attribute: string;

    connectedCallback() {
        const config = this.connector.config;
        this.style.height = config.cellHeight + 'px';
        this.style.width = this.group.width + 'px';
        this.style.top = this.cellPosition * config.cellHeight + 'px';
        this.attribute = this.group.rows[this.cellPosition].attribute;
        this.ref.addEventListener('column-resize', this);
        this.ref.addEventListener('reRender', this);
    }

    handleEvent(e: any) {
        if (e.type === 'column-resize') {
            this.style.width = this.group.width + 'px';
        }
        if (e.type === 'reRender') {
            this.render();
        }
    }

    disconnectedCallback() {
        this.ref.removeEventListener('column-resize', this);
        this.ref.removeEventListener('reRender', this);
    }

    render() {
        const cell = this.group.rows[this.cellPosition];

        const coltype = cell.type === 'boolean' ? 'checkbox' : cell.type;

        const value = cell.filterable.currentValue || null;
        const placeholder = cell.filterable.placeholder || '';

        const filterCallback = (e: any) => {
            // if boolean column we to to overide how it behaves
            if (cell.type === 'boolean') {
                const t: any = e.target;
                switch (t.state) {
                    case 0:
                        t.state = 2;
                        t.style.opacity = '1';
                        t.checked = true;
                        t.indeterminate = false;
                        break;
                    case 2:
                        t.state = 3;
                        t.style.opacity = '1';
                        t.indeterminate = false;
                        break;
                    default:
                        t.checked = false;
                        t.state = 0;
                        t.style.opacity = '0.3';
                        t.indeterminate = true;
                }
            }
            cell.filterable.beforeFilterCallbackFn &&
                cell.filterable.beforeFilterCallbackFn(e, cell, this.connector);
            if (cell.filterable.auto !== false) {
                this.connector.filterCallback(e, cell);
            }
        };

        const enterKeyDown = (e: KeyboardEvent) => {
            const keycode = e.keyCode ? e.keyCode : e.which;
            if (keycode === 13) {
                filterCallback(e as any);
            }
        };

        let boolstyle = null;
        let indeterminate = false;
        let setState = 0;
        if (cell.type === 'boolean' && cell.filterable) {
            // if no value is set then its "blank state, nothing filtered
            if (cell.filterable.currentValue !== false && cell.filterable.currentValue !== true) {
                boolstyle = 'opacity:0.3';
                indeterminate = true;
                setState = 0;
            } else {
                setState = cell.filterable.currentValue ? 2 : 3;
            }
        }

        let classname = 'free-grid-row-input';
        if (cell.type === 'boolean') {
            classname = 'free-grid-row-checkbox';
        }

        const change = cell.editEventType !== 'input' ? filterCallback : null;
        const input = cell.editEventType === 'input' ? filterCallback : null;

        if (cell.renderFilterCallBackFn) {
            return cell.renderFilterCallBackFn(cell, this.connector, filterCallback);
        }

        if (coltype === 'date') {
            return html`
                <input
                    type=${coltype}
                    style=${boolstyle}
                    class=${classname}
                    @input=${input}
                    @keydown=${enterKeyDown}
                    .valueAsDate=${value}
                    placeholder=${placeholder}
                />
            `;
        } else {
            return html`
                <input
                    type=${coltype || 'text'}
                    style=${boolstyle}
                    .indeterminate=${indeterminate}
                    .state=${setState}
                    class=${classname}
                    @change=${change}
                    @input=${input}
                    @keydown=${enterKeyDown}
                    .value=${value}
                    placeholder=${placeholder}
                />
            `;
        }
    }
}
