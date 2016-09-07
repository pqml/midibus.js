'use strict'

function message (channel, pitch, velocity) {
  return {
    channel: channel,
    pitch: pitch,
    velocity: velocity
  }
}

module.exports = message
