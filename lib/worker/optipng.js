var Worker = require('../worker');

function OptiPngWorker(options) {
    Worker.apply(this, arguments);
}

OptiPngWorker.prototype = Object.create(Worker.prototype);

OptiPngWorker.prototype.toolName = 'optipng';

OptiPngWorker.prototype.manyFiles = true;

OptiPngWorker.prototype.versionRegex = /([\d\.]+)/;

OptiPngWorker.prototype.args = function(files) {
    return ['-o' + this.options.level, '--quiet'].concat(files);
}

module.exports = OptiPngWorker;