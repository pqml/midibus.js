# midibus.js
### Web MIDI API wrapper based on themidibus

<br><br>

### Installation & Usage

##### Installation from npm
```sh
# using npm
$ npm install --save midibus.js

# or using yarn
$ yarn add midibus.js
```

##### Usage with a module bundler
```js
// using ES6 modules
import * as midi from 'midibus.js'

// using CommonJS modules
var midi = require('midibus.js')
```

##### Usage from a browser

```html
<script src="https://unpkg.com/midibus.js"></script>
<script>
  // You can find the library in window.Midibus
  Midibus.access(function() {})
</script>
```

<br><br>

### Example
```js
const midi = require('midibus.js')

// Assure that the browser have gained access to the MIDI interface
midi.on('ready', (err) => {
  // Catch Error
  if (err) throw err

  // Show available inputs & outputs
  console.log('Available inputs', midi.inputs)
  console.log('Available outputs', midi.outputs)

  // Create a new midi bus with available input & output
  const magicBus = midi.bus(midi.inputs[0], midi.outputs[0])

  // You can also omit the input or the output parameter
  const myKeyBoard = midi.bus(midi.inputs[1], null)

  // When a kb note is received, pipe it to magicBus, with a constant velocity
  myKeyBoard.on('noteOn', ({channel, pitch}) => {
    magicBus.send('noteOn', midi.msg(channel, pitch, 80))
  })

})
```

<br><br>

### License
MIT.
