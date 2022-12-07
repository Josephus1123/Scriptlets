import { noopPromiseResolve } from '../../src/helpers';

const { test, module } = QUnit;
const name = 'scriptlets-redirects helpers';

module(name);

test('Test noopPromiseResolve for valid response props', async (assert) => {
    const TEST_URL = 'url';
    const TEST_TYPE = 'opaque';
    const objResponse = await noopPromiseResolve('{}');
    const objBody = await objResponse.json();

    const arrResponse = await noopPromiseResolve('[]');
    const arrBody = await arrResponse.json();

    const responseWithUrl = await noopPromiseResolve('{}', TEST_URL);
    const responseWithType = await noopPromiseResolve('{}', '', TEST_TYPE);

    assert.ok(responseWithUrl.url === TEST_URL);
    assert.ok(typeof objBody === 'object' && !objBody.length);
    assert.ok(Array.isArray(arrBody) && !arrBody.length);
    assert.strictEqual(responseWithType.type, TEST_TYPE);
});