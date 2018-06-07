const rollup = require('rollup');
const path = require('path');

async function buildBundle(config) {

    const inputOpts = {
        input: path.resolve(config.entry)
    };
    const outputOpts = {
        file: path.resolve(config.dest),
        format: config.format || 'es'
    };
    const bundle = await rollup.rollup(inputOpts);

    return bundle.write(outputOpts);
}

function run(config, {logger}) {

    if (config.bundles) {
        const bundlePromises = config.bundles.map(bundleConfig => {
            buildBundle(bundleConfig);
        });
        return Promise.all(bundlePromises).then(responses => {
            logger.info(`${responses.length} bundles complete.`);
            return {
                status: 'complete'
            };
        });
    }

    const errorMessage = 'No bundle configurations found.';
    logger.error(`Error: ${errorMessage}`);
    return Promise.reject({
        status: 'error',
        message: errorMessage
    });

}

module.exports = skeletorLocalServer = () => (
    {
        run
    }
);