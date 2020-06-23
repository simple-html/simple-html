import { html } from 'lit-html';
import { FilterArgument } from '../../types';

/**
 * delete btn, removes condition
 */
export function deleteBtn(ctx: any, operatorObjectArr: FilterArgument[], i: number) {
    return html` <button
        class="dialog-item-x dialog-condition-trash"
        @click=${() => {
            operatorObjectArr && operatorObjectArr.splice(i, 1);
            ctx.render();
        }}
    >
        <svg
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            stroke="currentColor"
            viewBox="0 0 24 24"
        >
            <path
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            ></path>
        </svg>
    </button>`;
}
