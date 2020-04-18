/* eslint-disable @typescript-eslint/no-unused-vars */
import { customElement, property } from '../src';

describe('customElement property', () => {
    it('property desco', (done) => {
        const valuesChanged: string[] = [];

        @customElement('app-root1')
        class Ele extends HTMLElement {
            @property() myprop = 'initvalue';

            valuesChanged(type: string, name: string, oldValue: string, newValue: string) {
                valuesChanged.push(type, name, oldValue, newValue);
            }

            render() {
                return 'render works:' + this.myprop;
            }
        }

        // add custom element
        document.body.innerHTML = '<app-root1 id="my-element" ></app-root1>';

        requestAnimationFrame(() => {
            const node = document.getElementById('my-element');

            expect(node.textContent).toEqual('render works:initvalue');

            // set newvalue so we can also test change trigger
            node.myprop = 'newvalue';

            requestAnimationFrame(() => {
                expect(node.textContent).toEqual('render works:newvalue');
                // init set
                expect(valuesChanged[0]).toEqual('property');
                expect(valuesChanged[1]).toEqual('myprop');
                expect(valuesChanged[2]).toEqual(undefined);
                expect(valuesChanged[3]).toEqual('initvalue');
                // after edit
                expect(valuesChanged[4]).toEqual('property');
                expect(valuesChanged[5]).toEqual('myprop');
                expect(valuesChanged[6]).toEqual('initvalue');
                expect(valuesChanged[7]).toEqual('newvalue');

                // trigger again
                node.myprop = 'more';

                expect(valuesChanged[8]).toEqual('property');
                expect(valuesChanged[9]).toEqual('myprop');
                expect(valuesChanged[10]).toEqual('newvalue');
                expect(valuesChanged[11]).toEqual('more');
                done();
            });
        });
    });
});
