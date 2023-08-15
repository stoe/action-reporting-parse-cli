#!/usr/bin/env node

import fs from 'fs'
import chalk from 'chalk'
import meow from 'meow'
import open from 'open'
import yaml from 'js-yaml'

const {blue, bold, red, yellow} = chalk
const cli = meow(
  `
  ${bold('Usage')}
    ${blue(`action-reporting-parse-cli`)} ${yellow(`[options]`)}

  ${bold('Required options')}
    ${yellow(`--config`)}, ${yellow(`-c`)}      Path to config.yml file.
    ${yellow(`--data`)}, ${yellow(`-d`)}        Path to data directory.

  ${bold('Additional options')}
    ${yellow(`--open`)}, ${yellow(`-o`)}        Open the generated CSV file.

  ${bold('Helper options')}
    ${yellow(`--help`)}, ${yellow(`-h`)}        Print this help message.
    ${yellow(`--version`)}, ${yellow(`-v`)}     Print the CLI version.`,
  {
    booleanDefault: undefined,
    description: false,
    hardRejection: false,
    allowUnknownFlags: false,
    importMeta: import.meta,
    inferType: false,
    input: [],
    flags: {
      help: {
        type: 'boolean',
        shortFlag: 'h',
      },
      version: {
        type: 'boolean',
        shortFlag: 'v',
      },
      config: {
        type: 'string',
        shortFlag: 'c',
        required: true,
      },
      data: {
        type: 'string',
        shortFlag: 'd',
        required: true,
      },
      open: {
        type: 'boolean',
        shortFlag: 'o',
        default: false,
      },
    },
  },
)

// run
;(async () => {
  try {
    const {config, data, open: opn, help, version} = cli.flags

    help && cli.showHelp(0)
    version && cli.showVers

    if (!config) {
      throw new Error('Missing required flag: --config')
    }

    if (!data) {
      throw new Error('Missing required flag: --data')
    }

    // load config
    const {orgs, exclude} = yaml.load(fs.readFileSync(config, 'utf8'))

    // load *actions.json and merge into actions const
    const actions = []
    for (const file of fs.readdirSync(data)) {
      if (file.indexOf('actions.json') === -1) continue

      const json = JSON.parse(fs.readFileSync(`./data/${file}`, 'utf8'))
      actions.push(...json)
    }

    const tree = new Set()
    for (const action of actions) {
      const {owner, repo, uses} = action

      if (!tree[owner]) {
        tree[owner] = new Set()
      }

      if (!tree[owner][repo]) {
        tree[owner][repo] = new Set()
      }

      for (const use of uses) {
        if (use.indexOf('./') === 0) continue

        const [o, _r] = use.split('/')
        const [r] = _r.split('@')

        if (exclude.includes(`${o}/${r}`)) continue

        if (orgs.includes(o)) tree[owner][repo].add(`${o}/${r}`)
      }
    }

    // create csv from tree
    const csv = ['nwo,uses']

    for (const owner of Object.keys(tree)) {
      for (const repo of Object.keys(tree[owner])) {
        for (const use of tree[owner][repo]) {
          csv.push(`${owner}/${repo},${use}`)
        }
      }
    }

    // write csv to file if csv isn't empty
    if (csv.length >= 2) {
      console.log(`saving report CSV in ${blue('./uses.csv')}`)
      fs.writeFileSync('./uses.csv', csv.join('\n'))

      // open csv
      if (opn) open('./uses.csv')
    }
  } catch (error) {
    console.error(`\n  ${red('ERROR: %s')}`, error.message)
    // console.error(error.stack)
    cli.showHelp(1)
  }
})()
