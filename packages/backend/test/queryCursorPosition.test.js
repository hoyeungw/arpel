import { clear, csiSet, cursor }      from '@arpel/escape'
import { DATA, EXIT }                 from '@geia/enum-events'
import { SIGINT }                     from '@geia/enum-signals'
import { KEYPRESS }                   from '@pres/enum-events'
import { decoSamples, logger, ros }   from '@spare/logger'
import { isMouseCode, parseKeycodes } from '../src/parser/index.js'

process.stdin.resume()
process.stdin
  .on(DATA, buffer => {
    const str = buffer.toString()
    let ms, r, c
    if (( ms = /\[(\d+);(\d+)R/.exec(str) ) && ( [ , r, c ] = ms )) {
      console.error('>>', ros('query-mouse-position'), str.replace(//, ros('ESC')), [ --r, --c ])
    }
    else if (isMouseCode(str)) {

    }
    else {
      console.error('>>', ros(KEYPRESS), decoSamples(parseKeycodes(str)))
    }
    if (str === '') { return void ( console.error('>> Ctrl+C'), process.emit(SIGINT, SIGINT) ) }
  })


process.once(SIGINT, (signal) => {
  logger(`>> receive signal ${ros(signal)}, closing`)
  process.exit(signal)
})
process.on(EXIT, (code) => {
  // process.stdin.setRawMode(false) // Enable "raw mode"
  logger(`>> exit with code: ${ros(String(code))}`)
})

// process.stdin.setRawMode(true) // Enable "raw mode"
process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
console.error('>>', '[stdout.isTTY]', process.stdout.isTTY, '[stdin.isRaw]', process.stdin.isRaw)
console.error(">> move/click/drag mouse, or press keys...")
// process.stdout.write(QUERY_CURSOR_POS)

setInterval(() => {
  process.stdout.write(cursor.QUERY_POS)
}, 500)