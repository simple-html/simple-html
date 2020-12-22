import { disconnectedCallback, publish, subscribe, unSubscribe } from '.';

let state = (window as any).state || {};
const keys = new Set();
type valueSetter<T> = (value: T) => void;

// helper for fusebox hmr event
if (!(window as any).state) {
    window.addEventListener('HMR-FUSEBOX', () => {
        console.warn('please publish: SIMPLE_HTML_SAVE_STATE as event, will remove HMR-FUSEBOX');
        (window as any).state = state;
        console.log('HMR-FUSEBOX', (window as any).state);
    });

    window.addEventListener('SIMPLE_HTML_SAVE_STATE', () => {
        (window as any).state = state;
        console.log('SIMPLE_HTML_HMR', (window as any).state);
    });
}

export type stateResult<T> = [T, valueSetter<T>];

export type stateResultObj<T> = [T, <K extends keyof T>(part: Pick<T, K>) => void];

/**
 * Get current glabal state
 * great for saving state for next time user opens website
 */
export function getState() {
    state;
}

/**
 * overide current state
 * great for restoring state time user opens website
 */
export function setState<T>(newState: T) {
    state = newState;
}

export function assignState<T, K extends keyof T>(obj: T, part: Pick<T, K>) {
    return Object.assign(obj, part);
}

/**
 * simple state container
 * @param key key used in state container and event
 * @param defaultValue default state value
 * @param customPublishedTrigger if you do not want it to publish update event
 */
export function stateContainer<T>(
    key: string,
    defaultValue: T,
    customPublishedTrigger?: boolean
): stateResult<T> {
    //set default value if not set
    if (!state.hasOwnProperty(key)) {
        state[key] = defaultValue;
    }

    const currentState: T = state[key];
    const setter = function (value: T) {
        state[key] = value;
    };

    const middleware = function (value: any) {
        setter(value);
        publish(key, value);
    };

    return [currentState, customPublishedTrigger ? setter : middleware];
}

/**
 * simple state container
 * @param key key used in state container and event
 */
export function stateOnlyContainer<T>(key: string, defaultValue: T): T {
    //set default value if not set
    if (!state.hasOwnProperty(key)) {
        state[key] = defaultValue;
    }

    const currentState: T = state[key];

    return currentState;
}

/**
 * simple warning if you reuse a key by accident
 * @param key
 */
export function validateKey(key: string) {
    if (keys.has(key)) {
        throw new Error(`state key used allready, use another name`);
    } else {
        keys.add(key);
        return key;
    }
}

export class State<T> {
    stateKey: string;
    defaultValue: T;
    forceObject: boolean;
    constructor(STATE_KEY: string, defaultValue: T, forceObject = false) {
        this.stateKey = STATE_KEY;
        this.defaultValue = defaultValue;
        if (!state.hasOwnProperty(this.stateKey)) {
            state[this.stateKey] = defaultValue;
        }

        this.forceObject = forceObject;
        validateKey(this.stateKey);
    }

    getStatekey() {
        return this.stateKey;
    }

    /**
     * return state [value, setter]
     * @param defaultState
     */
    get(defaultState?: T): stateResult<T> {
        if (this.forceObject) {
            throw 'this is object only state, use getObject';
        }
        if (defaultState) {
            this.defaultValue = defaultState; // todo, I need to set it...
        }
        return stateContainer<T>(this.stateKey, this.defaultValue);
    }

    /**
     * just return simple value
     * @param defaultState
     */
    getStateOnly(defaultState?: T): T {
        if (this.forceObject) {
            throw 'this is object only state, use getObject';
        }
        if (defaultState) {
            this.defaultValue = defaultState; // todo, I need to set it...
        }

        return stateOnlyContainer<T>(this.stateKey, this.defaultValue);
    }

    /**
     * to simplyfy the usage with objects, but you cant really delete anything here unless you add allkeys
     * @param defaultState
     */
    getObject(defaultState?: T): stateResultObj<T> {
        if (defaultState) {
            this.defaultValue = defaultState; // todo, I need to set it...
        }

        if (!state.hasOwnProperty(this.stateKey)) {
            state[this.stateKey] = this.defaultValue;
        }

        function assignA<K extends keyof T>(part: Pick<T, K>): void {
            state[this.stateKey] = assignState(state[this.stateKey] as T, part);
            publish(this.stateKey, state[this.stateKey]);
        }

        return [state[this.stateKey], assignA];
    }

    /**
     * just return simple value, of object
     * @param defaultState
     */
    getObjectStateOnly(defaultState?: T): T {
        if (defaultState) {
            this.defaultValue = defaultState; // todo, I need to set it...
        }
        if (!state.hasOwnProperty(this.stateKey)) {
            state[this.stateKey] = this.defaultValue;
        }

        return stateOnlyContainer<T>(this.stateKey, this.defaultValue);
    }

    /**
     * connect to state in elements connectedcallback, will automatically disconnect if dicconnectedcallback is called
     * @param context
     * @param callback
     */

    connect(context: HTMLElement, callback: () => void): void {
        // this register callback with simpleHtml elements disconnected callback
        disconnectedCallback(context, () => unSubscribe(this.stateKey, context));

        // for following the event we just use the internal event handler
        subscribe(this.stateKey, context, callback);
    }
}
