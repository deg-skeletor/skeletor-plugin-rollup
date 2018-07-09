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

function getEntryPath(bundleConfig) {
    return bundleConfig.entry || bundleConfig.input.entry;
}

function formatInputOpts(bundleConfig) {
    const inputConfigCpy = {...bundleConfig.input};

    if (bundleConfig.input && bundleConfig.input.entry) {
        delete inputConfigCpy.entry;
    }
    
    return inputConfigCpy;
}

async function buildBundle(bundleConfig, pluginsFromConfig = []) {

    const inputOpts = {
        input: path.resolve(getEntryPath(bundleConfig)),
        plugins: formatPlugins(pluginsFromConfig),
        ...formatInputOpts(bundleConfig)
    };
    const outputDefaults = {
        format: 'es'
    };

    try {
        const bundle = await rollup.rollup(inputOpts);
        const outputConfigs = Array.isArray(bundleConfig.output) ? bundleConfig.output : [bundleConfig.output];
        return Promise.all(outputConfigs.map(oConfig => {
            const outputOpts = {
                ...outputDefaults,
                ...oConfig
            };
            outputOpts.file = path.resolve(outputOpts.file);
            return bundle.write(outputOpts);
        }));
    } catch (e) {
        return Promise.reject(e);
    }

}

function run(config, {logger}) {
    if (config.bundles) {
        return Promise.all(config.bundles.map(bundleConfig => buildBundle(bundleConfig, config.rollupPlugins)))
            .then(responses => {
                const bundleCount = responses.reduce((accum, item) => {
                    return accum + item.length;
                }, 0);
                logger.info(`${bundleCount} bundle${bundleCount === 1 ? '' : 's'} complete.`);
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