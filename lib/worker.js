var debug = require('debug')('worker');
var exec = require('child_process').exec;
var async = require('async');

var cp = require('cp');

var tmp = require('tmp');

var fs = require('fs');

function Worker(options) {
    this.bin = options.binPath[this.toolName];
    this.options = options.options[this.toolName];
}

//Worker.prototype.toolName = ...

Worker.prototype.version = function (callback) {
    var that = this;
    if (that.vers) return callback(null, that.vers);

    debug('try get version of ' + that.toolName);
    debug('exec ' + this.bin + ' ' + this.versionOption);
    exec(this.bin + ' ' + this.versionOption, function (err, stdout, stderr) {
        var m = stdout.match(that.versionRegex);
        that.vers = m && m[1];
        debug('Getting version ' + that.vers + ' of ' + that.toolName);
        callback(err && that.checkExitCode(err.code) ? err : null, that.vers);
    });
}

Worker.prototype.checkExitCode = function(code) {
    return code != 0;
}

Worker.prototype.versionRegex = /v?([\d\.,-]+)/;

//XXX shellwords
Worker.prototype.execCommand = function (files) {
    return this.bin + ' ' + this.args(files).join(' ');
}

Worker.prototype.run = function (files, onEnd) {
    var that = this;

    var fileMap = {};

    async.map(files, function (file, callback) {
        tmp.tmpName(function (err, tmpPath) {
            if (err) return callback(err);

            fileMap[tmpPath] = file;

            if (that.manyFiles) {
                cp(file, tmpPath, function (err) {
                    if (err) return callback(err);
                    callback(null, tmpPath);
                });
            } else {
                callback(null, tmpPath);
            }
        });

    }, function (err, tmpFiles) {
        if (err) return onEnd(err);

        debug('Created tmp files');

        if (that.manyFiles) {
            var cmd = that.execCommand(tmpFiles);

            debug('Exec: ' + cmd);
            exec(cmd, function (err, stdout, stderr) {
                if (err && that.checkExitCode(err.code)) return onEnd(err);

                debug('Finish');

                async.map(tmpFiles, function (tmpFile, callback) {
                    chooseSmallerFile(tmpFile, fileMap[tmpFile], function (err, file) {
                        callback(err, file);
                    })
                }, function (err, nextFiles) {
                    debug('Finish choose files');
                    onEnd(err, nextFiles);
                });
            })
        } else {
            async.mapLimit(tmpFiles, 2, function (tmpFile, callback) {
                var cmd = that.execCommand([fileMap[tmpFile], tmpFile]);

                debug('Exec: ' + cmd);
                exec(cmd, function (err, stdout, stderr) {
                    if (err && that.checkExitCode(err.code)) return callback(err);

                    debug('Finish');
                    chooseSmallerFile(tmpFile, fileMap[tmpFile], function (err, file) {
                        callback(err, file);
                    })
                })
            }, function (err, nextFiles) {
                debug('Finish choose files');
                onEnd(err, nextFiles);
            })
        }
    });

}

function chooseSmallerFile(file1, file2, callback) {
    fs.stat(file1, function (err, file1Stat) {
        if (err) return callback(err);

        fs.stat(file2, function (err, file2Stat) {
            if (err) return callback(err);

            callback(null, file1Stat.size < file2Stat.size ? file1 : file2);
        })
    })
}

Worker.prototype.versionOption = '-V';

Worker.prototype.check = function (callback) {
    this.version(function (err, version) {
        callback(!err);
    })
}

module.exports = Worker;