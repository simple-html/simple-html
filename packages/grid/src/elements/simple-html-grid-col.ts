import { customElement } from '@simple-html/core';
import { GridInterface } from '../gridInterface';
import { SimpleHtmlGrid } from '..';
import { html, svg } from 'lit-html';
import { RowCache } from '../types';
import { log } from './log';

@customElement('simple-html-grid-col')
export default class extends HTMLElement {
    connector: GridInterface;
    row: RowCache;
    ref: SimpleHtmlGrid;

    handleEvent(e: Event) {
        log(this, e);

        if (e.type === 'vertical-scroll') {
            this.render();
        }
    }

    render() {
        if (this.connector) {
            this.style.width = '100%';
            this.style.height = this.connector.getScrollVars.__SCROLL_HEIGHTS[this.row.i] + 'px';

            // }
            const entity = this.connector.displayedDataset[this.row.i];

            if (entity && entity.__group) {
                this.style.display = 'block';

                const changeGrouping = () => {
                    if (entity.__groupExpanded) {
                        this.connector.groupCollapse(entity.__groupID);
                    } else {
                        this.connector.groupExpand(entity.__groupID);
                    }
                };

                return html`
                    <i @click=${changeGrouping}>
                        <svg
                            class="simple-html-grid-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 16 16"
                        >
                            ${entity.__groupExpanded
                                ? svg`<path d="M4.8 7.5h6.5v1H4.8z" />`
                                : svg`<path d="M7.4 4.8v2.7H4.7v1h2.7v3h1v-3h2.8v-1H8.5V4.8h-1z" />`}
                        </svg></i
                    ><span> ${entity.__groupName} (${entity.__groupTotal})</span>
                `;
            } else {
                this.style.display = 'none';

                return '' as any;
            }
        }
    }
}
