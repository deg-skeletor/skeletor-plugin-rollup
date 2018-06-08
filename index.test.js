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
        const config = {};
        const expectedErrorMessage = 'Error: No bundle configurations found.';
        return skeletorRollup().run(config, options).catch(resp => {
            expect(resp).toEqual(expectedErrorMessage);
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
            input: 'source/test.txt',
            plugins: []
        };
        return skeletorRollup().run(config, options).then(() => {
            const inputOpts = rollup.__getFakeBundle().input;
            expect(inputOpts).toEqual(expectedResponse);
        });
    });

    describe('rollup plugins', () => {
        it('should create array of plugins', () => {
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: [
                    {
                        module: require('./__mocks__/rollup-plugin')
                    },
                    {
                        module: require('./__mocks__/rollup-plugin')
                    }
                ]
            };
            const expectedResponse = {
                input: 'source/test.txt',
                plugins: ['rollup-plugin', 'rollup-plugin']
            };
            return skeletorRollup().run(config, options).then(() => {
                const inputOpts = rollup.__getFakeBundle().input;
                expect(inputOpts).toEqual(expectedResponse);
            });
        });

        it('should default plugin config to empty object', () => {
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: [
                    {
                        module: require('./__mocks__/rollup-plugin')
                    }
                ]
            };
            const mockPlugin = require('./__mocks__/rollup-plugin');

            return skeletorRollup().run(config, options).then(() => {
                expect(mockPlugin.__getConfig()).toEqual({});
            });
        });

        it('should call plugin with passed in config', () => {
            const expectedResponse = {
                prop: 'test'
            };
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: [
                    {
                        module: require('./__mocks__/rollup-plugin'),
                        pluginConfig: expectedResponse
                    }
                ]
            };
            const mockPlugin = require('./__mocks__/rollup-plugin');

            return skeletorRollup().run(config, options).then(() => {
                expect(mockPlugin.__getConfig()).toEqual(expectedResponse);
            });
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
        const errMessage = 'Error: Could not resolve entry (error)';
        return skeletorRollup().run(config, options).catch(err => {
            expect(err).toEqual(errMessage);
        });
    });

});