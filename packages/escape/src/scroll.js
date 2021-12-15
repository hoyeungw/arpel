import { csi } from '../util/csi.js'

export class Scroll {
  static up = (n) => csi(`${n}S`)
  static down = (n) => csi(`${n}T`)
}
