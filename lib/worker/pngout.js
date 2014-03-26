var Worker = require('../worker');

function PngOutWorker(options) {
    Worker.apply(this, arguments);
}

PngOutWorker.prototype = Object.create(Worker.prototype);

PngOutWorker.prototype.toolName = 'pngout';

PngOutWorker.prototype.manyFiles = false;

PngOutWorker.prototype.versionOption = '2>&1';

PngOutWorker.prototype.versionRegex = /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dev) (?: |\d)\d \d{4})/;

PngOutWorker.prototype.checkExitCode = function(code) {
    //see http://www.advsys.net/ken/util/pngout.htm
    return code != 0 || code != 1 || code != 2;
}

PngOutWorker.prototype.args = function(files) {
    return [
        '-q', //quiet
        '-y', //override yes?
        '-k0',
        '-s' + this.options.level//strategy to use
    ].concat(files);
}

module.exports = PngOutWorker;