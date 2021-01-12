/* eslint-disable @typescript-eslint/no-unused-vars */
import { ObjectState, SimpleState } from '../src';

/**
 * simple state
 */
export const STATE_KEY1 = 'TEST_STATE';
export type state1 = number | undefined;
export const simpleState = new SimpleState<state1>(STATE_KEY1, null);

/**
 * simple state
 */
export const STATE_KEY2 = 'TEST_STATE2';
export type state2 = { name: string };
export const objectState = new ObjectState<state2>(STATE_KEY2, null);

describe('state', () => {
    it('simple state', () => {
        const [state1, setter1] = simpleState.getState();
        expect(state1).toEqual(null);
        setter1(1);
        const state2 = simpleState.getValue();
        expect(state2).toEqual(1);
        const setter = simpleState.getSetter();
        setter(3);
        const state5 = simpleState.getValue();
        expect(state5).toEqual(3);
        simpleState.setValue(4);
        const state6 = simpleState.getValue();
        expect(state6).toEqual(4);
    });

    it('object state', () => {
        const [state3, setter3] = objectState.getState();
        expect(state3).toEqual({});
        setter3({ name: 'cool' });
        const state4 = objectState.getValue();
        expect(state4).toEqual({ name: 'cool' });
        const setter = objectState.getSetter();
        setter({ name: 'test' });
        const state5 = objectState.getValue();
        expect(state5).toEqual({ name: 'test' });
        objectState.setValue({ name: 'nils' });
        const state6 = objectState.getValue();
        expect(state6).toEqual({ name: 'nils' });
    });
});
