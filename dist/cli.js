#!/usr/bin/env node
"use strict";
var fs_1 = require('mz/fs');
var index_1 = require('./index');
// require it instead of import till typings for stdin are not released
var stdin = require('stdin');
// require it instead of import till typings for minimist are kind of broken
var minimist = require('minimist');
var argv = minimist(process.argv.slice(2), {
    alias: {
        input: ['i'],
        output: ['o']
    }
});
var argIn = argv._[0] || argv['input'];
var argOut = argv._[1] || argv['output'];
function readInput() {
    if (!argIn) {
        return new Promise(function (resolve, reject) {
            stdin(function (str) {
                try {
                    resolve(str);
                }
                catch (err) {
                    reject(err);
                }
            });
        });
    }
    return fs_1.readFile(argIn);
}
function writeOutput(compiled) {
    if (!argOut) {
        try {
            process.stdout.write(compiled);
            return Promise.resolve();
        }
        catch (err) {
            return Promise.reject(err);
        }
    }
    return fs_1.writeFile(argOut, compiled);
}
readInput()
    .then(function (s) { return JSON.parse(s); })
    .then(function (schema) { return index_1.compile(schema, argIn); })
    .then(writeOutput)
    .then(function () { return process.exit(0); }, function (err) {
    process.stderr.write(err.message);
    process.exit(1);
});
//# sourceMappingURL=cli.js.map