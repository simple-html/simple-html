import { customElement, requestRender } from '@simple-html/core';
import { html } from 'lit-html';
import { routeMatch } from '@simple-html/router';

@customElement('app-root')
export default class extends HTMLElement {
    elements = ['#default', '#sample1', '#sample2', '#sample3', '#sample4'];

    render() {
        return html`<section class="flex flex-row flex-grow h-full">
            <!-- our simple navigation  -->
            <div class="bg-gray-200 flex flex-col">
                ${this.elements.map((element) => {
                    return html`<a
                       class="p-2 m-2 bg-indigo-300"
                       href=${element}
                       @click=${() => requestRender(this)}>
                        ${element}
                    </button>`;
                })}
            </div>

            <!--  our routes -->
            ${routeMatch('') ? html`<sample-default class="flex-grow"></sample-default>` : ''}
            ${routeMatch('#default')
                ? html`<sample-default class="flex-grow"></sample-default>`
                : ''}
            ${routeMatch('#sample1') ? html`<sample-no1 class="flex-grow"></sample-no1>` : ''}
            ${routeMatch('#sample2') ? html`<sample-no2 class="flex-grow"></sample-no2>` : ''}
            ${routeMatch('#sample3') ? html`<sample-no3 class="flex-grow"></sample-no3>` : ''}
            ${routeMatch('#sample4') ? html`<sample-no4 class="flex-grow"></sample-no4>` : ''}
        </section>`;
    }
}
