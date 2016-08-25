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

// === EXAMPLE ===

const objs = [{
  'foo': 1
}, {
  'foo': 2
}, {
  'foo': 3
}]

const chugger = throughProcess('./entropy.py')

chugger.on('data', function(data) {
  console.log('Received : ', data)
})

for (const obj of objs) {
  console.log('Sent     : ', obj)
  chugger.write(obj)
}

// chugger.end()
