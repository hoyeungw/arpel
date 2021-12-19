import { cursor }        from '@arpel/escape'
import { DATA, EXIT }    from '@geia/enum-events'
import { SIGINT }        from '@geia/enum-signals'
import { ros }           from '@spare/logger'
import { valid }         from '@typen/nullish'
import { EventEmitter }  from 'events'
import { StringDecoder } from 'string_decoder'
import { setTimeout }    from 'timers/promises'
import { QUERY_CURSOR }  from '../resources/events.js'

export const ARPEL = ros('arpel')

export class IO extends EventEmitter {
  #i = process.stdin
  #o = process.stdout
  #d = new StringDecoder('utf-8')
  #h = {}
  #raw = this.#i.isRaw
  #log = true
  constructor(options = {}) {
    super()
    if (options.input) this.#i = options.input
    if (options.output) this.#o = options.output
    if (valid(options.log)) this.#log = options.log
    this.configEvents()
  }
  static build(options) { return new IO(options) }
  static logger(...args) { console.debug(`${ARPEL} >>`, ...args)}

  configEvents() {
    this.#i.setRawMode(true)
    this.#h.queryCursor = this.#queryCursorResolver.bind(this)
    this.#i.on(DATA, this.#h.data = this.#dataHandler.bind(this))
    process.on(SIGINT, this.#h.sigint = this.#sigintHandler.bind(this))
    process.on(EXIT, this.#h.exit = this.#exitHandler.bind(this))
  }
  removeEvents() {
    this.#i.setRawMode(this.#raw)
    if (this.#h.queryCursor) this.removeAllListeners(QUERY_CURSOR), delete this.#h.queryCursor
    if (this.#h.data) this.#i.off(DATA, this.#h.data), delete this.#h.data
    if (this.#h.sigint) process.off(SIGINT, this.#h.sigint), delete this.#h.sigint
    if (this.#h.exit) process.off(EXIT, this.#h.exit), delete this.#h.exit
    if (this.#log) IO.logger(
      'remove events',
      ros(QUERY_CURSOR),
      this.listenerCount(QUERY_CURSOR),
      ros(DATA),
      this.#i.listenerCount(DATA),
      ros(SIGINT),
      process.listenerCount(SIGINT),
      ros(EXIT),
      process.listenerCount(EXIT),
    )
  }
  get input() { return this.#i }
  get output() { return this.#o }
  get decoder() { return this.#d }
  get handlers() { return this.#h }
  get size() { return this.#o.getWindowSize() }
  get width() { return this.#o.columns }
  get height() { return this.#o.rows }
  asyncCursorPos() { return new Promise(this.#h.queryCursor) }

  #queryCursorResolver(cursorHandler) {
    this.#o.write(cursor.QUERY_POS)
    this.once(QUERY_CURSOR, coord => cursorHandler(coord))
    Promise.resolve(setTimeout(800)).then(() => cursorHandler([ null, null ]))
  }
  #dataHandler(buffer) {
    const str = this.#d.write(buffer)
    let ms, r, c
    if (( ms = /\[\??(\d+);(\d+)R/.exec(str) ) && ( [ , r, c ] = ms )) this.emit(QUERY_CURSOR, [ r, c ])
    // console.error('>>', ros('query-mouse-position'), str.replace(//, ros('ESC')), [ --r, --c ],)
    // else if (isMouseCode(str)) {}
    // else IO.logger(ros(KEYPRESS), decoSamples(parseKeycodes(str)))
    if (str === '') process.emit(SIGINT, SIGINT)
  }
  #sigintHandler(signal) {
    if (this.#log) IO.logger(`receive signal: ${ros(signal)}, closing`)
    process.exit(signal)
  }
  #exitHandler(code) {
    this.removeEvents()
    if (this.#log) IO.logger(`exit with code: ${ros(String(code))}`)
  }

}