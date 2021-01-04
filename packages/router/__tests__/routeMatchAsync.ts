/* eslint-disable @typescript-eslint/no-unused-vars */
import { gotoURL } from '../src/gotoURL';
import { customElement } from '@simple-html/core';
import { routeMatchAsync, subscribeHashEvent, unSubscribeHashEvent, startRouter } from '../src';
import { html } from 'lit-html';

describe('routeMatchAsync', () => {
    it('test if async render returns correct result when hash ', (done) => {
        startRouter();
        @customElement('app-root1')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        class Ele extends HTMLElement {
            connectedCallback() {
                subscribeHashEvent(this, () => {
                    this.render();
                });
            }

            disconnectedCallback() {
                unSubscribeHashEvent(this);
            }

            render() {
                return routeMatchAsync('#home', () => Promise.resolve('a'), html`b`);
            }
        }

        // add custom element
        document.body.innerHTML = '<app-root1 id="my-element"></app-root1>';

        requestAnimationFrame(() => {
            const node = document.getElementById('my-element');
            expect(node.textContent).toEqual('');
            gotoURL('#home');
            setTimeout(() => {
                expect(node.textContent).toEqual('b');

                //remove
                document.body.innerHTML = '';
                setTimeout(() => {
                    // now it should be removed
                    const node = document.getElementById('my-element');
                    expect(node).toEqual(null);
                    done();
                }, 50);
            }, 50);
        });
    });
});
