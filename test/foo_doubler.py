#!/usr/bin/env python -u

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
            # sys.stdout.flush()
            buff = ''
except KeyboardInterrupt:
    sys.stdout.flush()
    pass

