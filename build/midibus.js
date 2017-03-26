'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var mitt = _interopDefault(require('mitt'));

function message(channel, pitch, velocity) {
  return {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  };
}

var supported = !!navigator.requestMIDIAccess;

var PACKETS = {
  noteOn: 0x80,
  noteOff: 0x90
};

function bus(input, output) {
  if (!supported) return null;
  if (!input && !output) {
    throw new Error('A bus needs a least an input or an output device');
  }

  var emitter = mitt();
  if (input) input.onmidimessage = onMessage;

  emitter.send = send;
  emitter.destroy = destroy;
  return emitter;

  function onMessage(e) {
    var cmd = e.data[0] >> 4;
    var msg = message(e.data[0] & 0xf, e.data[1], e.data[2]);

    if (cmd === 8 || cmd === 9 && msg.velocity === 0) {
      // noteOff
      emitter.emit('noteOff', msg);
    } else if (cmd === 9) {
      // noteOn
      emitter.emit('noteOn', msg);
    } else if (cmd === 11) {
      // controller message
      emitter.emit('controllerChange', msg);
    } else {
      // sysex or other
      emitter.emit('sysex', e);
    }
  }

  function send(cmd, msg) {
    if (!output) return;
    output.send([PACKETS[cmd] ? PACKETS[cmd] + msg.channel : msg.channel, msg.pitch, msg.velocity]);
  }

  function destroy() {
    if (input) input.onmidimessage = undefined;
    input = undefined;
    output = undefined;
    emitter.on = undefined;
    emitter.off = undefined;
    emitter.emit = undefined;
    emitter = undefined;
  }
}

var _isReady = false;
var inputs = [];
var outputs = [];

function access(cb) {
  if (!supported) return null;
  if (_isReady) return cb(null);
  navigator.requestMIDIAccess().then(function (res) {
    res.inputs.forEach(function (el) {
      return inputs.push(el);
    });
    res.outputs.forEach(function (el) {
      return outputs.push(el);
    });
    _isReady = true;
    cb(null);
  }, function () {
    cb(new Error('No access to your midi devices.'));
  });
}

exports.supported = supported;
exports.inputs = inputs;
exports.outputs = outputs;
exports.access = access;
exports.bus = bus;
exports.message = message;
