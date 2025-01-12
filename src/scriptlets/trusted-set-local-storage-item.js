import {
    hit,
    logMessage,
    nativeIsNaN,
    setStorageItem,
    parseKeywordValue,
} from '../helpers/index';

/* eslint-disable max-len */
/**
 * @trustedScriptlet trusted-set-local-storage-item
 * @description
 * Adds item with arbitrary key and value to localStorage object, or updates the value of the key if it already exists.
 * Scriptlet won't set item if storage is full.
 *
 * **Syntax**
 * ```
 * example.com#%#//scriptlet('trusted-set-local-storage-item', 'key', 'value')
 * ```
 *
 * - `key` — required, key name to be set.
 * - `value` - required, key value; possible values:
 *   - arbitrary value
 *   - `$now$` keyword for setting current time in ms, corresponds to `Date.now()` and `(new Date).getTime()` calls
 *   - `$currentDate$` keyword for setting string representation of the current date and time, corresponds to `Date()` and `(new Date).toString()` calls
 *
 * **Examples**
 * 1. Set local storage item
 * ```
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'player.live.current.mute', 'false')
 *
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'COOKIE_CONSENTS', '{"preferences":3,"marketing":false}')
 *
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'providers', '[16364,88364]')
 *
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'providers', '{"providers":[16364,88364],"consent":"all"}')
 * ```
 *
 * 2. Set item with current time since unix epoch in ms
 * ```
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'player.live.current.play', '$now$')
 * ```
 *
 * 3. Set item with current date, e.g 'Tue Nov 08 2022 13:53:19 GMT+0300'
 * ```
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'player.live.current.play', '$currentDate$')
 * ```
 *
 * 4. Set item without value
 * ```
 * example.org#%#//scriptlet('trusted-set-local-storage-item', 'ppu_main_none', '')
 * ```
 */
/* eslint-enable max-len */

export function trustedSetLocalStorageItem(source, key, value) {
    if (typeof key === 'undefined') {
        logMessage(source, 'Item key should be specified');
        return;
    }

    if (typeof value === 'undefined') {
        logMessage(source, 'Item value should be specified');
        return;
    }

    const parsedValue = parseKeywordValue(value);

    const { localStorage } = window;
    setStorageItem(source, localStorage, key, parsedValue);
    hit(source);
}

trustedSetLocalStorageItem.names = [
    'trusted-set-local-storage-item',
    // trusted scriptlets support no aliases
];

trustedSetLocalStorageItem.injections = [
    hit,
    logMessage,
    nativeIsNaN,
    setStorageItem,
    parseKeywordValue,
];
