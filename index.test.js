const skeletorRollup = require('./index');

let rollup;
jest.mock('rollup');
jest.mock('path');

const logger = {
    info: () => {},
    error: () => {}
};
const options = {logger};

describe('rollup plugin', () => {

    beforeEach(() => {
        rollup = require('rollup');
    });

    afterEach(() => {
        rollup.__clearFakeBundle();
    });

    it('should error if no bundles defined', () => {
        const logErrorSpy = jest.spyOn(logger, 'error');
        const config = {};
        const expectedErrorMessage = 'Error: No bundle configurations found.';
        const expectedResponse = {
            status: 'error',
            message: expectedErrorMessage
        };
        return skeletorRollup().run(config, options).catch(resp => {
            expect(logErrorSpy).toHaveBeenCalledTimes(1);
            expect(logErrorSpy).toHaveBeenCalledWith(expectedErrorMessage);
            expect(resp).toEqual(expectedResponse);
        });
    });

    it('should create input options', () => {
        const config = {
            bundles: [{
                entry: 'source/test.txt',
                dest: 'public/test.txt'
            }]
        };
        const expectedResponse = {
            input: 'source/test.txt'
        };
        return skeletorRollup().run(config, options).then(() => {
            const inputOpts = rollup.__getFakeBundle().input;
            expect(inputOpts).toEqual(expectedResponse);
        });
    });

    it('should create output options', () => {
        const config = {
            bundles: [{
                entry: 'source/test.txt',
                dest: 'public/test.txt',
                format: 'iffe'
            }]
        };
        const expectedResponse = {
            file: 'public/test.txt',
            format: 'iffe'
        };
        return skeletorRollup().run(config, options).then(() => {
            const inputOpts = rollup.__getFakeBundle().output;
            expect(inputOpts).toEqual(expectedResponse);
        });
    });

    it('should default format to "es"', () => {
        const config = {
            bundles: [{
                entry: 'source/test.txt',
                dest: 'public/test.txt'
            }]
        };
        const expectedResponse = {
            file: 'public/test.txt',
            format: 'es'
        };
        return skeletorRollup().run(config, options).then(() => {
            const inputOpts = rollup.__getFakeBundle().output;
            expect(inputOpts).toEqual(expectedResponse);
        });
    });

    it('should log when bundles are complete', () => {
        const config = {
            bundles: [{
                entry: 'source/test.txt',
                dest: 'public/test.txt'
            }]
        };
        const logSpy = jest.spyOn(logger, 'info');
        const expectedResponse = {
            status: 'complete'
        };
        return skeletorRollup().run(config, options).then(resp => {
            expect(logSpy).toHaveBeenCalledTimes(1);
            expect(logSpy).toHaveBeenCalledWith('1 bundle complete.');
            expect(resp).toEqual(expectedResponse);
        });
    });

    it('should handle buildBundle error gracefully', () => {
        const config = {
            bundles: [{
                entry: 'source/test.txt',
                dest: 'error'
            }]
        };
        const errSpy = jest.spyOn(logger, 'error');
        const errMessage = 'Error: Could not resolve entry (error)';
        const expectedResponse = {
            status: 'error',
            message: errMessage
        };
        return skeletorRollup().run(config, options).catch(err => {
            expect(errSpy).toHaveBeenCalledTimes(1);
            expect(errSpy).toHaveBeenCalledWith(errMessage)
            expect(err).toEqual(expectedResponse);
        });
    });
});