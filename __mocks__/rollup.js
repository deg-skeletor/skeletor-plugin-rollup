let __fakeBundle = {};

const rollup = {

        rollup: rollupFn

};

function rollupFn(inputOpts) {
    __fakeBundle = {
        ...__fakeBundle,
        input: inputOpts
    };

    return Promise.resolve({
        write
    });
}

function write(outputOpts) {
    __fakeBundle = {
        ...__fakeBundle,
        output: outputOpts
    };

    if (outputOpts.file === 'error') {
        Promise.reject('Error: Could not resolve entry (error)');
    }

    return Promise.resolve();
}

function __getFakeBundle() {
    return __fakeBundle;
}

function __clearFakeBundle() {
    __fakeBundle = {};
}

rollup.__clearFakeBundle = __clearFakeBundle;
rollup.__getFakeBundle = __getFakeBundle;
module.exports = rollup;