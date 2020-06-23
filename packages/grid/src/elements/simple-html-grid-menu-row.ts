import { customElement } from '@simple-html/core';
import { GridInterface } from '../gridInterface';
import { SimpleHtmlGrid } from './simple-html-grid';
import { html } from 'lit-html';
import { CellConfig, Entity } from '../types';

let dataClip: any = null; // firefox hack
@customElement('simple-html-grid-menu-row')
export default class extends HTMLElement {
    connector: GridInterface;
    cell: CellConfig;
    ref: SimpleHtmlGrid;
    rowNo: number;
    rowData: Entity;

    connectedCallback() {
        this.classList.add('simple-html-grid', 'simple-html-grid-menu');
        document.addEventListener('click', this);
        this.ref.addEventListener('vertical-scroll', this);
        setTimeout(() => {
            document.addEventListener('contextmenu', this);
        }, 50);
    }

    disconnectedCallback() {
        this.ref.removeEventListener('vertical-scroll', this);
        document.removeEventListener('click', this);
        document.removeEventListener('contextmenu', this);
    }

    handleEvent(e: Event) {
        if (e.target !== this) {
            this.removeSelf();
        }
    }

    async select(_type: string) {
        if (_type === 'copy' && this.rowData) {
            try {
                dataClip = this.rowData[this.cell.attribute]; // firefox hack
                await navigator.clipboard.writeText(this.rowData[this.cell.attribute]);
            } catch (err) {
                console.error(err);
            }
        }
        if (_type === 'paste') {
            try {
                let data;
                if (navigator.clipboard.readText) {
                    data = await navigator.clipboard.readText();
                } else {
                    data = dataClip; // firefox hack
                }

                if (data === 'undefined' || data === 'null') {
                    data = null;
                }
                this.pasteIntoCells(data);
            } catch (err) {
                console.error(err);
            }
        }

        if (_type === 'clear') {
            this.pasteIntoCells(null);
        }
    }

    pasteIntoCells(data: any) {
        this.connector.getSelectedRows().forEach((row: number) => {
            this.connector.displayedDataset[row][this.cell.attribute] = data;
        });
        this.connector.reRender();
    }

    removeSelf() {
        document.body.removeChild(this);
    }

    allowCopyPaste() {
        if (!this.connector.config.readonly && !this.cell.readonly) {
            return html`<!-- only if not readonly -->
                <p class="simple-html-grid-menu-item" @click=${() => this.select('paste')}>
                    Paste into selected rows
                </p>
                <p class="simple-html-grid-menu-item" @click=${() => this.select('clear')}>
                    Clear selected rows
                </p>`;
        } else {
            return html``;
        }
    }

    render() {
        return html`<p class="simple-html-grid-menu-item" @click=${() => this.select('copy')}>
                Copy cell value
            </p>
            ${this.allowCopyPaste()}`;
    }
}
