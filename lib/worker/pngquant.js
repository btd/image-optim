var Worker = require('../worker');

function PngQuantWorker(options) {
    Worker.apply(this, arguments);
}

PngQuantWorker.prototype = Object.create(Worker.prototype);

PngQuantWorker.prototype.toolName = 'pngquant';

PngQuantWorker.prototype.manyFiles = true;

PngQuantWorker.prototype.type = 'png';

PngQuantWorker.prototype.versionOption = '--version';

PngQuantWorker.prototype.versionRegex = /([\d\.]+)/;

PngQuantWorker.prototype.args = function (files) {
    return [
        '--speed ' + this.options.level,
        '-f',
        '--quality ' + this.options.quality.join('-')
    ].concat(files);
};

module.exports = PngQuantWorker;