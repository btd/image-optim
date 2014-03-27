var merge = require('lodash.merge');
var groupBy = require('lodash.groupby');
var path = require('path');

var async = require('async');

var defaultOptions = {
    'advpng': {
        bin: 'advpng',
        level: 4//max better, 0..4
    },
    'optipng': {
        bin: 'optipng',
        level: 7//max better, 0..7
    },
    'pngquant': {
        bin: 'pngquant',
        quality: [0, 100],
        level: 1 //less better, 1..11
    },
    'pngcrush': {
        bin: 'pngcrush'
    },
    'pngout': {
        bin: 'pngout',
        level: 0 //less better, 0..4
    }
};

var workerNames = Object.keys(defaultOptions);

var types = {};
workerNames.forEach(function (t) {
    types[t] = require('./worker/' + t);
});

function makeWorker(name, options) {
    var Type = types[name];
    if (name && options && Type) {
        return new Type(options);
    }
}

function Runner(options) {
    options = merge({}, defaultOptions, options);
    this.workers = {
        '.png': ['pngquant', 'pngcrush', 'advpng', 'optipng', 'pngout'].map(function (name) {
            return makeWorker(name, options[name]);
        }).filter(Boolean)
    };
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