'use strict'

const path = require('path')
const intoStream = require('into-stream')
const { assert } = require('chai')

const throughput = require('../')

const data = [
  { foo: 1 },
  { foo: 2 },
  { foo: 3 },
  { foo: 4 },
  { foo: 5 }
]

describe('throughProcess', function() {
  it('should double property `foo` on objects', function (done) {
    let num = 1

    intoStream.obj(data)
      .pipe(throughput(path.resolve(__dirname, 'foo_doubler.py')))
      .on('data', function(data) {
        assert.equal(num*2, data.foo)
        num++

        if (num === 6) {
          this.cp.kill()
          done()
        }
      })
  })
})
