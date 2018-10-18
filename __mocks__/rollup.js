let __fakeBundle = {
    write: jest.fn(write)
};

const rollup = {
    rollup: jest.fn(() => Promise.resolve(__fakeBundle))
};

function write(outputOpts) {
    if (outputOpts.file === 'error') {
        return Promise.reject('Error: Could not resolve entry (error)');
    }

    //Writing a bundle with code splitting produces a different response structure
    if(outputOpts.dir) {
        return Promise.resolve({
            output: {
                bundle: {
                    fileName: 'bundle.js'
                }
            }
        });
    }

    return Promise.resolve({
        fileName: 'bundle.js'
    });
}

function __getFakeBundle() {
    return __fakeBundle;
}

function __clearFakeBundle() {
    __fakeBundle.write.mockClear();
}

rollup.__clearFakeBundle = __clearFakeBundle;
rollup.__getFakeBundle = __getFakeBundle;
module.exports = rollup;