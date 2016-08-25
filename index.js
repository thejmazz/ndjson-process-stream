'use strict'

const { spawn } = require('child_process')

const duplexify = require('duplexify')
const ndjson = require('ndjson')

const throughProcess = (command, args = [], opts = {}) => {
  const cp = spawn(command, args, opts)

  const dup = duplexify.obj(
    ndjson.serialize().on('data', json => cp.stdin.write(json)),
    cp.stdout.pipe(ndjson.parse())
  )
  dup.cp = cp

  return dup
}

module.exports = throughProcess
