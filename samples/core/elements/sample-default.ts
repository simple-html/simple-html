import { customElement } from '@simple-html/core';
import { html } from 'lit-html';
import { viewState } from '../state/viewState';

@customElement('sample-default')
export default class extends HTMLElement {
    render() {
        const [view] = viewState();
        return html`${view}`;
    }
}
