var merge = require('lodash.merge');
var groupBy = require('lodash.groupby');
var path = require('path');

var async = require('async');

var defaultOptions = {
    binPath: {
        'advpng': 'advpng',
        'optipng': 'optipng',
        'pngquant': 'pngquant',
        'pngcrush': 'pngcrush',
        'pngout': 'pngout'
    },

    options: {
        'advpng': {
            level: 4//max better, 0..4
        },
        'optipng': {
            level: 7//max better, 0..7
        },
        'pngquant': {
            level: 1 //less better, 1..11
        },
        'pngcrush': {},
        'pngout': {
            level: 0 //less better, 0..4
        }
    }
};

var AdvPng = require('./worker/advpng');
var OptiPng = require('./worker/optipng');
var PngQuant = require('./worker/pngquant');
var PngCrush = require('./worker/pngcrush');
var PngOut = require('./worker/pngout');

//XXX add filter by check
//XXX disable worker
function Runner(options) {
    options = merge({}, defaultOptions, options);
    this.workers = {
        '.png': [new PngCrush(options), new PngQuant(options), new AdvPng(options), new OptiPng(options), new PngOut(options)]
    }
}

/**
 *
 * @param {Array} files - list of images paths
 * @param {Object} options - options to pass around
 */
Runner.prototype.run = function (files, onEnd) {
    var that = this;
    //check workers
    async.forEach(Object.keys(this.workers), function (ext, callback) {
        var workers = that.workers[ext];

        async.filter(workers, function (worker, callback) {
            worker.check(callback);
        }, function (workers) {
            that.workers[ext] = workers;
            callback();
        });
    }, function () {

        var filesByType = groupBy(files, function (file) {
            return path.extname(file);
        });

        Object.keys(filesByType).forEach(function (ext) {
            var workers = this.workers[ext];
            if (workers) {
                var files = filesByType[ext];
                async.forEachSeries(workers, function (worker, callback) {
                    worker.run(files, function (err, processedFiles) {
                        if (err) return callback(err);

                        files = processedFiles;
                        callback(null);
                    });
                }, function (err) {
                    onEnd(err, files);
                });
            }
        }, that);
    });
}

module.exports = Runner;