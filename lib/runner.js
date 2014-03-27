var merge = require('lodash.merge');
var groupBy = require('lodash.groupby');
var path = require('path');

var mv = require('mv');

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
    },
    'pngnq': {
        bin: 'pngnq',
        level: 1,
        colors: 256,
        quantization: false
    },
    'jpegtran': {
        bin: 'jpegtran',
        copyAll: false,
        progressive: true
    },
    'jpegoptim': {
        bin: 'jpegoptim',
        strip: ['all'],
        quality: 100// 0..100 - turn on lossy optimization
    },
    'gifsicle': {
        bin: 'gifsicle',
        interlace: false,
        level: 3
    },
    'svgo': {}
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

function makeWorkers(names, options) {
    return  names.map(function (name) {
        return makeWorker(name, options[name]);
    }).filter(Boolean)
}

function Runner(options) {
    options = merge({}, defaultOptions, options);
    this.workers = {
        '.png': makeWorkers(['pngnq', 'pngquant', 'pngcrush', 'advpng', 'optipng', 'pngout'], options),
        '.jpg': makeWorkers(['jpegoptim', 'jpegtran'], options),
        '.gif': makeWorkers(['gifsicle'], options),
        '.svg': makeWorkers(['svgo'], options)
    };

    this.alias('.jpeg', '.jpg');
}

Runner.prototype.alias = function (ext1, ext2) {
    this.workers[ext1] = this.workers[ext2];
};

/**
 *
 * @param {Array} files - list of images paths
 * @param {Object} options - options to pass around
 */
Runner.prototype.run = function (files, options, onEnd) {
    onEnd = onEnd || options;

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
                var optimizedFiles = filesByType[ext];
                async.forEachSeries(workers, function (worker, callback) {
                    worker.run(optimizedFiles, function (err, processedFiles) {
                        if (err) return callback(err);

                        optimizedFiles = processedFiles;
                        callback(null);
                    });
                }, function (err) {
                    if(!err) {
                        if(options.replace) {
                            async.times(filesByType[ext].length, function(idx, callback) {
                                mv(optimizedFiles[idx], filesByType[ext][idx], function(err) {
                                    callback(err, filesByType[ext][idx]);
                                })
                            }, function(err, files) {
                                onEnd(err, files);
                            })
                        } else {
                            onEnd(null, optimizedFiles);
                        }
                    } else {
                        onEnd(err);
                    }
                });
            }
        }, that);
    });
};

module.exports = Runner;