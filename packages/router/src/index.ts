import { canDeactivate } from './can_deactivate_event';
import { publishHashEvent } from './hash_render_event';
// exports
export { routeMatch } from './routeMatch';
export { routeMatchAsync } from './routeMatchAsync';
export { gotoURL } from './gotoURL';
export { getRouteParams } from './getRouteParams';
export {
    subscribeHashEvent,
    unSubscribeHashEvent,
    publishHashEvent,
    connectHashChanges
} from './hash_render_event';
export {
    subscribeCanDeactivateEvent,
    unSubscribeCanDeactivateEvent,
    publishCanDeactivateEvent,
    stopCanDeactivate,
    connectCanDeactivate
} from './can_deactivate_event';

/**
 * starts router
 */
export function startRouter() {
    let oldhash = window.location.hash;
    let isBackEvent = false;

    const hashChange = function () {
        if (!isBackEvent) {
            canDeactivate().then((result) => {
                if (result) {
                    oldhash = window.location.hash;
                    publishHashEvent();
                } else {
                    isBackEvent = true;
                    window.location.hash = oldhash;
                }
            });
        } else {
            isBackEvent = false;
        }
    };

    if (!(globalThis as any).__simple_html_router) {
        (globalThis as any).__simple_html_router = true;
        window.addEventListener('hashchange', hashChange);
    }
}
