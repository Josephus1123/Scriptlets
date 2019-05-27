/* eslint-disable no-console, func-names, no-multi-assign */
import { createHitFunction, stringToFunc } from '../helpers';

/**
 * Sets static properties PopAds and popns.
 *
 * @param {Source} source
 */
export function setPopadsDummy(source) {
    const hit = createHitFunction(source);
    delete window.PopAds;
    delete window.popns;
    Object.defineProperties(window, {
        PopAds: {
            get: () => {
                hit();
                return {};
            },
        },
        popns: {
            get: () => {
                hit();
                return {};
            },
        },
    });
}

setPopadsDummy.names = [
    'set-popads-dummy',
    'popads-dummy.js',
];

setPopadsDummy.injections = [stringToFunc, createHitFunction];