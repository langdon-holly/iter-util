'use strict';

for (const name of ['base', 'stream', 'next', 'maybe-async-stuff'])
  Object.assign(exports, require('./' + name));
