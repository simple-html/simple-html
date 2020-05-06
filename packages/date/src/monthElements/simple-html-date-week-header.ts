import { customElement } from '@simple-html/core';
import { html } from 'lit-html';

@customElement('simple-html-date-week-header')
export default class extends HTMLElement {
    render() {
        return html`W`;
    }
}