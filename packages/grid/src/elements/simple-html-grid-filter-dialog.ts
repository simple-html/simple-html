/* eslint-disable @typescript-eslint/no-use-before-define */
import { customElement } from '@simple-html/core';
import { GridInterface } from '../gridInterface';
import { SimpleHtmlGrid } from './simple-html-grid';
import { html } from 'lit-html';
import { CellConfig, FilterArgument } from '../interfaces';
import { filterDialogGroupTemplate } from './filterDialogGroupTemplate';

@customElement('simple-html-grid-filter-dialog')
export default class extends HTMLElement {
    connector: GridInterface;
    cell: CellConfig;
    ref: SimpleHtmlGrid;
    width: number;
    filterAttributes: CellConfig[];
    filter: FilterArgument;

    connectedCallback() {
        this.style.top = '0';
        this.style.left = '0';
        this.filter = this.connector.getCurrentFilter() || {
            type: 'GROUP',
            logicalOperator: 'AND',
            attribute: null,
            operator: null,
            valueType: null,
            value: null,
            attributeType: 'text',
            filterArguments: []
        };
        this.classList.add('simple-html-grid-menu-full');
        this.filterAttributes = this.connector.config.groups.flatMap((y) => y.rows);
    }

    handleEvent(e: Event) {
        if (e.target !== this) {
            this.removeSelf();
        }
    }

    removeSelf() {
        document.body.removeChild(this);
    }

    render() {
        return html`<div style="width:550px" class="simple-html-grid simple-html-filter-dialog">
            <div class="dialog-row main-group">
                <button
                    class="dialog-item-x"
                    @click=${() => {
                        this.removeSelf();
                    }}
                >
                    <b> Close</b>
                </button>
                <button
                    class="dialog-item-x"
                    @click=${() => {
                        const columns = this.connector.config.groups.flatMap((x) => x.rows);
                        columns.forEach((col) => {
                            const f = col.filterable;
                            if (f) {
                                f.currentValue = null;
                            }
                        });
                        this.connector.setCurrentFilter(this.filter);
                        this.connector.reRunFilter();
                        this.removeSelf();
                    }}
                >
                    <b> Run query & close</b>
                </button>
                <button
                    class="dialog-item-x"
                    @click=${() => {
                        const columns = this.connector.config.groups.flatMap((x) => x.rows);
                        columns.forEach((col) => {
                            const f = col.filterable;
                            if (f) {
                                f.currentValue = null;
                            }
                        });
                        this.connector.setCurrentFilter(this.filter);
                        this.connector.reRunFilter();
                    }}
                >
                    <b> Run query</b>
                </button>
            </div>

            ${filterDialogGroupTemplate(this.filter, this, 0)}
        </div>`;
    }
}
