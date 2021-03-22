#!/usr/bin/env node

const pkg = require('../package.json')
const emitter = require('..')

function printVersion() {
  console.log('music-cli' + pkg.version)
  process.exit()
}

function printHelp(code) {
  const lines = ['', '  Usage:', '    music-cli [songName]', '', '  Options:', '    -v, --version    print the version of music-cli', '    -h, --help       display this message', '', '  Examples:', '    $ music-cli Hello', '']

  console.log(lines.join('\n'))
  process.exit(code || 0)
}

const main = async (argv) => {
  if (!argv || !argv.length) {
    printHelp(1)
  }

  let arg = argv[0]

  switch (arg) {
    case '-v':
    case '-V':
    case '--version':
      printVersion()
      break
    case '-h':
    case '-H':
    case '--help':
      printHelp()
      break
    default:
      emitter('search', arg)
      break
  }
}

main(process.argv.slice(2))
module.exports = main
