import bus from './bus'
import message from './message'
import supported from './supported'

let _isReady = false
let inputs = []
let outputs = []

function access (cb) {
  if (!supported) return null
  if (_isReady) return cb(null)
  navigator.requestMIDIAccess().then(
    (res) => {
      res.inputs.forEach(el => inputs.push(el))
      res.outputs.forEach(el => outputs.push(el))
      _isReady = true
      cb(null)
    },
    () => {
      cb(new Error('No access to your midi devices.'))
    })
}

export { supported, inputs, outputs, access, bus, message }
