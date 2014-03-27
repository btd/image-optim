var Worker = require('../worker');

function JpegTranWorker(options) {
    Worker.apply(this, arguments);
}

JpegTranWorker.prototype = Object.create(Worker.prototype);

JpegTranWorker.prototype.toolName = 'jpegtran';

JpegTranWorker.prototype.manyFiles = false;

JpegTranWorker.prototype.versionOption = '-v - 2>&1';

JpegTranWorker.prototype.versionRegex = /version (\d\w?|\d\.\d.\d)/;

JpegTranWorker.prototype.checkExitCode = function(code) {
    return code != 0 && code != 1;
}

JpegTranWorker.prototype.args = function (files) {
    return [
        '-copy ' + (this.options.copyAll ? 'all' : 'none'),
        '-optimize',
        (this.options.progressive ? '-progressive' : ''),
        '-outfile ' + files[1]
    ].concat([files[0]]);
};

module.exports = JpegTranWorker;