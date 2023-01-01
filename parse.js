const {sync, async} = require('sync-or-async');
const
  parse
  = function*(parser, iter)
    { let res;
      do res = parser.next(yield iter.next()); while (!res.done);
      return res;}
exports.parseIter = (parser, iter) => sync(parse(parser, iter))
exports.parseAsyncIter = (parser, aIter) => async(parse(parser, aIter))
