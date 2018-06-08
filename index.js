const rollup = require('rollup');
const path = require('path');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const resolve = require('rollup-plugin-node-resolve');

function handleError(message, logger) {
    logger.error(`${message}`);
    return Promise.resolve({
        status: 'error',
        message: message
    });
}

function getConfig(defaultConfig, userConfig = {}) {
    return {
        ...defaultConfig,
        ...userConfig
    };
}

async function buildBundle(bundleConfig, pluginConfig = {}) {
    // only transpile not in development?
    const inputOpts = {
        input: path.resolve(bundleConfig.entry),
        plugins: [
            babel(
                getConfig(require('./lib/babel.config'), pluginConfig.babel)
            ),
            resolve(
                getConfig(require('./lib/nodeResolve.config'), pluginConfig.nodeResolve)
            ),
            commonjs(
                getConfig(require('./lib/commonjs.config'), pluginConfig.commonJs)
            )
        ]
    };

    const outputOpts = {
        file: path.resolve(bundleConfig.dest),
        format: bundleConfig.format || 'es'
    };

    try {
        const bundle = await rollup.rollup(inputOpts);
        return bundle.write(outputOpts);
    } catch (e) {
        return Promise.reject(e);
    }

}

function run(config, {logger}) {
    if (config.bundles) {
        return Promise.all(config.bundles.map(bundleConfig => buildBundle(bundleConfig, config.rollupPlugins)))
            .then(responses => {
                logger.info(`${responses.length} bundle${responses.length === 1 ? '' : 's'} complete.`);
                return {
                    status: 'complete'
                };
            })
            .catch(e => handleError(e, logger));
    }

    return handleError('Error: No bundle configurations found.', logger);
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);