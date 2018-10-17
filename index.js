const rollup = require('rollup');
const path = require('path');

const outputDefaults = {
    format: 'es'
};

function handleSuccess(responses, logger) {
    const bundleCount = responses.reduce((accum, outputs) => {
        return accum + outputs.reduce((accum, output) => {
            return accum + Object.keys(output.output).length;
        }, 0);
    }, 0);

    logger.info(`${bundleCount} bundle${bundleCount === 1 ? '' : 's'} built.`);
    
    return {
        status: 'complete'
    };
}

function handleError(message) {
    return Promise.reject(message);
}

function logBuiltBundles(response, outputOptions, logger) {
    Object.keys(response.output).forEach(key => {
        const bundleFilepath = outputOptions.file ? 
            outputOptions.file : 
            path.join(outputOptions.dir, response.output[key].fileName);
        logger.info(`Built bundle "${bundleFilepath}".`);
    });
}

function outputBundleFiles(bundle, output, logger) {
    const outputs = Array.isArray(output) ? output : [output];
    return Promise.all(outputs.map(outputItem => {
        const outputOptions = {
            ...outputDefaults,
            ...outputItem
        };
        
        return bundle.write(outputOptions)
            .then(response => {
                logBuiltBundles(response, outputOptions, logger);
                return response;
            });
    }));
}

async function buildBundles({input, output, plugins = [], ...options}, logger) {
    if(!input || !output) {
        return handleError('Error: Configuration does not have input and output properties.');
    }

    const inputOptions = {
        input,
        plugins,
        ...options
    };

    const bundle = await rollup.rollup(inputOptions);
    return outputBundleFiles(bundle, output, logger);
}

function run(config, {logger}) {
    const rollupConfigs = Array.isArray(config) ? config : [config];

    return Promise.all(rollupConfigs.map(rollupConfig => buildBundles(rollupConfig, logger)))
        .then(responses => handleSuccess(responses, logger))
        .catch(handleError)
}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);