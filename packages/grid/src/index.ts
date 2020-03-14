import { render, html } from 'lit-html';
export { IGridConfig } from './interfaces';
import { gridTemplate } from './templates/gridTemplate';
import { GridInterface } from './gridInterface';
export { GridInterface } from './gridInterface';

export class FreeGrid extends HTMLElement {
    private __DATASOURCE_INTERFACE: GridInterface;
    public rowCache: { i: number }[] = [];

    set interface(value: GridInterface) {
        this.__DATASOURCE_INTERFACE = value;
        this.__DATASOURCE_INTERFACE.connectGrid(this);
    }

    get interface() {
        return this.__DATASOURCE_INTERFACE;
    }

    public connectedCallback() {
        this.resetRowCache();
        this.render();
    }

    public disconnectedCallback() {
        this.__DATASOURCE_INTERFACE.disconnectGrid();
    }

    public reRender() {
        requestAnimationFrame(() => {
            this.render();
        });
    }

    public manualConfigChange() {
        console.log('not implemented');
    }

    public resetRowCache() {
        const cacheLength =
            this.interface.displayedDataset.length > 40
                ? 40
                : this.interface.displayedDataset.length;
        this.rowCache = [];
        for (let i = 0; i < cacheLength; i++) {
            this.rowCache.push({ i: i });
        }
    }

    public render() {
        return new Promise(() => {
            console.time('render');
            if (this.interface) {
                render(
                    html`
                        ${gridTemplate(this.interface, this.rowCache)}
                    `,
                    this
                );

                if (this.interface.config.lastScrollTop) {
                    // set initial scroll top/left
                    // nice when reloading a page etc
                    const node = this.getElementsByTagName('free-grid-body')[0];
                    if (node && node.scrollTop !== this.interface.config.lastScrollTop) {
                        node.scrollTop = this.interface.config.lastScrollTop;
                        node.scrollLeft = this.interface.config.scrollLeft;
                        this.interface.config.lastScrollTop = 0;
                    }
                }
            } else {
                if (this.isConnected) {
                    console.error('no config set');

                    render(html``, this);
                }
            }
            console.timeEnd('render');
        });
    }
}

if (!(<any>globalThis).hmrCache) {
    customElements.define('free-grid', FreeGrid);
} else {
    if (!customElements.get('free-grid')) {
        customElements.define('free-grid', FreeGrid);
    }
}
