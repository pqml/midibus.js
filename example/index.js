'use strict'

var midi = require('./../src/midi')
var ableton = null
var keyboard = null

// Assure that the browser have access to MIDI
midi.once('ready', function () {
  // Show available inputs & outputs
  console.log('Available inputs', midi.inputs)
  console.log('Available outputs', midi.outputs)

  // Create two midi bus, for my keyboard and a IAC bus for ableton
  keyboard = midi.bus(midi.inputs[2], null)
  ableton = midi.bus(null, midi.outputs[0])

  // When a kb note is received, pipe it to ableton, with a constant velocity
  keyboard.on('noteOn', function (message) {
    console.log('note received', message.pitch)
    ableton.send('noteOn', midi.msg(message.channel, message.pitch, 80))
  })

  // Pipe noteOff messages
  keyboard.on('noteOff', function (message) {
    ableton.send('noteOff', message)
  })
})
