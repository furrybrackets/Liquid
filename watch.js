import chokidar from 'chokidar';

export function watchFiles(path, callback) {
    const watcher = chokidar.watch(path, {
        persistent: true,
        ignore: /(^|[\/\\])\../,
        interval: 500,
        awaitWriteFinish: true,
        ignoreInitial: true
    });

    watcher.on('add', (path, stats) => {
        callback('add', path, stats);
    });

    watcher.on('change', (path, stats) => {
        callback('change', path, stats);
    });

    watcher.on('unlink', (path) => {
        callback('unlink', path);
    });

    watcher.on('error', (path) => {
        callback('error', path);
    });

    watcher.on('addDir', (path, stats) => {
        callback('addDir', path, stats);
    });

    watcher.on('unlinkDir', (path) => {
        callback('unlinkDir', (path));
    });
}