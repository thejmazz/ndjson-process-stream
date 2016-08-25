'use strict'

const throughput = require('.')

const { assert } = require('chai')
const intoStream = require('into-stream')

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
      .pipe(throughput('./foo_doubler.py'))
      .on('data', function(data) {
        assert.equal(num*2, data.foo)
        num++

        if (num === 6) done()
      })
  })
})
