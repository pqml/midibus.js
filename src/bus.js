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
