const skeletorRollup = require('./index');

let rollup;
jest.mock('rollup');
jest.mock('path');
jest.mock('rollup-plugin-babel');
jest.mock('rollup-plugin-commonjs');
jest.mock('rollup-plugin-node-resolve');

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
            plugins: ['rollup-plugin-babel', 'rollup-plugin-node-resolve', 'rollup-plugin-commonjs']
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
        const errMessage = 'Error: Could not resolve entry (error)';
        return skeletorRollup().run(config, options).catch(err => {
            expect(err).toEqual(errMessage);
        });
    });

    describe('should pass correct config to rollup plugins', () => {

        it('babel plugin', () => {
            const babelPlugin = require('./__mocks__/rollup-plugin-babel');
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: {
                    babel: {
                        exclude: 'test'
                    }
                }
            };
            const expectedResponse = {
                exclude: 'test'
            };
            return skeletorRollup().run(config, options).then(() => {
                expect(babelPlugin.__getConfig()).toEqual(expectedResponse);
            });
        });

        it('node resolve plugin', () => {
            const nodeResolvePlugin = require('./__mocks__/rollup-plugin-node-resolve');
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: {
                    nodeResolve: {
                        modulesOnly: true
                    }
                }
            };
            const expectedResponse = {
                browser: true,
                modulesOnly: true
            };
            return skeletorRollup().run(config, options).then(() => {
                expect(nodeResolvePlugin.__getConfig()).toEqual(expectedResponse);
            });
        });

        it('node resolve plugin', () => {
            const commonJsPlugin = require('./__mocks__/rollup-plugin-commonjs');
            const config = {
                bundles: [{
                    entry: 'source/test.txt',
                    dest: 'public/test.txt'
                }],
                rollupPlugins: {
                    commonJs: {
                        extensions: ['.js', '.coffee']
                    }
                }
            };
            const expectedResponse = {
                extensions: ['.js', '.coffee']
            };
            return skeletorRollup().run(config, options).then(() => {
                expect(commonJsPlugin.__getConfig()).toEqual(expectedResponse);
            });
        });
    });
});