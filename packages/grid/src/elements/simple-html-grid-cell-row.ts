import { customElement, property } from '@simple-html/core';
import { SimpleHtmlGrid, GridInterface } from '..';
import { CellConfig } from '../types';
import { generateMenuWithComponentName } from './generateMenuWithComponentName';
import { log } from './log';

@customElement('simple-html-grid-cell-row')
export default class extends HTMLElement {
    connector: GridInterface;
    cellPosition: number;
    ref: SimpleHtmlGrid;
    currentHeight: number;
    @property() rowNo: number;
    group: number;
    cell: CellConfig;
    innerEle: HTMLInputElement;
    lastVal: any;

    connectedCallback() {
        this.classList.add('simple-html-grid-cell-row');
        const config = this.connector.config;
        this.style.display = 'block';
        this.style.height = config.cellHeight + 'px';
        this.style.width = config.groups[this.group].width + 'px';
        this.style.top = this.cellPosition * config.cellHeight + 'px';
        this.cell = config.groups[this.group].rows[this.cellPosition];
        this.ref.addEventListener('column-resize', this);
        this.innerEle = document.createElement('input');
        this.appendChild(this.innerEle);
        this.setSettings();
    }

    handleEvent(e: Event) {
        log(this, e);

        if (e.type === 'column-resize') {
            this.style.width = this.connector.config.groups[this.group].width + 'px';
        }
    }

    disconnectedCallback() {
        this.ref.removeEventListener('column-resize', this);
    }

    updateCallback(e: any) {
        const data = this.connector.displayedDataset[this.rowNo];
        const cell = this.cell;

        if (cell.readonly) {
            if (this.cell.type === 'date') {
                // date picker with alt key overides input somehow..
                e.target.valueAsDate = data[cell.attribute] || null;
            }

            return;
        }

        this.connector.gridCallbacks.beforeEditCallbackFn &&
            this.connector.gridCallbacks.beforeEditCallbackFn(
                e,
                cell,
                this.rowNo,
                data,
                this.connector
            );
        // filter out based on type so we know what type to use
        if (cell.autoUpdateData !== false) {
            switch (this.cell.type) {
                case 'boolean':
                    data[cell.attribute] = e.target.checked;
                    break;
                case 'image':
                    // rowData[col.attribute] = e.target.checked;
                    // we need this ever ?
                    break;
                case 'date':
                    data[cell.attribute] = e.target.valueAsDate;
                    break;
                case 'number':
                    data[cell.attribute] = e.target.valueAsNumber;
                    break;
                default:
                    data[cell.attribute] = e.target.value;
            }
            this.connector.publishEvent('attribute-change');
        }
        this.connector.gridCallbacks.afterEditCallbackFn &&
            this.connector.gridCallbacks.afterEditCallbackFn(
                e,
                cell,
                this.rowNo,
                data,
                this.connector
            );
    }

    setSettings() {
        const cell = this.cell;
        const data = this.connector.displayedDataset[this.rowNo];
        if (data.__group) {
            this.parentNode.style.display = 'none';
            return;
        } else {
            this.parentNode.style.display = 'block';
        }
        this.lastVal = data[cell.attribute];

        const connector = this.connector;
        const rowNo = this.rowNo;
        const ref = this.ref;
        const change = this.cell.editEventType !== 'input' ? this.updateCallback : null;
        const input = this.cell.editEventType === 'input' ? this.updateCallback : null;

        const contentMenu = function (e: any) {
            if ((e as any).button !== 0) {
                generateMenuWithComponentName(
                    'simple-html-grid-menu-row',
                    e,
                    connector,
                    ref,
                    cell,
                    rowNo,
                    data
                );
            }
        };

        if (this.connector.gridCallbacks.renderRowCallBackFn) {
            return this.connector.gridCallbacks.renderRowCallBackFn(
                cell,
                data,
                rowNo,
                connector,
                this.updateCallback
            );
        }

        this.innerEle.readOnly = cell.readonly || connector.config.readonly;
        this.innerEle.disabled = cell.disabled;
        this.innerEle.onchange = change;
        this.innerEle.oninput = input;
        this.innerEle.setAttribute('type', cell.type || 'text');
        this.innerEle.oncontextmenu = (e: any) => {
            e.preventDefault();
            contentMenu(e);
            return false;
        };
        this.innerEle.classList.add('simple-html-grid-row-input');

        switch (cell.type) {
            case 'boolean':
                this.innerEle.checked = data[cell.attribute];
                this.innerEle.classList.remove('simple-html-grid-row-input');
                this.innerEle.classList.add('simple-html-grid-row-checkbox');
                break;
            case 'image':
                console.log('no-image');
                break;
            case 'empty':
                console.log('no-.empty');
                break;
            case 'date':
                this.innerEle.valueAsDate = data[cell.attribute] || null;
                break;
            case 'number':
                this.innerEle.valueAsNumber = data[cell.attribute] || null;
                break;
            default:
                this.innerEle.value = data[cell.attribute] || null;
        }
    }

    xrender() {
        if (this.connector.displayedDataset[this.rowNo]) {
            const cell = this.cell;
            const data = this.connector.displayedDataset[this.rowNo];
            if (data.__group) {
                this.parentNode.style.display = 'none';
            } else {
                this.parentNode.style.display = 'block';
            }
            if (this.lastVal !== data[cell.attribute]) {
                switch (cell.type) {
                    case 'boolean':
                        this.innerEle.checked = data[cell.attribute];
                        break;
                    case 'image':
                        console.log('no-image');
                        break;
                    case 'empty':
                        console.log('no-.empty');
                        break;
                    case 'date':
                        this.innerEle.valueAsDate = data[cell.attribute] || null;
                        break;
                    case 'number':
                        this.innerEle.valueAsNumber = data[cell.attribute] || null;
                        break;
                    default:
                        this.innerEle.value = data[cell.attribute] || null;
                }
            }
        }
    }
}
