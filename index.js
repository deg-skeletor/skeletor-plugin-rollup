const rollup = require('rollup');
const path = require('path');

function handleError(message, logger) {
    logger.error(`${message}`);
    return Promise.resolve({
        status: 'error',
        message: message
    });
}

async function buildBundle(config) {
    const inputOpts = {
        input: path.resolve(config.entry)
    };
    const outputOpts = {
        file: path.resolve(config.dest),
        format: config.format || 'es'
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
        return Promise.all(config.bundles.map(bundleConfig => buildBundle(bundleConfig)))
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