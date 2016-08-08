# dts-bundle-append 
[![NPM version](http://img.shields.io/npm/v/dts-bundle-append.svg)](https://www.npmjs.com/package/dts-bundle-append) [![dependencies Status](https://david-dm.org/quatrocode/dts-bundle-append/status.svg)](https://david-dm.org/quatrocode/dts-bundle-append) [![devDependencies Status](https://david-dm.org/quatrocode/dts-bundle-append/dev-status.svg)](https://david-dm.org/quatrocode/dts-bundle-append?type=dev)

Append custom `d.ts` files into one `d.ts` file bundled by [dts-bundle](https://github.com/TypeStrong/dts-bundle). 

## Usage
1) Install from npm:
```cmd
npm install dts-bundle-append
```
2) Run `dts-bundle`.

3) After `d.ts` file bundled, run `dts-bundle-append`.

## Requirements
[NodeJS](https://nodejs.org/): >= 6.0.0 

## Configuration
Default configuration are taken from a `dts-bundle.json` file.

Also, you can specify a custom config file (see [#command-line](#command-line)).

### Configuration options
| Argument     | Type                           | Description                                                                                                                                                                |
|--------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| append       | `string | Array<string>`       | Specifies a list of glob patterns that match `d.ts` files to be appended in bundled `d.ts` file. Read more about [globs](https://github.com/isaacs/node-glob#glob-primer). |

*All other configuration options available from `dts-bundle` (read more [TypeStrong/dts-bundle#options](https://github.com/TypeStrong/dts-bundle#options)).


### Configuration example
```json
{
    "name": "module-name",
    "main": "dist/main.d.ts",
    "out": "module-name.d.ts",
    "baseDir": "dist",
    "append": [
      "src/global.d.ts"
    ]
}
```

## Command line
```cmd
Usage: dts-bundle-append [options]

Options:
  --help        Show help                                                    [boolean]
  --version     Show version number                                          [boolean]
  --append      Append files to global                                        [string]
  --out         dts-bundle bundled out file                                   [string]
  --configJson  dts-bundle configuration file    [string] [default: "dts-bundle.json"]
  --baseDir     dts-bundle base directory                                     [string]
  ```

## License
[GPL-3.0](LICENSE)
