#!/usr/bin/env node
import Arguments, { ArgOptions } from './arguments';
import Append from './append';
import * as fs from 'fs';
import * as path from 'path';

interface DtsBundleAppendOptions extends DtsBundleOptions {
    append: string | Array<string>;
}

export interface DtsBundleOptions {
    main?: string;
    name?: string;
    baseDir?: string;
    out?: string;
    newline?: string;
    indent?: string;
    outputAsModuleFolder?: boolean;
    prefix?: string;
    separator?: string;
    externals?: boolean;
    exclude?: { (file: string): boolean; } | RegExp;
    removeSource?: boolean;
    verbose?: boolean;
    referenceExternals?: boolean;
    emitOnIncludedFileNotFound?: boolean;
    emitOnNoIncludedFileNotFound?: boolean;
    headerPath?: string;
}


class Cli {
    constructor(argv: ArgOptions) {
        this.startCli(argv);
    }


    private async startCli(argv: ArgOptions) {
        let argvCheck = await this.checkArguments(argv);
        if (argvCheck.valid) {
            let append: string | Array<string>,
                out: string,
                baseDir: string;
            if (argv.append != null && argv.out != null && argv.out.length > 0 && argv.baseDir != null && argv.baseDir.length > 0) {
                out = argv.out;
                append = argv.append;
                baseDir = argv.baseDir || undefined;
            } else {
                let dtsConfig = await this.readDtsBundleConfig(argv.configJson);
                out = argv.out || dtsConfig.out || this.addDTsExtension(dtsConfig.name);
                append = argv.append || dtsConfig.append;
                baseDir = argv.baseDir || dtsConfig.baseDir || undefined;
            }

            if (this.checkGeneratedArguments(append, out)) {
                if (baseDir !== undefined) {
                    out = path.join(baseDir, out);
                }
                new Append(append, out);
            }
        } else {
            this.throwError("[ERROR] " + argvCheck.errorMessage);
        }
    }

    private addDTsExtension(name: string): string | undefined {
        if (name != null) {
            return `${name}.d.ts`;
        }
        return undefined;
    }

    private checkGeneratedArguments(append: string | Array<string>, out: string) {
        if (append == null) {
            this.throwError("[ERROR] Append files list not specified");
        }
        if (out == null) {
            this.throwError("[ERROR] Out file not specified");
        }
        return true;
    }

    private async checkArguments(argv: ArgOptions) {
        return new Promise<{ valid: boolean, errorMessage?: string }>(resolve => {
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
    }

    private async readDtsBundleConfig(fileName: string) {
        return new Promise<DtsBundleAppendOptions>(async resolve => {
            var file;

            let r = await fs.readFile(fileName, 'utf8', (fsErr, data) => {
                if (fsErr) {
                    this.throwError(`[ERROR] Config file '${fileName}' was not found.`);
                } else {
                    try {
                        let jsonData = JSON.parse(data);
                        resolve(jsonData);
                    } catch (tryError) {
                        this.throwError(`[ERROR] Config file '${fileName}' is not valid.`);
                    }
                }
            });
        });
    }

    private throwError(text: string) {
        console.error(text);
        process.exit(1);
    }
}

new Cli(Arguments);
