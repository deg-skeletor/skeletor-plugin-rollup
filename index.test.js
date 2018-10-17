const skeletorRollup = require('./index');
const fakeRollupPlugin = require('./__mocks__/rollup-plugin');

let rollup;
jest.mock('path');

const logger = {
    info: () => {},
    error: () => {}
};
const options = {logger};
const logSpy = jest.spyOn(logger, 'info');

beforeEach(() => {
    rollup = require('rollup');
});

afterEach(() => {
    rollup.__clearFakeBundle();
    rollup.rollup.mockClear();
    logSpy.mockReset();
});

describe('An error should be thrown', () => {
    it('if no input/outputs set is defined', async () => {
        const config = {};
        const expectedErrorMessage = 'Error: Configuration does not have input and output properties.';
        
        try {
            await skeletorRollup().run(config, options);
        } catch(e) {
            expect(e).toEqual(expectedErrorMessage);
        }
    });

    it('if a bundle fails to write', async () => {
        const config = {
            input: 'source/test.txt',
            output: [{
                file: 'error'
            }]
        };
        const errMessage = 'Error: Could not resolve entry (error)';
        try {
            await skeletorRollup().run(config, options);
        } catch (err) {
            expect(err).toEqual(errMessage);
        }
    });
});

describe('Rollup should receive the correct input options', () => {

    it('for a single input/output set', async () => {
        const config = {
            input: 'source/test.txt',
            output: [{
                file: 'public/test.txt'
            }],
            experimentalCodeSplitting: true,
            plugins: [fakeRollupPlugin(), fakeRollupPlugin()]
        };
        const expectedInputOptions = {
            input: 'source/test.txt',
            experimentalCodeSplitting: true,
            plugins: ['rollup-plugin', 'rollup-plugin']
        };

        await skeletorRollup().run(config, options);
        expect(rollup.rollup).toHaveBeenCalledTimes(1);
        expect(rollup.rollup).toHaveBeenCalledWith(expectedInputOptions);
    });

    it('for multiple input/output sets', async () => {
        const config = [
            {
                input: 'source/test1.txt',
                output: [{
                    file: 'public/test1.txt'
                }],
                experimentalCodeSplitting: true,
                plugins: [fakeRollupPlugin(), fakeRollupPlugin()]
            },
            {
                input: 'source/test2.txt',
                output: [{
                    file: 'public/test2.txt'
                }]
            }
        ];

        const expectedInputOptions1 = {
            input: 'source/test1.txt',
            experimentalCodeSplitting: true,
            plugins: ['rollup-plugin', 'rollup-plugin']
        };

        const expectedInputOptions2 = {
            input: 'source/test2.txt',
            plugins: []
        };

        await skeletorRollup().run(config, options);
        expect(rollup.rollup).toHaveBeenCalledTimes(2);
        expect(rollup.rollup).toHaveBeenCalledWith(expectedInputOptions1);
        expect(rollup.rollup).toHaveBeenCalledWith(expectedInputOptions2);
    });

    it('for an array of inputs', async () => {
        const config = {
            input: ['source/test1.txt', 'source/test2.txt'],
            output: [{
                file: 'public/test.txt'
            }],
            experimentalCodeSplitting: true,
            plugins: [fakeRollupPlugin(), fakeRollupPlugin()]
        };
        const expectedInputOptions = {
            input: ['source/test1.txt', 'source/test2.txt'],
            experimentalCodeSplitting: true,
            plugins: ['rollup-plugin', 'rollup-plugin']
        };

        await skeletorRollup().run(config, options);
        expect(rollup.rollup).toHaveBeenCalledTimes(1);
        expect(rollup.rollup).toHaveBeenCalledWith(expectedInputOptions);
    });
});

describe('Rollup should receive the correct output options', () => {
    it('for a single input/output set', async () => {
        const config = {
            input: 'source/test.txt',
            output: {
                file: 'public/test.txt',
                format: 'es'
            }
        };
        const expectedOutputOptions = {
            file: 'public/test.txt',
            format: 'es'
        };

        await skeletorRollup().run(config, options);

        const write = rollup.__getFakeBundle().write;
  
        expect(write).toHaveBeenCalledTimes(1);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions);
    });

    it('for a single input/output set with multiple outputs', async () => {
        const config = {
            input: 'source/test.txt',
            output: [
                {
                    file: 'public/test.txt',
                    format: 'es'
                },
                {
                    file: 'public/test-iife.txt',
                    format: 'iife'
                }
            ]
        };
        const expectedOutputOptions1 = {
            file: 'public/test.txt',
            format: 'es'
        };

        const expectedOutputOptions2 = {
            file: 'public/test-iife.txt',
            format: 'iife'
        };


        await skeletorRollup().run(config, options);

        const write = rollup.__getFakeBundle().write;
  
        expect(write).toHaveBeenCalledTimes(2);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions1);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions2);
    });

    it('for multiple input/output sets', async () => {
        const config = [
            {
                input: 'source/test1.txt',
                output: {
                    file: 'public/test1.txt',
                    format: 'es'
                }
            },
            {
                input: 'source/test2.txt',
                output: {
                    file: 'public/test2.txt',
                    format: 'es'
                }
            }
        ];
        const expectedOutputOptions1 = {
            file: 'public/test1.txt',
            format: 'es'
        };

        const expectedOutputOptions2 = {
            file: 'public/test2.txt',
            format: 'es'
        };

        await skeletorRollup().run(config, options);

        const write = rollup.__getFakeBundle().write;
  
        expect(write).toHaveBeenCalledTimes(2);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions1);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions2);
    });

    it('for an array of inputs', async () => {
        const config = {
            input: ['source/test.txt', 'source/test2.txt'],
            output: [
                {
                    dir: 'public',
                    format: 'es'
                },
                {
                    dir: 'public/no-modules',
                    format: 'iife'
                }
            ]
        };
        const expectedOutputOptions1 = {
            dir: 'public',
            format: 'es'
        };

        const expectedOutputOptions2 = {
            dir: 'public/no-modules',
            format: 'iife'
        };

        await skeletorRollup().run(config, options);

        const write = rollup.__getFakeBundle().write;

        expect(write).toHaveBeenCalledTimes(2);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions1);
        expect(write).toHaveBeenCalledWith(expectedOutputOptions2);
    });

    it('if no output format is specified', async () => {
        const config = {
            input: 'source/test.txt',
            output: [{
                file: 'public/test.txt'
            }]
        };
        const expectedOutputOptions = {
            file: 'public/test.txt',
            format: 'es'
        };

        await skeletorRollup().run(config, options);

        const write = rollup.__getFakeBundle().write;
  
        expect(write).toHaveBeenCalledWith(expectedOutputOptions);
    });
});

describe('a completion message should be logged', () => {
    it('when bundle building is complete', async () => {
        const config = {
            input: 'source/test.txt',
            output: [{
                file: 'public/test.txt'
            }]
        };
        const expectedStatusObject = {
            status: 'complete'
        };
        
        const statusObj = await skeletorRollup().run(config, options);
        expect(logSpy).toHaveBeenCalledTimes(2);
        expect(logSpy).toHaveBeenCalledWith('1 bundle built.');
        expect(statusObj).toEqual(expectedStatusObject);
    });

    it('with the correct number of built bundles', async () => {
        const config = {
            input: 'source/entry.js',
            output: [
                {
                    file: 'dist/main-bundle.js'
                },
                {
                    file: 'dist/main-bundle2.js',
                    format: 'iife'
                }
            ]
        };

        await skeletorRollup().run(config, options);
        expect(logSpy).toHaveBeenCalledTimes(3);
        expect(logSpy).toHaveBeenCalledWith('2 bundles built.');
    });
});