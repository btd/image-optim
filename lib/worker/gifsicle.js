var Worker = require('../worker');

function GifSicleWorker(options) {
    Worker.apply(this, arguments);
}

GifSicleWorker.prototype = Object.create(Worker.prototype);

GifSicleWorker.prototype.toolName = 'gifsicle';

GifSicleWorker.prototype.manyFiles = true;

GifSicleWorker.prototype.versionOption = '--version'

GifSicleWorker.prototype.args = function (files) {
    return [
        '-b',// batch mode - override input files
        '--no-comments',
        '--no-warnings',
        '--no-names',
        (this.options.interlace ? '-i' : ''),
        '-O' + this.options.level,
        '--same-delay',
        '--same-loopcount'
    ].concat(files);
};

module.exports = GifSicleWorker;