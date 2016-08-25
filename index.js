'use strict'

const { spawn } = require('child_process')
const split = require('split2')
const { Readable, Writable } = require('readable-stream')
const through = require('through2')

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

const computeStream = through.obj(function (obj, enc, next) {
  const ndjsonLine = JSON.stringify(obj) + '\n'

  worker.stdin.write(ndjsonLine)
  next()
})

computeStream.on('error', function (err) {
  console.log('ERROR: ', err)
})

const objs = [{
  'foo': 1
}, {
  'foo': 2
}, {
  'foo': 3
}]

for (const obj of objs) {
  console.log('Sent     : ', obj)
  computeStream.write(obj)
}

worker.stdout.pipe(split()).on('data', function(data) {
  const obj = JSON.parse(data)
  console.log('Received : ', obj)
})
