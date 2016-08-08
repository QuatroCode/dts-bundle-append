"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const glob = require('glob');
const fs = require('fs');
const path = require('path');
const EOL = "\r\n";
class Append {
    constructor(append, out) {
        this.main(append, out);
    }
    main(append, out) {
        return __awaiter(this, void 0, void 0, function* () {
            let globPattern = this.generateAppendGlobPattern(append);
            let filesList = yield this.getFilesListByGlobPattern(globPattern);
            filesList = this.filterOnlyDTsFiles(filesList);
            if (filesList.length === 0) {
                console.warn("[ERROR] Empty files list.");
                process.exit(1);
            }
            let outFileStream = yield this.getDtsBundleFileStream(out);
            let statistics = yield this.appendFiles(filesList, outFileStream);
            outFileStream.close();
            console.log("Successfully appended", statistics.Success, this.fileWordEnding(statistics.Success) + ".");
            if (statistics.Failed > 0) {
                console.log("Failed to append", statistics.Failed, this.fileWordEnding(statistics.Success) + ".");
            }
        });
    }
    fileWordEnding(count) {
        if (count === 1) {
            return "file";
        }
        else {
            return "files";
        }
    }
    appendFiles(files, outStream) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let counter = 0, success = 0;
                files.forEach((file) => __awaiter(this, void 0, void 0, function* () {
                    let data = yield this.readAppendFile(file);
                    counter++;
                    if (data) {
                        let fileHeader = EOL.repeat(2);
                        fileHeader += "// " + file;
                        fileHeader += EOL.repeat(2);
                        if (outStream.write(fileHeader + data)) {
                            success++;
                        }
                    }
                    if (counter === files.length) {
                        resolve({ Total: counter, Success: success, Failed: counter - success });
                    }
                }));
            });
        });
    }
    readAppendFile(file) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                fs.readFile(file, "utf8", (err, data) => {
                    if (err) {
                        console.log(err.message);
                        resolve(undefined);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        });
    }
    filterOnlyDTsFiles(files) {
        return files.filter(file => {
            let parse = path.parse(file);
            if (parse.ext === ".ts") {
                let extName = path.extname(parse.name);
                if (extName === ".d") {
                    return true;
                }
            }
            console.warn(`[WARNING] Skipping file '${file}'`);
            return false;
        });
    }
    getDtsBundleFileStream(out) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                fs.access(out, fs.W_OK, (err) => {
                    if (err) {
                        console.log(err.message);
                    }
                    else {
                        resolve(fs.createWriteStream(out, { flags: "a", encoding: "utf8" }));
                    }
                });
            });
        });
    }
    generateAppendGlobPattern(append) {
        if (typeof append === "string") {
            return append;
        }
        else if (append.length === 1) {
            return append[0];
        }
        else {
            return `+(${append.join("|")})`;
        }
    }
    getFilesListByGlobPattern(globPattern) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                glob(globPattern, (err, matches) => {
                    if (err) {
                        console.error(err.message);
                    }
                    else {
                        if (matches.length > 0) {
                            resolve(matches);
                        }
                        else {
                            console.warn(`[WARNING] Didn't find any file by glob pattern '${globPattern}'`);
                            process.exit(1);
                        }
                    }
                });
            });
        });
    }
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Append;
