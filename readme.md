# action-reporting-parse-cli

[![Test](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/test.yml/badge.svg)](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/test.yml) [![CodeQL](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/github-code-scanning/codeql/badge.svg)](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/github-code-scanning/codeql) [![Publish](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/publish.yml/badge.svg)](https://github.com/stoe/action-reporting-parse-cli/actions/workflows/publish.yml) [![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

> CLI to report on GitHub Actions

## Usage example

```sh
$ npx @stoe/action-reporting-parse-cli [--options]
```

## Required options

- `--config`, `-c` Path to config.yml file.
- `--data`, `-d` Path to data directory.

## Additional options

- `--open`, `-o` Open the generated CSV file.

## Helper options

- `--help`, `-h` Print action-reporting-parse-cli help.
- `--version`, `-v` Print action-reporting-parse-cli version.

## Examples

```sh
# Run action-reporting-parse-cli with default options
$ npx @stoe/action-reporting-parse-cli \
  --config ./config.yml \
  --data ./data
```

```sh
# Run action-reporting-parse-cli with default options
# and open the generated CSV file
$ npx @stoe/action-reporting-parse-cli \
  --config ./config.yml \
  --data ./data \
  --open
```

## License

[MIT](./license) © [Stefan Stölzle](https://github.com/stoe)
