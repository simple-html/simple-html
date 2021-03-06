/* eslint-disable @typescript-eslint/no-use-before-define */
import { GridInterface } from '../gridInterface';
import { SimpleHtmlGrid } from './simple-html-grid';
import { CellConfig, FilterArgument } from '../types';
import { columnDragDrop } from './dragEvent';
import { defineElement } from './defineElement';

export class SimpleHtmlGridColumnChooser extends HTMLElement {
    connector: GridInterface;
    cell: CellConfig;
    ref: SimpleHtmlGrid;
    width: number;
    filterAttributes: CellConfig[];
    filter: FilterArgument;

    connectedCallback() {
        this.classList.add('simple-html-grid', 'simple-html-grid-menu');
        this.ref.addEventListener('reRender', this);
        this.show();
    }

    handleEvent(e: Event) {
        if (e.type === 'reRender') {
            this.innerHTML = '';
            this.show();
            return;
        }
        if (e.target !== this) {
            this.removeSelf();
        }
    }

    removeSelf() {
        document.body.removeChild(this);
        this.ref.removeEventListener('reRender', this);
    }

    show() {
        const div = document.createElement('div');
        div.classList.add('simple-html-grid');

        const span = document.createElement('span');
        span.classList.add('block', 'simple-html-grid-menu-item');
        span.onclick = () => {
            this.removeSelf();
        };
        const b = document.createElement('b');
        b.appendChild(document.createTextNode('Close'));
        span.appendChild(b);

        div.appendChild(span);

        this.appendChild(div);

        const cols = this.connector.config.optionalCells?.map((cell) => {
            const mousedown = columnDragDrop('dragstart', () => cell, this.connector, null);

            const span = document.createElement('span');
            span.classList.add('block', 'simple-html-grid-menu-item');
            span.onmousedown = (e) => {
                mousedown(e);
            };
            span.appendChild(document.createTextNode(cell.header));
            return span;
        });

        if (cols && cols.length) {
            cols.forEach((c) => {
                this.appendChild(c);
            });
        }
    }
}
defineElement(SimpleHtmlGridColumnChooser, 'simple-html-grid-column-chooser');
