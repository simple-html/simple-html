import { customElement } from '@simple-html/core';
import { GridInterface } from '../gridInterface';
import { SimpleHtmlGrid } from '..';
import { GridGroupConfig } from '../types';
import { SimpleHtmlGridCellLabel } from './simple-html-grid-cell-label';

@customElement('simple-html-grid-group-label')
export class SimpleHtmlGridGroupLabel extends HTMLElement {
    connector: GridInterface;
    ref: SimpleHtmlGrid;
    currentHeight: number;
    group: GridGroupConfig;
    rows: SimpleHtmlGridCellLabel[];

    connectedCallback() {
        this.classList.add('simple-html-grid-group-label');
        this.styling();
        this.ref.addEventListener('column-resize', this);

        this.rows = this.group.rows.map((_row, i) => {
            const el = document.createElement(
                'simple-html-grid-cell-label'
            ) as SimpleHtmlGridCellLabel;
            el.connector = this.connector;
            el.group = this.group;
            el.ref = this.ref;
            el.cellPosition = i;

            this.appendChild(el);
            return el;
        });
    }

    handleEvent(e: Event) {
        if (e.type === 'column-resize') {
            this.styling();
        }
    }

    disconnectedCallback() {
        this.ref.removeEventListener('column-resize', this);
    }

    private styling() {
        const config = this.connector.config;
        this.style.display = 'block';
        const grouping =
            this.connector.config.groupingSet && this.connector.config.groupingSet.length;
        const curleft = grouping ? grouping * 15 : 0;
        this.style.height = config.__rowHeight + 'px';
        this.style.width = this.group.width + 'px';
        this.style.left = this.group.__left + curleft + 'px';
    }

    xrender() {
        this.styling();
        const rows = this.group.rows;
        if (rows.length !== this.rows.length) {
            if (rows.length < this.rows.length) {
                const keep: any = [];
                this.rows.forEach((e, i) => {
                    if (!rows[i]) {
                        this.removeChild(e);
                    } else {
                        keep.push(e);
                    }
                });
                this.rows = keep;
            } else {
                rows.forEach((_e, i) => {
                    if (!this.rows[i]) {
                        const el = document.createElement(
                            'simple-html-grid-cell-label'
                        ) as SimpleHtmlGridCellLabel;
                        el.connector = this.connector;
                        el.group = this.group;
                        el.ref = this.ref;
                        el.cellPosition = i;

                        this.appendChild(el);
                        this.rows.push(el);
                    } else {
                        const el = this.rows[i];
                        el.connector = this.connector;
                        el.group = this.group;
                        el.ref = this.ref;
                        el.cellPosition = i;
                    }
                });
            }
        }
        this.rows.forEach((el, i) => {
            el.cellPosition = i;
            el.group = this.group;
        });
        this.rows.forEach((e) => e.update());
    }
}
