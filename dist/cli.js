#!/usr/bin/env node
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const arguments_1 = require('./arguments');
const appends_1 = require('./appends');
const fs = require('fs');
const path = require('path');
class Cli {
    constructor(argv) {
        this.startCli(argv);
    }
    startCli(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            let argvCheck = yield this.checkArguments(argv);
            if (argvCheck.valid) {
                let appends, out, baseDir;
                if (argv.appends != null && argv.out != null && argv.out.length > 0) {
                    out = argv.out;
                    appends = argv.appends;
                    baseDir = argv.baseDir || undefined;
                }
                else {
                    let dtsConfig = yield this.readDtsBundleConfig(argv.configJson);
                    out = argv.out || dtsConfig.out || dtsConfig.name;
                    appends = argv.appends || dtsConfig.appends;
                    baseDir = argv.baseDir || dtsConfig.baseDir || undefined;
                }
                if (baseDir !== undefined) {
                    out = path.join(baseDir, out);
                }
                if (this.checkGeneratedArguments(appends, out)) {
                    new appends_1.default(appends, out);
                }
            }
            else {
                this.throwError("[ERROR] " + argvCheck.errorMessage);
            }
        });
    }
    checkGeneratedArguments(appends, out) {
        if (appends == null) {
            this.throwError("[ERROR] Appends files list not specified");
        }
        if (out == null) {
            this.throwError("[ERROR] Out file not specified");
        }
        return true;
    }
    checkArguments(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (argv.appends != null && argv.appends.length <= 0) {
                    resolve({ valid: false, errorMessage: `Invalid argument 'append'` });
                    return;
                }
                if (argv.out != null && argv.out.length <= 0) {
                    resolve({ valid: false, errorMessage: `Invalid argument 'out'` });
                    return;
                }
                if (argv.configJson != null && argv.configJson.length <= 0) {
                    resolve({ valid: false, errorMessage: `Invalid argument 'configJson'` });
                    return;
                }
                resolve({ valid: true });
            });
        });
    }
    readDtsBundleConfig(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                var file;
                let r = yield fs.readFile(fileName, 'utf8', (fsErr, data) => {
                    if (fsErr) {
                        this.throwError(`[ERROR] Config file '${fileName}' was not found.`);
                    }
                    else {
                        try {
                            let jsonData = JSON.parse(data);
                            resolve(jsonData);
                        }
                        catch (tryError) {
                            this.throwError(`[ERROR] Config file '${fileName}' is not valid.`);
                        }
                    }
                });
            }));
        });
    }
    throwError(text) {
        console.error(text);
        process.exit(1);
    }
}
new Cli(arguments_1.default);
