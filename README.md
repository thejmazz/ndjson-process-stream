# ndjson-process-stream

Duplex stream which takes objects, pushes them into process stdin as ndjson,
takes ndjson from the process, and returns objects. It's like a through stream
for processes. Meant as a convenience module for when you want to compute on
JSONs from an external process. Comes with hello world examples from several
languages (TODO). Exposes the underlying child process from `this.cp`.

```javascript
const ndjsonProcess = require('ndjson-process-stream')
const intoStream = require('into-stream')

const data = [
  { foo: 1 },
  { foo: 2 },
  { foo: 3 },
  { foo: 4 },
  { foo: 5 }
]

intoStream(data)
    .pipe(ndjsonProcess('./foo_doubler.py'))
    .on('data', function (data) {
      console.log('Result: ', data.foo)

      // Python process has while True loop, need to manually kill
      if (data.foo === 10) this.cp.kill()
    })
```

## Script Examples

TODO Node, R, Go, ...

### Python

TODO a way without `while True` that doesn't have to wait for EOF from stdin?


```python
#!/usr/bin/env python

import sys
import json

def compute(obj):
    obj['foo'] *= 2
    return obj

try:
    buff = ''
    while True:
        buff += sys.stdin.read(1)
        if buff.endswith('\n'):
            results = compute(json.loads(buff))
            print(json.dumps(results))
            sys.stdout.flush()
            buff = ''
except KeyboardInterrupt:
    sys.stdout.flush()
    pass
```

## License

MIT [http://jmazz.mit-license.org/](http://jmazz.mit-license.org/)
