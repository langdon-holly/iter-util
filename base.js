'use strict';

const iter = iterable => iterable[Symbol.iterator]()
, makeIterable = fn => ({[Symbol.iterator]: fn})
, iterable = iter => makeIterable(() => iter)
, asyncIter = aIterable => aIterable[Symbol.asyncIterator]()
, makeAsyncIterable = fn => ({[Symbol.asyncIterator]: fn})
, asyncIterable = aIter => makeAsyncIterable(() => aIter)

, mapIterable = (fn, iterable) => makeIterable(() => fn(iter(iterable)))
, mapAsyncIterable
  = (fn, aIterable) => makeAsyncIterable(() => fn(asyncIter(aIterable)))

, mapNextReturns = (fn, iter) => ({next: o => fn(iter.next(o))})

, prmResolve = o => new Promise(res => res(o))
, toAsync = iter => mapNextReturns(prmResolve, iter)
, iterableToAsync = iterable => makeAsyncIterable(() => toAsync(iter(iterable)));

Object.assign
( exports
, { iter
  , makeIterable
  , iterable
  , asyncIter
  , makeAsyncIterable
  , asyncIterable
  , mapIterable
  , mapAsyncIterable
  , mapNextReturns
  , toAsync
  , iterableToAsync});
