var Worker = require('../worker');

function SvgOWorker(options) {
    Worker.apply(this, arguments);
}

SvgOWorker.prototype = Object.create(Worker.prototype);

SvgOWorker.prototype.toolName = 'svgo';

SvgOWorker.prototype.versionOption = '-v';

SvgOWorker.prototype.args = function (files) {
    return files;
};

module.exports = SvgOWorker;