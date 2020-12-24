import { getPropSymbol } from './symbols';

/**
 * @property prop
 * TODO combine this to cover property and attribute decorators
 *
 *
 */
export function prop() {
    return function reg(_class: () => void, prop: string): void {
        Object.defineProperty(_class, prop, {
            get: function () {
                return this[getPropSymbol(this.tagName + '_' + prop)];
            },
            set: function (x: any) {
                this[getPropSymbol(this.tagName + '_' + prop)] = x;
                return true;
            },
            configurable: true
        });
    };
}
