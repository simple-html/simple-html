import { customElement, unSubscribe } from '@simple-html/core';
import { html } from 'lit-html';

import { property, publish, subscribe } from '@simple-html/core';
import { viewState } from '../state/viewState';

@customElement('sample-no4')
export default class extends HTMLElement {
    @property() ele5 = 0;
    @property() ele6 = 0;
    @property() ele7 = 0;

    connectedCallback() {
        subscribe('ele-5', this, (newValue: any) => {
            console.log(newValue);
            this.ele5 = newValue;
        });
        subscribe('ele-6', this, (newValue: any) => {
            console.log(newValue);
            this.ele6 = newValue;
        });
        subscribe('ele-7', this, (newValue: any) => {
            console.log(newValue);
            this.ele7 = newValue;
        });
    }

    disconnectedCallback() {
        unSubscribe('ele5', this);
        unSubscribe('ele6', this);
        unSubscribe('ele7', this);
    }

    render() {
        const [view] = viewState();
        return html` <span class="text-xl">${view.toUpperCase()}</span>
            <div class="flex flex-col">
                <button
                    class="bg-green-500 p-2"
                    @click=${() => {
                        publish('update');
                    }}
                >
                    publish all +1 to all
                </button>


                <span>ele-5-external: ${this.ele5}</span>
                <ele-5 class="flex flex-col"></ele-5>

                <span>ele-6-external:  ${this.ele6}</span>
                <ele-6 class="flex flex-col"></ele-6>

                <span>ele-7-external: ${this.ele7}</<span>
                <ele-7 class="flex flex-col"></ele-7>
            </div>`;
    }
}

/**
 * <ele-1></ele-1>
 */
@customElement('ele-5')
export class Ele5 extends HTMLElement {
    @property() count = 0;

    connectedCallback() {
        subscribe('update', this, () => {
            this.count++;
        });
    }

    disconnectedCallback() {
        unSubscribe('update', this);
    }

    render() {
        return html`<span>internal: ${this.count}</span>
            <button
                class="p-2 m-2 bg-green-500"
                @click=${() => {
                    this.count++;
                    publish('ele-5', this.count);
                }}
            >
                send from ele-5
            </button>`;
    }
}

/**
 * <ele-2></ele-2>
 */

@customElement('ele-6')
export class Ele6 extends HTMLElement {
    @property() count = 0;

    connectedCallback() {
        subscribe('update', this, () => {
            this.count++;
        });
    }

    disconnectedCallback() {
        unSubscribe('update', this);
    }

    render() {
        return html`<span>internal: ${this.count}</span>
            <button
                class="p-2 m-2 bg-green-500"
                @click=${() => {
                    this.count++;
                    publish('ele-6', this.count);
                }}
            >
                send from ele-6
            </button>`;
    }
}

/**
 * <ele-4></ele-4>
 */

@customElement('ele-7')
export class Ele7 extends HTMLElement {
    @property() count = 0;

    connctedCallback() {
        subscribe('update', this, () => {
            this.count++;
        });
    }

    disconnectedCallback() {
        unSubscribe('update', this);
    }

    render() {
        return html`<span>internal: ${this.count}</span>
            <button
                class="p-2 m-2 bg-green-500"
                @click=${() => {
                    this.count++;
                    publish('ele-7', this.count);
                }}
            >
                send from ele-7
            </button>`;
    }
}