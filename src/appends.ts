import * as glob from 'glob';
import * as fs from 'fs';
import * as path from 'path';

const EOL = "\r\n";

interface AppendsFilesResult {
    Total: number;
    Success: number;
    Failed: number;
}

export default class Appends {

    constructor(appends: string | Array<string>, out: string) {
        this.main(appends, out);
    }

    private async main(appends: string | Array<string>, out: string) {
        let globPattern = this.generateAppendGlobPattern(appends);
        let filesList = await this.getFilesListByGlobPattern(globPattern);
        filesList = this.filterOnlyDTsFiles(filesList);
        if (filesList.length === 0) {
            console.warn("[ERROR] Empty files list.");
            process.exit(1);
        }
        let outFileStream = await this.getDtsBundleFileStream(out);
        let statistics = await this.appendFiles(filesList, outFileStream);
        outFileStream.close();
        console.log("Successfully appended", statistics.Success, this.fileWordEnding(statistics.Success) + ".");
        if (statistics.Failed > 0) {
            console.log("Failed to append", statistics.Failed, this.fileWordEnding(statistics.Success) + ".");
        }
    }

    private fileWordEnding(count: number) {
        if (count === 1) {
            return "file";
        } else {
            return "files";
        }
    }

    private async appendFiles(files: Array<string>, outStream: fs.WriteStream) {
        return new Promise<AppendsFilesResult>(resolve => {
            let counter = 0,
                success = 0;
            files.forEach(async file => {
                let data = await this.readAppendFile(file);
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
            });
        });
    }

    private async readAppendFile(file: string) {
        return new Promise<string | undefined>(resolve => {
            fs.readFile(file, "utf8", (err, data) => {
                if (err) {
                    console.log(err.message);
                    resolve(undefined);
                } else {
                    resolve(data);
                }
            });
        });
    }

    private filterOnlyDTsFiles(files: Array<string>) {
        return files.filter(file => {
            let parse = path.parse(file);
            if (parse.ext === ".ts") {
                let extName = path.extname(parse.name)
                if (extName === ".d") {
                    return true;
                }
            }
            console.warn(`[WARNING] Skipping file '${file}'`);
            return false;
        });
    }

    private async getDtsBundleFileStream(out: string) {
        return new Promise<fs.WriteStream>(resolve => {
            fs.access(out, fs.W_OK, (err) => {
                if (err) {
                    console.log(err.message);
                } else {
                    resolve(fs.createWriteStream(out, { flags: "a", encoding: "utf8" }));
                }
            });
        });
    }

    private generateAppendGlobPattern(appends: string | Array<string>) {
        if (typeof appends === "string") {
            return appends;
        } else if (appends.length === 1) {
            return appends[0];
        } else {
            return `+(${appends.join("|")})`;
        }
    }


    private async getFilesListByGlobPattern(globPattern: string) {
        return new Promise<Array<string>>(resolve => {
            glob(globPattern, (err, matches) => {
                if (err) {
                    console.error(err.message);
                } else {
                    if (matches.length > 0) {
                        resolve(matches);
                    } else {
                        console.warn(`[WARNING] Didn't find any file by glob pattern '${globPattern}'`);
                        process.exit(1);
                    }
                }
            });
        });
    }

}