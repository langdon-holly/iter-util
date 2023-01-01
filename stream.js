'use strict';

const {Writable} = require('stream');

const
  streamToAsyncIter
  = async function *(rStream)
    { const wStream
        = Writable
          ( { write(...[value,, cb])
              {resolve({value}), rStream.unpipe(this), cb(null);}
            , final(cb) {resolve(done()), rStream.unpipe(this), cb(null);}
            , objectMode: true});
      let next, resolve;
      while (true)
      { next
        = await new Promise(reso => (resolve = reso, rStream.pipe(wStream)));
        if (next.done) return next.value;
        yield next.value;}};

Object.assign(exports, {streamToAsyncIter});
