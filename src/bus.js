import mitt from 'mitt'
import message from './message'
import supported from './supported'

const PACKETS = {
  noteOn: 0x80,
  noteOff: 0x90
}

function bus (input, output) {
  if (!supported) return null
  if (!input && !output) {
    throw new Error('A bus needs a least an input or an output device')
  }

  const emitter = mitt()
  if (input) input.onmidimessage = onMessage

  emitter.send = send
  return emitter

  function onMessage (e) {
    const cmd = e.data[0] >> 4
    const msg = message(e.data[0] & 0xf, e.data[1], e.data[2])

    if (cmd === 8 || ((cmd === 9) && (msg.velocity === 0))) { // noteOff
      emitter.emit('noteOff', msg)
    } else if (cmd === 9) { // noteOn
      emitter.emit('noteOn', msg)
    } else if (cmd === 11) { // controller message
      emitter.emit('controllerChange', msg)
    } else { // sysex or other
      emitter.emit('sysex', e)
    }
  }

  function send (cmd, msg) {
    if (!output) return
    output.send([
      PACKETS[cmd] ? PACKETS[cmd] + msg.channel : msg.channel,
      msg.pitch,
      msg.velocity
    ])
  }
}

export default bus
