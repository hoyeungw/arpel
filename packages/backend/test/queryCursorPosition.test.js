import { clear, cursor } from '@arpel/escape'
import { setInterval }   from 'timers/promises'
import { IO }            from '../src/IO.js'

process.stdout.write(clear.ENTIRE_SCREEN + cursor.goto(1, 1))
console.debug(process.argv)
console.debug('>>', '[stdout.isTTY]', process.stdout.isTTY, '[stdin.isRaw]', process.stdin.isRaw)
console.debug('>>', 'move/click/drag mouse, or press keys...')

const io = IO.build()
for await (const startTime of setInterval(1000, Date.now())) {
  const coord = await io.asyncCursorPos()
  const now = Date.now()
  console.debug('>>', 'cursor-position', coord, now - startTime, io.height, io.width, io.size)
}
io.removeEvents()

// setInterval(() => {
//   process.stdout.write(cursor.QUERY_POS)
// }, 1000)