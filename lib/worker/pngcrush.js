var Worker = require('../worker');

function PngCrushWorker(options) {
    Worker.apply(this, arguments);
}

PngCrushWorker.prototype = Object.create(Worker.prototype);

PngCrushWorker.prototype.toolName = 'pngcrush';

PngCrushWorker.prototype.manyFiles = false;

PngCrushWorker.prototype.type = 'png';

PngCrushWorker.prototype.versionOption = '-version 2>&1';

PngCrushWorker.prototype.args = function(files) {
    return [
        '-q', //quiet
        '-fix', //fix bad cases
        '-blacken', //remove color from transparent pixels
        '-brute', //try everything,
        '-reduce', //do lossless reduction
        '-rem alla' // remove everything that can be removed but not transparency
    ].concat(files);
}

module.exports = PngCrushWorker;