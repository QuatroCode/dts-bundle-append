# dts-bundle-appends
Appends custom `d.ts` files into bundled `d.ts` file.

## Usage
1) Install from npm:
```cmd
npm install dts-bundle-appends
```
2) Run `dts-bundle`.

3) After `d.ts` file bundled, run `dts-bundle-appends`.
 

## Configuration
Default configuration are taken from a `dts-bundle.json` file.

Also, you can specify a custom config file (see [#command-line](#command-line)).

### Configuration options
| Argument     | Type                           | Description                                                                                                                                                          |
|--------------|--------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| appends      | `string | Array<string>`       | Specifies a list of glob patterns that match `d.ts` files to be appended in bundled `d.ts` file. Read more about [globs](https://github.com/isaacs/node-glob#glob-primer). |

*All other configuration options available from `dts-bundle` (read more [TypeStrong/dts-bundle#options](https://github.com/TypeStrong/dts-bundle#options)).


### Configuration example
```json
{
    "name": "module-name",
    "main": "dist/main.d.ts",
    "out": "module-name.d.ts",
    "baseDir": "dist",
    "appends": [
      "src/global.d.ts"
    ]
}
```

## Command line
```cmd
Usage: dts-bundle-appends [options]

Options:
  --help        Show help                                                    [boolean]
  --version     Show version number                                          [boolean]
  --appends     Appends files to global                                       [string]
  --out         dts-bundle bundled out file                                   [string]
  --configJson  dts-bundle configuration file    [string] [default: "dts-bundle.json"]
  --baseDir     dts-bundle base directory                                     [string]
  ```
