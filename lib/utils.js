module.exports = {
    flattenArray: arr => arr.reduce((acc, val) => acc.concat(val), [])
};