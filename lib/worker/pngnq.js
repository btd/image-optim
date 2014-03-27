var Worker = require('../worker');

function PngNqWorker(options) {
    Worker.apply(this, arguments);
}

PngNqWorker.prototype = Object.create(Worker.prototype);

PngNqWorker.prototype.toolName = 'pngnq';

PngNqWorker.prototype.manyFiles = true;

PngNqWorker.prototype.versionOption = '-V 2>&1';


PngNqWorker.prototype.args = function(files) {
    return [
      '-s ' + this.options.level,
      '-Q ' + (this.options.quantization ? 'f' : 'n'),
      '-f',
      '-n ' + this.options.colors
    ].concat(files);
}

module.exports = PngNqWorker;