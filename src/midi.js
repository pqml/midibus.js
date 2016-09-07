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
