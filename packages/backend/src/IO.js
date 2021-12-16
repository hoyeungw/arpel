import { cursor }       from '@arpel/escape'
import { DATA, EXIT }   from '@geia/enum-events'
import { SIGINT }       from '@geia/enum-signals'
import { logger, ros }  from '@spare/logger'
import { EventEmitter } from 'events'
import { setTimeout }   from 'timers/promises'

export class IO extends EventEmitter {
  #i = process.stdin
  #o = process.stdout
  #raw = this.#i.isRaw
  constructor(options = {}) {
    super()
    if (options.input) this.#i = options.input
    if (options.output) this.#o = options.output
    this.configEvents()
  }
  static build(options) { return new IO(options) }
  configEvents() {
    this.#i.setRawMode(true)
    this.#i.on(DATA, buffer => {
      const str = buffer.toString()
      let ms, r, c
      if (( ms = /\[\??(\d+);(\d+)R/.exec(str) ) && ( [ , r, c ] = ms )) this.emit('QUERY_CURSOR', [ r, c ])
      // console.error('>>', ros('query-mouse-position'), str.replace(//, ros('ESC')), [ --r, --c ],)
      // else if (isMouseCode(str)) {}
      // else {} // console.error('>>', ros(KEYPRESS), decoSamples(parseKeycodes(str)))
      if (str === '') process.emit(SIGINT, SIGINT)
    })
    process.once(SIGINT, (signal) => {
      logger(`>> receive signal ${ros(signal)}, closing`)
      process.exit(signal)
    })
    process.on(EXIT, (code) => {
      this.#i.setRawMode(this.#raw) // Enable "raw mode"
      logger(`>> exit with code: ${ros(String(code))}`)
    })
  }
  get input() { return this.#i }
  get output() { return this.#o }
  get size() { return this.#o.getWindowSize() }
  get width() { return this.#o.columns }
  get height() { return this.#o.rows }
  asyncCursorPos() {
    return new Promise((resolve) => {
      this.#o.write(cursor.QUERY_POS)
      this.once('QUERY_CURSOR', resolve)
      Promise.resolve(setTimeout(800)).then(() => resolve([ null, null ]))
    })
  }
}