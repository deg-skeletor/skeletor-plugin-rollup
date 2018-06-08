let __config = {};

const mockModule = jest.fn(config => {
    __config = config;
    return 'rollup-plugin';
});

mockModule.__getConfig = () => __config;
module.exports = mockModule;