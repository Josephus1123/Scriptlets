import {
    parseDelayArg,
    parseMatchArg,
    isValidMatchNumber,
    isValidMatchStr,
} from './string-utils';
import { nativeIsNaN } from './number-utils';

/**
 * Checks whether the passed arg is proper callback
 *
 * @param {any} callback arbitrary callback
 * @returns {boolean} if callback is valid
 */
export const isValidCallback = (callback) => {
    return callback instanceof Function
        // passing string as 'code' arg is not recommended
        // but it is possible and not restricted
        // https://developer.mozilla.org/en-US/docs/Web/API/setTimeout#parameters
        || typeof callback === 'string';
};

/**
 * Parses delay argument of setTimeout / setInterval methods into
 * rounded down number for number/string values or passes on for other types.
 * Needed for prevent-setTimeout and prevent-setInterval
 *
 * @param {any} delay native method delay arg
 * @returns {any} number as parsed delay or any input type if `delay` is not parsable
 */
export const parseRawDelay = (delay) => {
    const parsedDelay = Math.floor(parseInt(delay, 10));
    return typeof parsedDelay === 'number' && !nativeIsNaN(parsedDelay) ? parsedDelay : delay;
};

/**
 * Checks whether 'callback' and 'delay' are matching
 * by given parameters 'matchCallback' and 'matchDelay'.
 * Used for prevent-setTimeout and prevent-setInterval.
 *
 * @param {Object} preventData set of data to determine if scriptlet should match
 * @param {Function} preventData.callback method's callback arg
 * @param {any} preventData.delay method's delay arg
 * @param {string} preventData.matchCallback scriptlets's callback arg
 * @param {string} preventData.matchDelay scriptlets's delay arg
 * @returns {boolean} if scriptlet should match
 */
export const isPreventionNeeded = ({
    callback,
    delay,
    matchCallback,
    matchDelay,
}) => {
    // if callback is has not valid type
    // scriptlet can not prevent it
    // so no need for more checking and do not call hit() later
    if (!isValidCallback(callback)) {
        return false;
    }
    if (!isValidMatchStr(matchCallback)
        || (matchDelay && !isValidMatchNumber(matchDelay))) {
        return false;
    }

    const { isInvertedMatch, matchRegexp } = parseMatchArg(matchCallback);
    const { isInvertedDelayMatch, delayMatch } = parseDelayArg(matchDelay);

    // Parse delay for decimal, string and non-number values
    // https://github.com/AdguardTeam/Scriptlets/issues/247
    const parsedDelay = parseRawDelay(delay);

    let shouldPrevent = false;
    // https://github.com/AdguardTeam/Scriptlets/issues/105
    const callbackStr = String(callback);
    if (delayMatch === null) {
        shouldPrevent = matchRegexp.test(callbackStr) !== isInvertedMatch;
    } else if (!matchCallback) {
        shouldPrevent = (parsedDelay === delayMatch) !== isInvertedDelayMatch;
    } else {
        shouldPrevent = matchRegexp.test(callbackStr) !== isInvertedMatch
            && (parsedDelay === delayMatch) !== isInvertedDelayMatch;
    }
    return shouldPrevent;
};
