var Worker = require('../worker');

function JpegOptimWorker(options) {
    Worker.apply(this, arguments);
}

JpegOptimWorker.prototype = Object.create(Worker.prototype);

JpegOptimWorker.prototype.toolName = 'jpegoptim';

JpegOptimWorker.prototype.manyFiles = true;

JpegOptimWorker.prototype.args = function (files) {
    return [
        '-m' + this.options.quality ,
        '-q'
        ].concat(this.options.strip.map(function (o) {
            return '--strip-' + o;
        }))
        .concat(files);
};

module.exports = JpegOptimWorker;