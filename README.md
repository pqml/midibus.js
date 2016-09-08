<h1 align="center">:bus::dash::notes::notes:</h1>
<h1 align="center">midibus.js</h1>
<h3 align="center">Web MIDI API wrapper based on <a href="http://www.smallbutdigital.com/themidibus.php">themidibus</a></h3>

<div align="center">
  <!-- License -->
  <a href="https://raw.githubusercontent.com/pqml/midibus.js/master/LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" />
  </a>
  <!-- Standard -->
  <a href="http://standardjs.com/">
    <img src="https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square" alt="Standard" />
  </a>
</div>

===

### Features

- Wrap the latest version of the Web MIDI API
- noteOff / noteOn / controllerChange events
- Setup buses with bus() to easily manage your MIDI interactions


### Installation

```sh
npm install pqml/midibus.js -S
```

### Usage

```javascript
const midi = require('midibus.js')

// Assure that the browser have gained access to the MIDI interface
midi.on('ready', () => {

  // Show available inputs & outputs
  console.log('Available inputs', midi.inputs)
  console.log('Available outputs', midi.outputs)

  // Create a new midi bus with available input & output
  const magicBus = midi.bus(midi.inputs[0], midi.outputs[0])

  // You can also omit the input or the output parameter
  const myKeyBoard = midi.bus(midi.inputs[0], null)

  // When a kb note is received, pipe it to magicBus, with a constant velocity
  myKeyBoard.on('noteOn', function (message) {
    magicBus.send('noteOn', midi.msg(message.channel, message.pitch, 80))
  })

})
```


### License
MIT.
