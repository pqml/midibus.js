# midibus
:bus::dash::notes: Web MIDI API wrapper based on [themidibus](https://github.com/sparks/themidibus)

<br><br>

#### :globe_with_meridians: Example available on [http://pqml.github.io/midibus.js/](http://pqml.github.io/midibus.js/) :globe_with_meridians:

<br><br>

### Installation & Usage

##### Installation from npm
```sh
# using npm
$ npm install --save midibus

# or using yarn
$ yarn add midibus
```

##### Usage with a module bundler
```js
// using ES6 modules
import * as midi from 'midibus'

// using CommonJS modules
var midi = require('midibus')
```

##### Usage from a browser

```html
<script src="https://unpkg.com/midibus"></script>
<script>
  // You can find the library in window.midibus
  midibus.access(function() {})
</script>
```

<br><br>

### Example
```js
const midi = require('midibus')

// Assure that the browser have gained access to the MIDI interface
midi.access((err) => {
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
