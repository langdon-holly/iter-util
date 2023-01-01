'use strict';

const inspect = o => util.inspect(o, false, null)
, log
  = (...args) =>
    (console.log(args.map(inspect).join("\n")), args[args.length - 1]);

const
  row0Col0In
  = function *()
    { let res = yield, row0 = 0, col0 = 0, eol;
      while (!res.done)
      { res = yield res.value;
        eol = !res.done && res.value === 10; /* LF */
        res = yield {...res, value: {value: res.value, row0, col0}};
        eol ? (++row0, col0 = 0) : ++col0;}
      return res.value;}

, indexOut
  = function *()
    { let res, index = 0;
      while (true)
      { res = yield res;
        if (res.done)
          return {...res.value, value: {...res.value.value, index}};
        (res = yield res.value);
        res.done || ++index;}}
, linesOut
  = function *()
    { let res, lastLine = [];
      const lines = [lastLine];
      while (true)
      { res = yield res;
        if (res.done)
          return {...res.value, value: {...res.value.value, lines}};
        res = yield res.value;
        if (!res.done)
          res.value === 10 // LF
          ? (lastLine = [], lines.push(lastLine))
          : lastLine.push(res.value);}}
, eofOut
  = function *()
    { let res = yield, eof = false;
      while (!res.done)
        res = yield res.value, res.done && (eof = true), res = yield res;
      return {...res.value, value: {...res.value.value, eof}};}

, ws = Buffer.from(' \t\n\r')
, delimL = Buffer.from('([{\\')
, delimR = Buffer.from(')]}|')
, msg
  = {preExpr: "whitespace, comment, or delimitation", esc: "target of escape"}
, ascii
  = _.mapValues
    ( {lf: '\n', hash: '#', backtick: '`', semicolon: ';', bang: '!'}
    , s => s.codePointAt(0));

function *itGen()
{ const
    n/*ext*/
    = (yielded, expected) =>
      ( expect = expected
      , ({value: {value, row0, col0}} = yielded).done)
  , e/*rror*/ = () => done({row0, col0, expect, nest: nest()})
  , c = done()
  , delimited
    = delim => ({t: 'delimited', d: {...stack.pop(), end: {row0, col0, delim}}})
  , begin = () => stack.push({start: {row0, col0, delim: value}, inner: []})
  , pushPos = () => stack.push({start: {row0, col0}})
  , commentBegin = () => (++nestLevel, pushPos())
  , nest = () => stack.map(({start: {row0, col0}}) => ({row0, col0}));

  let value
  , stack = []
  , commentLevel = 0
  , nestLevel = 0
  , row0
  , col0
  , expect;

  if (n(yield c, "shebang, whitespace, comment, or delimitation")) return e();

  // Shebang
  if (value === ascii.hash)
  { pushPos();
    if (n(yield c, "`!")) return e();
    if (value !== ascii.bang) return e();
    do if (n(yield c, "rest of shebang")) return e(); while (value !== ascii.lf);
    stack.pop();
    if (n(yield c, msg.preExpr)) return e();}

  while (true)
  { if (delimL.includes(value))
      if (commentLevel--)
      { commentBegin();
        do
        { if (n(yield c, "rest of comment")) return e();
          if (delimL.includes(value)) commentBegin();
          else if (delimR.includes(value)) nestLevel--, stack.pop();
          else if (value === ascii.backtick)
          {pushPos(); if (n(yield c, msg.esc)) return e(); stack.pop();}}
        while (nestLevel);}
      else break;
    else if (value === ascii.semicolon) ++commentLevel;
    else if (!ws.includes(value))
      return e();
    if (n(yield c, msg.preExpr)) return e();}

  begin();

  while (true)
  { if (n(yield c, "rest of delimitation")) return e();

    if (delimL.includes(value)) begin();
    else if (delimR.includes(value))
    { if (stack.length == 1)
        return elem({tree: delimited(value)});
      stack[stack.length - 2].inner.push(delimited(value))}
    else if (value === ascii.backtick)
    { pushPos();
      if (n(yield c, msg.esc)) return e();
      stack.pop();
      _.last(stack).inner.push({t: 'esc', d: value});}
    else
      _.last(stack).inner.push({t: 'elem', d: value});}}

const
  it
  = () =>
    map
    ( eofOut()
    , map
      ( linesOut()
      , map(indexOut(), map(row0Col0In(), itGen()))));

function *it2()
{ const n/*ext*/ = o => ({value} = o).done;
  let value;

  if (n(yield done(42)) || value !== 32) return done("space");

  if (n(yield* it())) return done(value);

  return {value};}

//const
//  theIt = mapNextReturns(sync, into(iterator(Buffer.from(" ((0)"))), it2()));
//console.log(fn(result(theIt)));
////let res;
////for (; res = theIt.next(), !res.done; console.log(res));
////console.log(res);

//const
//  theIt2
//  = mapNextReturns
//    ( async
//    , into
//      ( async function *(){for (const b of Buffer.from(" ((0)")) yield b;}()
//      , toAsync(it2())));
////theIt2.next().then(console.log);
//fnAsync(result(theIt2)).then(console.log);

//const readSte = new stream.Readable({read(){}, objectMode: true});
//[...Buffer.from(" ((0)"), null].forEach(o => readSte.push(o));
////( async () =>
////  { for await (const i of asyncIterable(streamToAsyncIter(readSte)))
////      console.log(i);})
////();
//const
//  theIt3
//  = mapNextReturns(async, into(streamToAsyncIter(readSte), toAsync(it2())));
//fnAsync(result(theIt3)).then(console.log);
////( async () =>
////  { let res;
////    for (; res = await theIt3.next(), !res.done; console.log(res));
////    console.log(res);})
////()
