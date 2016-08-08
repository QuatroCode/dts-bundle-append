"use strict";
const yargs = require('yargs');
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = yargs
    .help("help", "Show help")
    .version(() => {
    return `Current version: ${require('../package.json').version}`;
})
    .option('append', {
    describe: 'Append files to global',
    type: "string"
})
    .option("out", {
    describe: "dts-bundle bundled out file",
    type: "string"
})
    .option("configJson", {
    describe: "dts-bundle configuration file",
    default: "dts-bundle.json",
    type: "string"
})
    .option("baseDir", {
    describe: "dts-bundle base directory",
    type: "string"
})
    .usage('Usage: dts-bundle-append [options]')
    .argv;
