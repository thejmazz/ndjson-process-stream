'use strict'

const { spawn } = require('child_process')

const duplexify = require('duplexify')
const { Writable } = require('readable-stream')
const ndjson = require('ndjson')

const worker = spawn('./entropy.py')

worker.stderr.on('data', (data) => {
  console.log(`stderr: ${data}`)
})

worker.on('close', (code) => {
  console.log(`child process exited with code ${code}`)
})

worker.on('error', function(err) {
  console.log('received an error: ', err)
})

const objs = [{
  'foo': 1
}, {
  'foo': 2
}, {
  'foo': 3
}]

const dup = duplexify.obj(
  new Writable({
    write(obj, enc, next) {
      const ndjsonLine = JSON.stringify(obj) + '\n'
      worker.stdin.write(ndjsonLine)
      next()
    },
    objectMode: true
  }),
  worker.stdout.pipe(ndjson.parse())
)

for (const obj of objs) {
  console.log('Sent     : ', obj)
  dup.write(obj)
}

dup.on('data', function(data) {
  console.log('Received : ', data)
})
