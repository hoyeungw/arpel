export class IO {
  #i = process.stdin
  #o = process.stdout
  constructor(options) {
    if (options.input) this.#i = options.input
    if (options.output) this.#o = options.output
  }
  get input() { return this.#i }
  get output() { return this.#o }
  get size() { return this.#o.getWindowSize() }
  get width() { return this.#o.columns }
  get height() { return this.#o.rows }
}