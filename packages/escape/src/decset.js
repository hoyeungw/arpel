import { csi } from '../util/csi.js'

export class DECSet {
  static WRAP_ON = csi('?7h')
  static WRAP_OFF = csi('?7l')
}