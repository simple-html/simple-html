import { customElement, property } from '@simple-html/core';
import { GridInterface, SimpleHtmlGrid } from '..';
import { IgridConfigGroups } from '../interfaces';
import { html } from 'lit-html';

@customElement('simple-html-grid-group-row')
export default class extends HTMLElement {
    classList: any = 'simple-html-grid-group-row';
    connector: GridInterface;
    @property() rowNo: number;
    ref: SimpleHtmlGrid;
    currentHeight: number;
    group: IgridConfigGroups;

    connectedCallback() {
        const config = this.connector.config;
        const grouping =
            this.connector.config.groupingSet && this.connector.config.groupingSet.length;
        const curleft = grouping ? grouping * 15 : 0;
        this.style.display = 'block';
        this.style.height = config.__rowHeight + 'px';
        this.style.width = this.group.width + 'px';
        this.style.left = this.group.__left + curleft + 'px';
        this.ref.addEventListener('column-resize', this);
        this.ref.addEventListener('reRender', this);
    }

    handleEvent(e: any) {
        if (e.type === 'column-resize' || e.type === 'reRender') {
            const grouping =
                this.connector.config.groupingSet && this.connector.config.groupingSet.length;
            const curleft = grouping ? grouping * 15 : 0;
            this.style.width = this.group.width + 'px';
            this.style.left = this.group.__left + curleft + 'px';
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
        return html`
            ${this.group.rows.map((cell, i) => {
                return html`
                    <simple-html-grid-cell-row
                        .connector=${this.connector}
                        .rowNo=${this.rowNo}
                        .cell=${cell}
                        .group=${this.group}
                        .ref=${this.ref}
                        .cellPosition=${i}
                    ></simple-html-grid-cell-row>
                `;
            })}
        `;
    }
}
