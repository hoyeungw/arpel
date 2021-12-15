import { clear, csiSet, cursor }                  from '@arpel/escape'
import { DATA, EXIT }                             from '@geia/enum-events'
import { SIGINT, SIGQUIT, SIGTERM }               from '@geia/enum-signals'
import { KEYPRESS, MOUSE }                        from '@pres/enum-events'
import { logger, ros }                            from '@spare/logger'
import { isMouseCode, parseKeycodes, parseMouse } from '../src/parser/index.js'

process.stdin.resume()
let status = false
process.stdin
  .on(DATA, buffer => {
    if (!status) {
      status = true
      process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
    }
    // process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
    process.stdout.write(cursor.goto(1, 1) + clear.AFTER_CURSOR)
    const str = buffer.toString()
    if (isMouseCode(str)) {   // mouse event
      console.error('>>', ros(MOUSE), parseMouse(str))
    }
    else {
      console.error('>>', ros(KEYPRESS), parseKeycodes(str))
    }
    if (str === '') { return void ( console.error('>> Ctrl+C'), process.stdin.pause() ) }
    if (str === '') { return void ( console.error('>> Ctrl+D'), process.stdin.pause() ) }
    if (str === '') { return void ( console.error('>> Ctrl+Z'), process.stdin.pause() ) }
  })


const signaler = (signal) => { logger(`>> receive signal ${ros(signal)}, closing`) }
process.once(SIGINT, signaler)
process.once(SIGTERM, signaler)
process.once(SIGQUIT, signaler)
process.on(EXIT, (code) => {
  // process.stdout.write(ENTER_MOUSE_SEQUENCE)
  process.stdout.write(csiSet('?1005l', '?1003l')) // Turn off "mouse reporting"
  process.stdin.setRawMode(false) // Enable "raw mode"
  logger(`>> exit with code: ${ros(String(code))}`)
})

process.stdin.setRawMode(true) // Enable "raw mode"
// process.stdout.write(EXIT_MOUSE_SEQUENCE)
process.stdout.write(csiSet('?1003h', '?1005h')) // Enable "mouse reporting"
process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
console.error('>>', '[stdout.isTTY]', process.stdout.isTTY, '[stdin.isRaw]', process.stdin.isRaw)
process.stdout.write(">> move/click/drag mouse, or press keys...")
// process.stdout.write(QUERY_CURSOR_POS)