const rollup = require('rollup');
const path = require('path');

function handleError(message) {
    return Promise.reject(message);
}

function formatPlugins(listOfPlugins) {
    return listOfPlugins.map(plugin => {
        return plugin.module(plugin.pluginConfig || {});
    });
}

async function buildBundle(bundleConfig, pluginsFromConfig = []) {
    // only transpile not in development?
    const inputOpts = {
        input: path.resolve(bundleConfig.entry),
        plugins: formatPlugins(pluginsFromConfig)
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
            .catch(handleError);
    }

    return handleError('Error: No bundle configurations found.');
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);