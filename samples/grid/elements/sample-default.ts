import { customElement } from '@simple-html/core';
import { html } from 'lit-html';
import { GridInterface } from '@simple-html/grid';
import { setup } from '../gridSetup/setup';
import { WordDatasource01, set, add } from '../data/datasources';

@customElement('sample-default')
export default class extends HTMLElement {
    connector: GridInterface;
    connectedCallback() {
        this.connector = new GridInterface(setup(1, 10), WordDatasource01);
        this.connector.reloadDatasource();
    }

    render() {
        return html`
            <div class="flex flex-row flex-grow h-full">
                <div class="flex-grow">
                    <data-buttons
                        class="flex flex-col"
                        .btnClass=${'p-2 m-2 bg-green-400'}
                        .type=${'add'}
                        .callback=${(x: number) => {
                            add(this.connector, x);
                        }}
                    ></data-buttons>

                    <data-buttons
                        class="flex flex-col"
                        .btnClass=${'p-2 m-2 bg-yellow-400'}
                        .type=${'set'}
                        .callback=${(x: number) => {
                            set(this.connector, x);
                        }}
                    ></data-buttons>

                    <nav-buttons
                        class="flex flex-col"
                        .btnClass=${'p-2 m-2 bg-indigo-400'}
                        .callback=${(action: 'first' | 'next' | 'prev' | 'last') => {
                            this.connector[action]();
                        }}
                    ></nav-buttons>
                </div>

                <simple-html-grid
                    style="width:100%"
                    class="simple-html-grid w-full flex-grow"
                    .interface=${this.connector}
                >
                </simple-html-grid>
            </div>
        `;
    }
}
