/* eslint-disable @typescript-eslint/no-unused-vars */
import { customElement, requestRender } from '../src';
import { updatedCallback } from '../src/updateCallback';

describe('customElement observedAttributes', () => {
    let attributeChangedCallbacks: string[][] = [];
    let valuesChangedCallbacks: string[][] = [];

    beforeAll((done) => {
        @customElement('app-root1')
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        class Ele extends HTMLElement {
            static get observedAttributes() {
                return ['my-att'];
            }

            attributeChangedCallback(name: string, oldValue: string, newValue: string) {
                attributeChangedCallbacks.push([name, oldValue, newValue]);
            }

            valuesChangedCallback(type: string, name: string, oldValue: string, newValue: string) {
                valuesChangedCallbacks.push([type, name, oldValue, newValue]);
            }

            render() {
                return 'current attribute is:' + this.getAttribute('my-att');
            }
        }

        // add custom element
        document.body.innerHTML = '<app-root1 id="my-element" my-att="initvalue" ></app-root1>';
        requestAnimationFrame(() => {
            done();
        });
    });

    it('see if attribute is set before render', (done) => {
        expect(document.getElementById('my-element').textContent).toEqual(
            'current attribute is:initvalue'
        );
        done();
    });

    it('check attributeChangedCallback initial call', (done) => {
        expect(attributeChangedCallbacks[0]).toEqual(['my-att', null, 'initvalue']);
        done();
    });

    it('check valuesChangedCallbacks initial call', (done) => {
        expect(valuesChangedCallbacks[0]).toEqual(['attribute', 'my-att', null, 'initvalue']);
        done();
    });

    describe('---> Edit value', () => {
        beforeAll((done) => {
            attributeChangedCallbacks = [];
            valuesChangedCallbacks = [];

            // set newvalue so we can also test change trigger
            document.getElementById('my-element').setAttribute('my-att', 'newValue');

            // giv it chance to update
            requestAnimationFrame(() => {
                done();
            });
        });

        it('see if attribute have not triggered update', (done) => {
            expect(document.getElementById('my-element').textContent).toEqual(
                'current attribute is:initvalue'
            );
            done();
        });

        it('check attributeChangedCallback updated call', (done) => {
            // init set
            expect(attributeChangedCallbacks[0]).toEqual(['my-att', 'initvalue', 'newValue']);
            done();
        });

        it('check valuesChangedCallbacks updated call', (done) => {
            // init set
            expect(valuesChangedCallbacks[0]).toEqual([
                'attribute',
                'my-att',
                'initvalue',
                'newValue'
            ]);
            done();
        });

        it('trigger update and see new value', (done) => {
            // register updated callback on element
            updatedCallback(document.getElementById('my-element'), () => {
                expect(document.getElementById('my-element').textContent).toEqual(
                    'current attribute is:newValue'
                );
                done();
            });

            // request element to run render
            requestRender(document.getElementById('my-element'));
        });
    });
});
