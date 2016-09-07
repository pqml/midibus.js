(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function E () {
  // Keep this empty so it's easier to inherit from
  // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
}

E.prototype = {
  on: function (name, callback, ctx) {
    var e = this.e || (this.e = {});

    (e[name] || (e[name] = [])).push({
      fn: callback,
      ctx: ctx
    });

    return this;
  },

  once: function (name, callback, ctx) {
    var self = this;
    function listener () {
      self.off(name, listener);
      callback.apply(ctx, arguments);
    };

    listener._ = callback
    return this.on(name, listener, ctx);
  },

  emit: function (name) {
    var data = [].slice.call(arguments, 1);
    var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
    var i = 0;
    var len = evtArr.length;

    for (i; i < len; i++) {
      evtArr[i].fn.apply(evtArr[i].ctx, data);
    }

    return this;
  },

  off: function (name, callback) {
    var e = this.e || (this.e = {});
    var evts = e[name];
    var liveEvents = [];

    if (evts && callback) {
      for (var i = 0, len = evts.length; i < len; i++) {
        if (evts[i].fn !== callback && evts[i].fn._ !== callback)
          liveEvents.push(evts[i]);
      }
    }

    // Remove event from queue to prevent memory leak
    // Suggested by https://github.com/lazd
    // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

    (liveEvents.length)
      ? e[name] = liveEvents
      : delete e[name];

    return this;
  }
};

module.exports = E;

},{}],2:[function(require,module,exports){
'use strict'

var Emitter = require('tiny-emitter')
var cmdPackets = {
  'noteOff': 0x80,
  'noteOn': 0x90
}

function bus (input, output) {
  input = (typeof input !== 'undefined') ? input : null
  output = (typeof output !== 'undefined') ? output : null
  if (input === null && output === null) return false

  var emitter = new Emitter()
  if (input !== null) input.onmidimessage = onInput

  function onInput (event) {
    var cmd = event.data[0] >> 4
    var message = {
      channel: event.data[0] & 0xf,
      pitch: event.data[1],
      velocity: event.data[2]
    }
    if (cmd === 8 || ((cmd === 9) && (message.velocity === 0))) { // noteOff
      emitter.emit('noteOff', message)
    } else if (cmd === 9) { // noteOn
      emitter.emit('noteOn', message)
    } else if (cmd === 11) { // controller message
      emitter.emit('controllerChange', message)
    } else {
      // sysex or other.
    }
  }

  function send (cmd, message) {
    if (output === null) return
    if (cmdPackets[cmd]) message.channel = cmdPackets[cmd] + message.channel
    output.send([message.channel, message.pitch, message.velocity])
  }

  return {
    send: send,
    on: emitter.on.bind(emitter),
    once: emitter.on.bind(emitter)
  }
}

module.exports = bus

},{"tiny-emitter":1}],3:[function(require,module,exports){
'use strict'

function message (channel, pitch, velocity) {
  return {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }
}

module.exports = message

},{}],4:[function(require,module,exports){
'use strict'

var bus = require('./bus')
var message = require('./message')
var Emitter = require('tiny-emitter')
var emitter = new Emitter()

var isReady = false
var isSupported = !!navigator.requestMIDIAccess
var inputs = []
var outputs = []

if (isSupported) navigator.requestMIDIAccess().then(onAccess, onAccessError)

function onAccess (midiAccess) {
  for (var input of midiAccess.inputs.values()) { inputs.push(input) }
  for (var output of midiAccess.outputs.values()) { outputs.push(output) }
  isReady = true
  emitter.emit('ready')
}

function onAccessError () {
  console.error('No access to your midi devices.')
}

function createBus (input, output) {
  if (!isSupported || !isReady) return false
  return bus(input, output)
}

module.exports = {
  isSupported: isSupported,
  inputs: inputs,
  outputs: outputs,
  bus: createBus,
  message: message,
  msg: message,
  on: emitter.on.bind(emitter),
  once: emitter.once.bind(emitter)
}

},{"./bus":2,"./message":3,"tiny-emitter":1}]},{},[4]);
