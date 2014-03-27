var Worker = require('../worker');

function AdvPngWorker(options) {
    Worker.apply(this, arguments);
}

AdvPngWorker.prototype = Object.create(Worker.prototype);

AdvPngWorker.prototype.toolName = 'advpng';

AdvPngWorker.prototype.type = 'png';

AdvPngWorker.prototype.manyFiles = true;

AdvPngWorker.prototype.args = function(files) {
    return ['-' + this.options.level, '-z', '-q'].concat(files);
};

AdvPngWorker.prototype.check = function(callback) {
    var that = this;
    Worker.prototype.check.call(this, function(res) {
        if(res) {
            that.version(function(err, version) {
                if(version < '1.17') {
                    console.warn('advpng %s does not use zopfli', version);
                    callback(false);
                } else callback(true);
            });
        } else {
            callback(false);
        }
    })
}

module.exports = AdvPngWorker;