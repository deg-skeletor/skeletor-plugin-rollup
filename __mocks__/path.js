function resolve(path) {
    return path;
}

function basename(path) {
    const parts = path.split('/');
    return parts[parts.length - 1];
}

function join(path1, path2) {
    return path1 + '/' + path2;
}

module.exports = {
    resolve,
    basename,
    join
};