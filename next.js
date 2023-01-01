'use strict';

const elem = value => ({done: false, value})
, done = value => ({done: true, value})

, doneVal = done()
, doneFn = () => doneVal
, endThis = (This, value) => (This.next = doneFn, done(value));

Object.assign(exports, {elem, done, endThis});
