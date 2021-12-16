import { clear, cursor }              from '@arpel/escape'
import { DATA, EXIT }                 from '@geia/enum-events'
import { SIGINT }                     from '@geia/enum-signals'
import { KEYPRESS }                   from '@pres/enum-events'
import { decoSamples, logger, ros }   from '@spare/logger'
import { setInterval }                from 'timers/promises'
import { IO }                         from '../src/IO.js'
import { isMouseCode, parseKeycodes } from '../src/parser/index.js'

// process.stdin.resume()


process.stdin
  .on(DATA, buffer => {
    const str = buffer.toString()
    let ms, r, c
    if (( ms = /\[\??(\d+);(\d+)R/.exec(str) ) && ( [ , r, c ] = ms )) {
      io.input.emit('QUERY_CURSOR', buffer)

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
  process.stdin.setRawMode(false) // Enable "raw mode"
  logger(`>> exit with code: ${ros(String(code))}`)
})

process.stdin.setRawMode(true) // Enable "raw mode"
process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
console.error(process.argv)
console.error('>>', '[stdout.isTTY]', process.stdout.isTTY, '[stdin.isRaw]', process.stdin.isRaw)
console.error(">> move/click/drag mouse, or press keys...")

const io = IO.build()
for await (const startTime of setInterval(1000, Date.now())) {
  const coord = await io.asyncCursorPos()
  const now = Date.now()
  console.error('>>', 'cursor-position', coord, now - startTime, io.height, io.width, io.size)
}

// setInterval(() => {
//   process.stdout.write(cursor.QUERY_POS)
// }, 1000)