const rollup = require('rollup');
const path = require('path');
const flattenArray = require('./lib/utils').flattenArray;

const outputDefaults = {
    format: 'es'
};

function handleSuccess(responses, logger) {
    const flattenedResponses = flattenArray(responses);

    const bundleCount = flattenedResponses.reduce((acc, response) => {
        const count = response.output ? Object.keys(response.output).length : 1;
        return acc + count;
    }, 0);

    logger.info(`${bundleCount} bundle${bundleCount === 1 ? '' : 's'} built.`);
    
    return {
        status: 'complete'
    };
}

function handleError(message) {
    return Promise.reject(message);
}

function logBuiltBundle(filename, outputOptions, logger) {
    const bundleFilepath = outputOptions.file ? 
            outputOptions.file : 
            path.join(outputOptions.dir, filename);
    logger.info(`Built bundle "${bundleFilepath}".`);
}

function logBuiltBundles(response, outputOptions, logger) {
    if(response.output) {
        Object.keys(response.output).forEach(key => {
            logBuiltBundle(response.output[key].fileName, outputOptions, logger);
        });
    } else {
        logBuiltBundle(response.fileName, outputOptions, logger);
    }
}

async function outputBundleFiles(bundle, output, logger) {
    const outputs = Array.isArray(output) ? output : [output];

    const responses = [];

    //Use for...of so async bundle.write() calls run in sequence, not parallel
    for(const outputItem of outputs) {
        const outputOptions = {
            ...outputDefaults,
            ...outputItem
        };

        const response = await bundle.write(outputOptions)
        logBuiltBundles(response, outputOptions, logger);   

        responses.push(response);
    }

    return responses;
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