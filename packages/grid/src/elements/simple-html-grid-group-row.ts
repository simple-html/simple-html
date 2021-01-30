import { customElement, property } from '@simple-html/core';
import { GridInterface, SimpleHtmlGrid } from '..';
import { GridGroupConfig } from '../types';
import { html } from 'lit-html';
import { log } from './log';

@customElement('simple-html-grid-group-row')
export default class extends HTMLElement {
    connector: GridInterface;
    @property() rowNo: number;
    ref: SimpleHtmlGrid;
    currentHeight: number;
    @property() group: number;

    connectedCallback() {
        this.classList.add('simple-html-grid-group-row');
        const config = this.connector.config;
        const grouping =
            this.connector.config.groupingSet && this.connector.config.groupingSet.length;
        const curleft = grouping ? grouping * 15 : 0;
        this.style.display = 'block';
        this.style.height = config.__rowHeight + 'px';
        this.style.width = config.groups[this.group].width + 'px';
        this.style.left = config.groups[this.group].__left + curleft + 'px';
        this.ref.addEventListener('column-resize', this);
        this.ref.addEventListener('reRender', this);

        this.rows = config.groups[this.group].rows.map((cell, i) => {
            const x = document.createElement('simple-html-grid-cell-row');
            x.connector = this.connector;
            x.rowNo = this.rowNo;
            x.cell = this.cell;
            x.group = this.group;
            x.ref = this.ref;
            x.cellPosition = i;
            this.appendChild(x);
            return x;
        });
    }

    valuesChangedCallback() {
        if (this.isConnected) {
            this.rows.forEach((r) => {
                r.rowNo = this.rowNo;
            });
        }
    }

    updateCells() {
        this.rows.forEach((r) => {
            r.xrender();
        });
    }

    handleEvent(e: Event) {
        log(this, e);

        if (e.type === 'column-resize' || e.type === 'reRender') {
            const config = this.connector.config;
            const grouping =
                this.connector.config.groupingSet && this.connector.config.groupingSet.length;
            const curleft = grouping ? grouping * 15 : 0;
            this.style.height = config.__rowHeight + 'px';
            this.style.width = config.groups[this.group].width + 'px';
            this.style.left = config.groups[this.group].__left + curleft + 'px';
        }
    }

    disconnectedCallback() {
        this.ref.removeEventListener('column-resize', this);
        this.ref.removeEventListener('reRender', this);
    }
}
