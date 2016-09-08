'use strict'

var bus = require('./bus.js')
var message = require('./message.js')
var Emitter = require('tiny-emitter')
var emitter = new Emitter()

var isReady = false
var isSupported = !!navigator.requestMIDIAccess
var inputs = []
var outputs = []

if (isSupported) navigator.requestMIDIAccess().then(onAccess, onAccessError)

function onAccess (midiAccess) {
  midiAccess.inputs.forEach(function (el) { inputs.push(el) })
  midiAccess.outputs.forEach(function (el) { outputs.push(el) })
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
