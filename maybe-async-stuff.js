'use strict';

const {elem, done, endThis} = require('./next');

const
  final
  = function *(iter)
    {let value; while (!({value} = yield iter.next()).done); return value;}

, dDone = done(done())
, doneNextRet = {next: () => dDone}
, doneNext = () => doneNextRet

, innerNextFn = function() {this.next = this.nextNext; return this.ret;}

, out
  = function(o)
    {o.done && (this.this.next = doneNext); return endThis(this, o);}

, transformOuts
  = ( () =>
      { const
          next
          = function(o)
            { return (
                { this: this
                , ret: elem(this.inner.next(o))
                , nextNext: toTsfmr
                , next: innerNextFn});}
        , toTsfmr
          = function(o)
            {this.next = out; return elem(this.this.tsfmr.next(o));};
        return (tsfmr, inner) => ({tsfmr, inner, next});})
    ()
, elemMapper
  = fn => ({next: o => o.done ? endThis(this, o.value) : elem(fn(o.value))})
, finalMapper = fn => ({next: o => o.done ? endThis(this, fn(o.value)) : o})

, into
  = ( () =>
      { const
          next
          = function()
            {this.next = tail; return {this: this, next: initToInner};}
        , initToInner = function() {return toInner.call(this);}
        , toInner
          = function(o) {this.next = out; return elem(this.this.inner.next(o));}
        , tail
          = function(o)
            { return (
                { this: this
                , ret: elem(this.from.next(o))
                , nextNext: toInner
                , next: innerNextFn});};
        return (from, inner) => ({from, inner, next});})
    ()

, setIns
  = ( () =>
      { const
          next
          = function()
            { return (
                { this: this
                , ret: elem(this.iter.next(this.o))
                , nextNext: out
                , next: innerNextFn});}
        return (o, iter) => ({o, iter, next});})
    ();

Object.assign
( exports
, { final
  , doneDoneFn: doneNext
  , innerNextFn
  , transformOuts
  , elemMapper
  , finalMapper
  , into
  , setIns});
