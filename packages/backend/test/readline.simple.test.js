import readline                                      from 'readline'
import { ENTER_MOUSE_SEQUENCE, EXIT_MOUSE_SEQUENCE } from '../resources/mouse'

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: 'OHAI> '
})

rl.prompt()

rl.write(ENTER_MOUSE_SEQUENCE)

rl
  .on('line', (line) => {
    switch (line.trim()) {
      case 'hello':
        console.log('world!')
        break
      default:
        console.log(`Say what? I might have heard '${line.trim()}'`)
        break
    }
    rl.prompt()
  })
  .on('history', (history) => {
    console.log(`Received: ${history}`)
  })
  .on('close', () => {
    console.log('Have a great day!')
    rl.write(EXIT_MOUSE_SEQUENCE)
    process.exit(0)
  })
  .on('SIGINT', () => {
    rl.question('Are you sure you want to exit? ', (answer) => {
      if (answer.match(/^y(es)?$/i))
        rl.emit('close')
      // rl.pause()
    })
  })