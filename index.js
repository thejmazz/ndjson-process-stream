'use strict'

const { spawn } = require('child_process')

const duplexify = require('duplexify')
const eos = require('end-of-stream')
const ndjson = require('ndjson')

const throughProcess = (command, args = [], opts = {}) => {
  const cp = spawn(command, args, opts)

  const serializer = ndjson.serialize()
  serializer.on('data', json => cp.stdin.write(json))
  eos(serializer, (err) => {
    cp.stdin.end()
  })

  const parser = cp.stdout.pipe(ndjson.parse())
  eos(parser, (err) => {
    // console.log('parser finished')
  })

  const dup = duplexify.obj(
    serializer,
    parser
  )
  dup.cp = cp

  return dup
}

module.exports = throughProcess
