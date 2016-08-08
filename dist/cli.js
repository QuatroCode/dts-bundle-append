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
const append_1 = require('./append');
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
                let append, out, baseDir;
                if (argv.append != null && argv.out != null && argv.out.length > 0 && argv.baseDir != null && argv.baseDir.length > 0) {
                    out = argv.out;
                    append = argv.append;
                    baseDir = argv.baseDir || undefined;
                }
                else {
                    let dtsConfig = yield this.readDtsBundleConfig(argv.configJson);
                    out = argv.out || dtsConfig.out || this.addDTsExtension(dtsConfig.name);
                    append = argv.append || dtsConfig.append;
                    baseDir = argv.baseDir || dtsConfig.baseDir || undefined;
                }
                if (this.checkGeneratedArguments(append, out)) {
                    if (baseDir !== undefined) {
                        out = path.join(baseDir, out);
                    }
                    new append_1.default(append, out);
                }
            }
            else {
                this.throwError("[ERROR] " + argvCheck.errorMessage);
            }
        });
    }
    addDTsExtension(name) {
        if (name != null) {
            return `${name}.d.ts`;
        }
        return undefined;
    }
    checkGeneratedArguments(append, out) {
        if (append == null) {
            this.throwError("[ERROR] Append files list not specified");
        }
        if (out == null) {
            this.throwError("[ERROR] Out file not specified");
        }
        return true;
    }
    checkArguments(argv) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (argv.append != null && argv.append.length <= 0) {
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
